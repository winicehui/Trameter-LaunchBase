import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import { TextField, Paper, Fade } from '@material-ui/core'
import MaterialTable, { MTableCell, MTableBodyRow, MTableEditRow, MTableToolbar } from 'material-table'
import Linkify from 'react-linkify';

import styles from '../styles/TableStyles'
import tableIcons from '../styles/tableIcons'
import users_list from '../static/Usertypes'
import MyAction from './MyAction'

import firebase from '../firebase'

class OfflineTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: 'Enthusiasts', // indicates the User

            editMode: false,

            data: [],
            isLoaded: false,
        }
    }

    // called when pathname/user changes 
    update() {
        const { user } = this.state

        let channelIdsRef = firebase.database().ref('Offline/' + user)
        channelIdsRef.on('value', async (snapshot) => {
            let channels = []
            let channelPromises = []

            snapshot.forEach((channelSnapShot) => {
                channelPromises.push(firebase.database().ref('offline_channels/' + channelSnapShot.key).once('value'))
            })

            await Promise.all(channelPromises).then((snapshots) => {
                snapshots.forEach((snapshot) => {
                    let channelDetails = snapshot.val()
                    channelDetails['id'] = snapshot.key
                    channels.push(channelDetails)
                })
            })
            this.setState({ data: channels, isLoaded: true })
        })
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const params = new URLSearchParams(nextProps.location.search)
        const user = params.get('user') || users_list[0]

        return (user.toLowerCase() !== prevState.user.toLowerCase())
            ? {
                user: user,

                editMode: nextProps.editMode,

                data: [],
                isLoaded: false,
            }
            : nextProps.editMode !== prevState.editMode ? { editMode: nextProps.editMode } : null 
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    render() {
        const { user, editMode, data, isLoaded } = this.state
        const { classes } = this.props

        console.log(user)
        let title = 'Offline User: ' + user

        let pageSizes = [10, 20, 30]
        if (data.length > 30) pageSizes.push(data.length)

        const componentDecorator = (href, text, key) => (
            <a href={href} key={key} target="_blank" rel="noopener noreferrer" className={classes.hyperlink}>
                {text}
            </a>
        );

        let editable = editMode
            ? {
                onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (!newData.channel) {
                                return reject();
                            }
                            newData['user'] = user
                            const channelsKey = firebase.database().ref('offline_channels').push(newData).key;

                            firebase.database().ref('Offline/' + user + '/' + channelsKey).set(true)
                
                            return resolve();
                        }, 1000);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const { data } = this.state
                            if (!newData.channel) {
                                return reject()
                            } else {
                                firebase.database().ref('offline_channels/' + newData.id).set(newData)

                                const foundIndex = data.findIndex(channel => channel.id === newData.id)
                                data[foundIndex] = newData
                                this.setState({ data: data })

                                return resolve();
                            }
                        }, 1000)
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            firebase.database().ref('offline_channels/' + oldData.id).remove();
                            
                            firebase.database().ref('Offline/' + user + '/' + oldData.id).remove();

                            resolve();
                        }, 1000)
                    }),
            }
            : null

        return (
            isLoaded ?
                <Fade in={isLoaded}>
                    <MaterialTable
                        title={title}
                        style={{ margin: '0px 30px' }}
                        columns={[
                            {
                                title: 'Channels',
                                field: 'channel',
                                width: "20%",
                                sorting: false,
                                cellStyle: { padding: '10px' },
                                render: rowData => {
                                    let data = rowData.channel
                                    let newText = data ? data.split('\n').map((item, i) => <p key={i} style={{ textAlign: 'center', margin: '0px' }}>{item}</p>) : data
                                    return newText
                                },
                                editComponent: props => (
                                    <TextField
                                        value={props.value}
                                        placeholder={'Channel'}
                                        onChange={e => props.onChange(e.target.value)}
                                        rows={1}
                                        fullWidth
                                        InputProps={{ disableUnderline: true, className: classes.textfield }}
                                        style={{ textAlign: 'center' }}
                                        autoFocus
                                        helperText={'Required'}
                                        error
                                    />
                                ),
                            },
                            {
                                title: 'Description',
                                field: 'description',
                                width: '60%',
                                sorting: false,
                                cellStyle: { padding: '10px' },
                                render: rowData => {
                                    let data = rowData.description
                                    let newText = data ? data.split('\n').map((item, i) => <Linkify componentDecorator={componentDecorator}> <p key={i} style={{ margin: '0px' }}>{item}</p> </Linkify>) : data
                                    return newText
                                },
                                editComponent: props => (
                                    <TextField
                                        value={props.value}
                                        placeholder={'Customer Description'}
                                        onChange={e => props.onChange(e.target.value)}
                                        fullWidth
                                        multiline
                                        InputProps={{ disableUnderline: true, className: classes.textfield }}
                                    />
                                )
                            },
                            {
                                title: 'Sub/Link',
                                field: 'link',
                                width: '20%',
                                sorting: false,
                                cellStyle: { padding: '10px' },
                                render: rowData => {
                                    let data = rowData.link
                                    let newText = data ? data.split('\n').map((item, i) => <Linkify componentDecorator={componentDecorator}> <p key={i} style={{ margin: '0px' }}>{item}</p> </Linkify>) : data;
                                    return newText
                                },
                                editComponent: props => (
                                    <TextField
                                        value={props.value}
                                        placeholder={'Sub/Link'}
                                        onChange={e => props.onChange(e.target.value)}
                                        fullWidth
                                        multiline
                                        InputProps={{ disableUnderline: true, className: classes.textfield }}
                                    />
                                ),
                            },
                        ]}

                        components={{
                            Container: props => <Paper {...props} elevation={0} />,
                            Cell: props => < MTableCell {...props} className={classes.cell} />,
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
                                <div>
                                    <div style={{ float: 'right' }}>
                                        <p className={classes.channel_count}> {data.length} </p>
                                    </div>
                                    <MTableToolbar {...props} classes={{ root: classes.toolBar }} />
                                </div>
                            )
                        }}

                        icons={tableIcons}

                        data={data}

                        localization={{
                            body: {
                                emptyDataSourceMessage: 'No channels to display.',
                                addTooltip: '',
                                deleteTooltip: '',
                                editTooltip: '',
                                editRow: {
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
                            headerStyle: {
                                backgroundColor: '#707070',
                                color: '#FFFFFF',
                                fontSize: '16px',
                                padding: '10px',
                                wordBreak: 'break-word',
                                border: '1px solid black',
                                textAlign: 'center'
                            },
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

                        editable={editable}
                    />
                </Fade>
                : null
        )
    }
}

export default withRouter(withStyles(styles)(OfflineTable));