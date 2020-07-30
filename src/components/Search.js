import React, { Component } from 'react';
import { TextField, InputAdornment } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress, Chip } from '@material-ui/core'

import styles from '../styles/SearchStyles'

import firebase from '../firebase'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false, 
            options: []
        }
    }

    setOpen = async (bool) => {
        if (bool){
            this.setState({ open: true })
            this.getData()
        }
        else {
            this.setState({ open: false, options: [] })
        }
    }

    getData = async () => {
        let promises = []
        promises.push(firebase.database().ref('online_channels').once('value'))
        promises.push(firebase.database().ref('offline_channels').once('value'))

        let channels = []
        await Promise.all(promises).then(([online_snapshots, offline_snapshots]) => {
            let onlineChannels = online_snapshots.val()
            let offlineChannels = offline_snapshots.val()
            for (let channel in onlineChannels){
                let channelObj = onlineChannels[channel]
                channelObj.categories.forEach(category => {
                    channels.push({
                        name: channelObj.channel,
                        user: category.user,
                        category: category.name,
                        web: 'Online'
                    })
                })
            }
            for (let channel in offlineChannels) {
                let channelObj = offlineChannels[channel]
                channels.push({
                    name: channelObj.channel,
                    user: channelObj.user,
                    web: 'Offline'
                })
            }
        })
        this.setState({ options: channels })   
    }

    render() {
        const { open, options } = this.state
        const { classes } = this.props
        const loading = open && options.length === 0;
        return (
            <Autocomplete
                autoHighlight
                fullWidth

                options={options}
                loading={loading}

                onClose={() => {
                    this.setOpen(false);
                }}

                open = {open}

                onOpen={() => {
                    this.setOpen(true);
                }}
                // value={props.value ? [...fixedOption, ...props.value.filter((option) => option.id !== chosenCategoryId || option.user.toLowerCase() !== pathname.toLowerCase())] : fixedOption}

                onChange={(event, value, reason) => {
                    console.log(value)// watch the null valu 
                }}

                getOptionLabel={(option) => option.name}
                renderOption={(option) => 
                    <div> 
                        <div style = {{display: 'flex'}}>
                            <p style = {{margin: '0px', fontSize: '16px', color: '#353b51'}}> {option.name} </p>
                            <Chip size="small" label={option.web} style={{ margin: '0px 4px', backgroundColor: option.web === "Online" ? '#b6bbcf' : '#bebebe'}}/>
                        </div>
                        <p style={{ margin: '0px', fontSize: '14px' }}> {option.user + (option.category ? " / " + option.category : '')} </p>
                    </div>
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps, 
                            // disableUnderline: true, 
                            startAdornment: (
                                <InputAdornment>
                                    <SearchIcon style = {{margin: '2px'}}/>
                                </InputAdornment>
                            ), 
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            className: classes.input
                        }}
                        placeholder = {'Search'}
                        className = {classes.underline}
                    />
                )}
            />
        );
    }
}

export default withStyles(styles)(Search);