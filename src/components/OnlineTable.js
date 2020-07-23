import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import { TextField, Paper, Select, MenuItem, Fade } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import tableIcons from '../styles/tableIcons'
import MaterialTable, { MTableCell, MTableBodyRow, MTableEditRow, MTableToolbar } from 'material-table'
import MyAction from './MyAction'

import users_list from '../static/Usertypes'

import firebase from '../firebase'

const styles = {
    // textField components for editRow cells
    textfield: {
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B',
        },
    }, 
    // select components for editRow cells
    select: {
        textAlign: 'center',
        color: '#707070',
        "&:focus": {
            backgroundColor: "#FFFFFF"
        },
        "&:hover": {
            color: '#2B2B2B',
        },
    },
    // rows (edit + normal)
    tableRow: {
        color: '#707070',
        "& td": {
            border: "1px solid black !important",
        }
    }, 
    // toolBar 
    toolBar: { 
        padding: '0px', 
        margin: '0px',
    }, 
    Icon: {
        color: '#707070',
        "&:hover": {
            color: '#2B2B2B'
        },
        "&:focus": {
            color: '#2B2B2B'
        },
        "&:active": {
            color: '#2B2B2B'
        }
    },
}

class OnlineTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online', // 'Online' or 'Offline'
            pathname: 'Enthusiasts', // indicates the User

            categories: [], // list of category names
            chosenCategoryId: '', // chosenCategoryId

            data:[],
            isLoaded: false,
        }
    }

    // called when 1) pathname/user changes or 2) chosenCategory changes
    update() {
        // const { pathname } = this.state 
        // const catRef = firebase.database().ref('/order/' + pathname)
        // catRef.on('value', (snapshot) => {
        //     let categories = snapshot.val();
        //     this.setState({
        //         categories: categories || [],
        //         isLoaded: true
        //     })
        // })

        const { pathname, chosenCategoryId } = this.state

        let channelIdsRef = firebase.database().ref('Online/' + pathname + '/' + chosenCategoryId)
        channelIdsRef.on('value', async (snapshot) => {
            let channels = []
            let channelPromises = []

            snapshot.forEach((channelSnapShot) => {
                channelPromises.push(firebase.database().ref('/channels/' + channelSnapShot.key).once('value'))
            })

            await Promise.all(channelPromises).then((snapshots) => {
                snapshots.forEach((snapshot) => {
                    let channelDetails = snapshot.val()
                    channelDetails['id'] = snapshot.key
                    channels.push(channelDetails)
                })
            })
            console.log(channels)
            
            this.setState({ data: channels, isLoaded: true })
        })
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newPathname = nextProps.location.pathname.substring(1) || users_list[0]
        return (newPathname.toLowerCase() !== prevState.pathname.toLowerCase() || 
            nextProps.chosenCategoryId !== prevState.chosenCategoryId )
            ? {
                pathname: newPathname, 
                chosenCategoryId: nextProps.chosenCategoryId,
                isLoaded: false,
            }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    render() {
        const { isLoaded, pathname, data } = this.state
        const { classes } = this.props

        const title =  'Online User: '+ pathname  

        let pageSizes = [10, 20, 30]
        if (data.length > 30) pageSizes.push(data.length)

        console.log(this.state.data)
        return (
            <Fade in = {isLoaded} >
                <MaterialTable

                    title = {title}

                    style={{ margin: '30px' }}

                    columns={[
                        {   title: 'Channels', 
                            field: 'channel', 
                            width: "10%",
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    value={props.value}
                                    placeholder={'Channel'}
                                    onChange={e => props.onChange(e.target.value)}
                                    rows = {1}
                                    fullWidth
                                    InputProps={{ disableUnderline: true, className: classes.textfield }}
                                    autoFocus
                                />
                            ),
                        },
                        {   title: 'Rating', 
                            field: 'rating', 
                            width: '7%',
                            editComponent: props => (
                                <Select
                                    value={props.value}
                                    onChange={e => props.onChange(e.target.value)}
                                    fullWidth
                                    disableUnderline
                                    inputProps={{
                                        classes: { select: classes.select }
                                    }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                </Select>
                            ),
                        },
                        {
                            title: 'Customer Description',
                            field: 'customer_description',
                            width: '20%',
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    value={props.value}
                                    placeholder={'Customer Description'}
                                    onChange={e => props.onChange(e.target.value)}
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    InputProps={{ disableUnderline: true, className: classes.textfield }}
                                />
                            )
                        },
                        {   title: 'Tech, Product, Market, Company', 
                            field: 'TPMC', 
                            width: "20%",
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    value={props.value}
                                    placeholder={'Tech, Product, Market, Company'}
                                    onChange={e => props.onChange(e.target.value)}
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    InputProps={{ disableUnderline: true, className: classes.textfield }}                               
                                />
                            )
                        },
                        {   title: 'How to Leverage', 
                            field: 'leverage', 
                            width: '20%',
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    value={props.value}
                                    placeholder={'Customer Description'}
                                    onChange={e => props.onChange(e.target.value)}
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    InputProps={{ disableUnderline: true, className: classes.textfield }}
                                />
                            )
                        }, 
                        {   title: 'Sub/Link', 
                            field: 'link', 
                            width: '10%',
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    value={props.value}
                                    placeholder={'Sub/Link'}
                                    onChange={e => props.onChange(e.target.value)}
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    InputProps={{ disableUnderline: true, className: classes.textfield }}
                                />
                            ),                            
                        }, 
                        {
                            title: 'Categories',
                            field: 'categories',
                            width: '13%', 
                            sorting: false,
                            editComponent: props => (
                                // <TextField
                                //     value={props.value}
                                //     placeholder={'Categories'}
                                //     onChange={e => props.onChange(e.target.value)}
                                //     rows={3}
                                //     rowsMax={6}
                                //     fullWidth
                                //     multiline
                                //     InputProps={{ disableUnderline: true, className: classes.textfield }}
                                // />
                                <Autocomplete
                                    multiple
                                    options={this.state.categories}
                                    // getOptionLabel={(option) => option.title}
                                    defaultValue={[]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                        />
                                    )}
                                />
                            ),
                        },
                    ]}

                    icons={tableIcons}

                    components={{
                        Container: props => <Paper {...props} elevation={0} />,
                        Cell: props => < MTableCell {...props} style={{
                            margin: '0px',
                            padding: '10px',
                            textAlign: 'center',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                        }} />,
                        EditRow: props => (
                            <MTableEditRow {...props} className={classes.tableRow} 
                                onKeyDown={(e) => {
                                    if (e.keyCode === 27) {
                                        props.onEditingCanceled(props.mode, props.data)
                                    }
                                }} 
                            />
                        ),
                        Row: props => (
                            <MTableBodyRow {...props} className={classes.tableRow} />
                        ),
                        Action: props => <MyAction {...props} />,
                        Toolbar: props => (
                            <MTableToolbar {...props} classes={{ root: classes.toolBar }} />
                        )
                    }}

                    data = {data}

                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No channels to display.',
                            addTooltip: '',
                            deleteTooltip: '',
                            editTooltip: '',
                            editRow:{
                                deleteText: '\xa0\xa0Are you sure you want to delete this channel?'
                            }
                        },
                        pagination: {
                            labelRowsSelect: 'channels',
                            labelRowsPerPage: 'Channels per page:'
                        }
                    }}

                    options={{  
                        actionsCellStyle: { padding: '1px', margin: '0px' },
                        emptyRowsWhenPaging: false,
                        exportButton: true,
                        exportFileName: title,
                        headerStyle: {  backgroundColor: '#707070', 
                                        color: '#FFFFFF', 
                                        fontSize: '16px', 
                                        padding:'10px', 
                                        wordBreak: 'break-word', 
                                        border: '1px solid black', 
                                        textAlign: 'center' }, 
                        loadingType: 'linear', 
                        pageSize: 10, 
                        pageSizeOptions: pageSizes,
                        paginationType: 'stepped',
                        search: false,
                        tableLayout: 'fixed',
                        showTitle: false, 
                        toolbarButtonAlignment: 'left',
                        draggable: false, 
                    }}

                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    const { pathname, chosenCategoryId } = this.state
                                    const channelsKey = firebase.database().ref('channels').push(newData).key;

                                    firebase.database().ref('Online/' + pathname + '/' + chosenCategoryId + '/'+ channelsKey).set(true)

                                    resolve();
                                }, 1000);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    console.log(newData)
                                    console.log(oldData)
                                    
                                    const { data } = this.state
                                    firebase.database().ref('channels/'+oldData.id).set(newData)
                                    const foundIndex = data.findIndex(channel => channel.id === newData.id)
                                    data[foundIndex] = newData
                                    this.setState({ data: data})
                                    /* Loop through any new Categories added!! */
                                    resolve();
                                }, 1000)
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    const { pathname, chosenCategoryId } = this.state
                                    // if (oldData.categories.length === 1){ 

                                    // }
                                    console.log(oldData)
                                    firebase.database().ref('Online/' + pathname + '/' + chosenCategoryId + '/' + oldData.id).remove()
                                    resolve()
                                }, 1000)
                            }),
                    }}
                />
            </Fade>
        )
        
    }
}

export default withRouter(withStyles(styles)(OnlineTable));