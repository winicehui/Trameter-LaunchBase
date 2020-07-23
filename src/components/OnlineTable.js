import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import { TextField, Paper, Select, MenuItem } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import tableIcons from '../styles/tableIcons'
import MaterialTable, { MTableActions, MTableCell, MTableBodyRow, MTableBody, MTableEditRow, MTableToolbar } from 'material-table'
import MyAction from './MyAction'

import users_list from '../static/Usertypes'

import firebase from '../firebase'


const styles = {
    textfield: {
        color: '#707070',
        padding: '10px'
    }, 
    tableRow: {
        color: '#707070',
        "& td": {
            border: "1px solid black !important",
            padding: '1px',
            margin: '0px'
        }
    }, 
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
}

class OnlineTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: 'Enthusiasts',   
            chosenCategory: '', 
            web: 'Online',
            categories: [],

            data:[],
            isLoaded: false,
        }
        // this.getChannelPromise = this.getChannelPromise.bind(this)
    }

    // getChannelPromise (id) {
    //     return firebase.database().ref('/channels/' + id).once('value', async (snapshot) => {
    //         console.log(snapshot.val())
    //         return snapshot.val()
    //     })
    // }

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

        // const { pathname, chosenCategory, web } = this.state
        // firebase.database().ref('/'+ web +'/'+ pathname +'/'+ chosenCategory).on('value').then((snapshot) => {
        //     const channelIds = snapshot.value()
        //     let promises = []
        //     channelIds.forEach((id) => {
        //         promises.push(this.getChannelPromise(id))
        //     })
        //     return Promise.all(promises)
        // }, (err) => {
        //     console.log(err)
        // }).then((channels) => {
        //     this.setState({ data: channels, isLoaded: true})
        // }, (err) => {
        //     console.log(err)
        // })


        // const { pathname, chosenCategory, web } = this.props
        // // let channelsRef = firebase.database().ref( web + '/' + pathname + '/' + chosenCategory + '/')
        // let channelsRef = firebase.database().ref('Online/Enthusiasts/Social')
        // channelsRef.on('value', async (snapshot) => {
        //     let channelPromises = []
        //     console.log(snapshot.val())
        //     snapshot.forEach((channelSnapShot) => {
        //         console.log(channelSnapShot.key)
        //         channelPromises.push(firebase.database().ref('/channels/' + channelSnapShot.key).once('value', async (snapshot) => {
        //             console.log(snapshot.val())
        //             return snapshot.val()
        //     }))
        //     })
        //     let channelSnapshots = await Promise.all(channelPromises)
        //     channelSnapshots.forEach((a) => console.log (a.val()))
        //     this.setState({ data: channelSnapshots, isLoaded: true})
        // })

        const { pathname, chosenCategory, web } = this.state
        // let channelsRef = firebase.database().ref( web + '/' + pathname + '/' + chosenCategory + '/')
        let channelsRef = firebase.database().ref('Online/Enthusiasts/Social')
        channelsRef.on('value', async (snapshot) => {
            let channels = []
            let channelPromises = []
            // console.log(snapshot.val())
            snapshot.forEach((channelSnapShot) => {
                channelPromises.push(firebase.database().ref('/channels/' + channelSnapShot.key).once('value'))
            })
            await Promise.all(channelPromises).then((snapshots) => {
                snapshots.forEach((snapshot) => channels.push(snapshot.val()))
            })
            
            this.setState({ data: channels, isLoaded: true })
        })
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newPathname = nextProps.location.pathname.substring(1) || users_list[0]
        return (newPathname.toLowerCase() !== prevState.pathname.toLowerCase() || 
            nextProps.chosenCategory !== prevState.chosenCategory || 
            nextProps.web !== prevState.web)
            ? {
                pathname: newPathname, 
                chosenCategory: nextProps.chosenCategory,
                web: nextProps.web,
                isLoaded: false,
            }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    // onKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         console.log("enter")
    //         e.preventDefault(); // Let's stop this event.
    //         e.stopPropagation()
    //     }
    // }

    render() {
        const { isLoaded } = this.state
        const { classes } = this.props
        // console.log(this.state.data)
        return (
            isLoaded 
                ? 
                <MaterialTable
                    // icons = {tableIcons}
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
                                    fullWidth
                                    disableUnderline
                                    inputProps={{
                                        classes: { select: classes.select }
                                    }}
                                    defaultValue = {1}
                                    value={props.value}
                                    onChange={e => props.onChange(e.target.value)}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
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
                    // data={[{ channel: 'StackOverflow', customer_description: 'description', rating: 3, TPMC: 'FAANG', leverage: 'leverage', link: 'StackOverflow.com' },
                    //     { channel: 'StackOverflow', customer_description: 'description', rating: 2, TPMC: 'FAANG', leverage: 'leverage', link: 'StackOverflow.com' }]}
                    // data={Array.from(this.state.data)}
                    data = {this.state.data}

                    options={{  
                        headerStyle: {  backgroundColor: '#707070', 
                                        color: '#FFFFFF', 
                                        fontSize: '16px', 
                                        padding:'10px', 
                                        wordBreak: 'break-word', 
                                        border: '1px solid black', 
                                        textAlign: 'center' }, 
                        actionsCellStyle: { padding: '1px', margin: '0px' },
                        showTitle: false, 
                        draggable: false, 
                        // toolbar: false,
                        tableLayout: 'fixed',
                        search: false,
                        emptyRowsWhenPaging: false,
                        loadingType: 'linear', 
                        toolbarButtonAlignment: 'left'
                    }}

                    localization= {{
                        body: {
                            addTooltip: '', 
                            deleteTooltip: '',
                            editTooltip: ''
                        }
                    }}

                    components={{
                        Container: props => <Paper {...props} elevation={0} />,
                        Cell: props => < MTableCell {...props} style={{ margin: '0px',
                                                                        padding: '10px',
                                                                        textAlign: 'center', 
                                                                        wordBreak: 'break-word', 
                                                                        hyphens: 'auto',
                                                                     }} />, 
                        EditRow: props => (
                            <MTableEditRow {...props} className={classes.tableRow} />
                        ),
                        Row: props => (
                            <MTableBodyRow {...props} className={classes.tableRow} />
                        ), 
                        Action: props => <MyAction {...props} />, 
                        Toolbar: props => (
                            <MTableToolbar {...props} classes={{root: classes.toolBar}}/>
                        )
                    }}

                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                // setTimeout(() => {
                                //     const data = this.state.data
                                //     data.push(newData);
                                //     console.log(data)
                                //     this.setState({data: data},

                                //     resolve());
                                // }, 1000)
                                setTimeout(() => {
                                    const { web, pathname, chosenCategory } = this.state
                                    const channelsRef = firebase.database().ref('channels')
                                    let channelsKey = channelsRef.push(newData).key;

                                    firebase.database().ref('/' + web + '/' + pathname + '/' + chosenCategory + '/'+ channelsKey).set(true)

                                    resolve();
                                }, 1000);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    const data = this.state.data
                                    data.push(newData);
                                    console.log(data)
                                    const index = oldData.tableData.id
                                    resolve();
                                }, 1000)
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    const data = this.state.data
                                    data.push(oldData);
                                    console.log(data)

                                    resolve()
                                }, 1000)
                            }),
                    }}
                />
                : null
        )
        
    }
}

export default withRouter(withStyles(styles)(OnlineTable));