import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";

import { TextField, Paper } from '@material-ui/core'
import tableIcons from '../styles/tableIcons'
import MaterialTable, { MTableActions, MTableCell, MTableBodyRow, MTableBody, MTableEditRow, MTableToolbar } from 'material-table'
import MyAction from './MyAction'

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
}

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: '',   
            chosenCategory: '', 
            web: 'Online',

            data:[],
            isLoaded: false,
        }
    }

    update = () => {
        const { pathname, chosenCategory, web } = this.state
        // const orderRef = firebase.database().ref('/' + web + )
        // orderRef.on('value', (snapshot) => {
        //     const { chosenCategory } = this.state
        //     let categories = snapshot.val();
            this.setState({
                // chosenCategory: !chosenCategory ? (categories ? categories[0] : '') : chosenCategory,
                isLoaded: true,
            })
        // })
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.pathname !== prevState.pathname || 
            nextProps.chosenCategory !== prevState.chosenCategory || 
            nextProps.web !== prevState.web)
            ? {
                pathname: nextProps.pathname, 
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

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            console.log("enter")
            e.preventDefault(); // Let's stop this event.
            e.stopPropagation()
        }
    }

    render() {
        const { isLoaded } = this.state
        const { classes } = this.props
        return (
            isLoaded 
                ? 
                <MaterialTable
                    icons = {tableIcons}
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
                                <TextField
                                   value={props.value}
                                    placeholder={'Rating'} 
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
                                <TextField
                                    value={props.value}
                                    placeholder={'Categories'}
                                    onChange={e => props.onChange(e.target.value)}
                                    rows={3}
                                    rowsMax={6}
                                    fullWidth
                                    multiline
                                    InputProps={{ disableUnderline: true, className: classes.textfield }}
                                />
                            ),
                        },
                    ]}
                    data={[{ channel: 'StackOverflow', customer_description: 'description', rating: 3, TPMC: 'FAANG', leverage: 'leverage', link: 'StackOverflow.com' },
                        { channel: 'StackOverflow', customer_description: 'description', rating: 3, TPMC: 'FAANG', leverage: 'leverage', link: 'StackOverflow.com' }]}
                    // data={Array.from(this.state.data)}
                    // data = {this.state.data}

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
                        Action: props => <MyAction {...props} style = {{width: '50%'}}/>, 
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
                                    const { web, pathname } = this.state
                                    const channelsRef = firebase.database().ref('channels')
                                    var channelsKey = channelsRef.push(newData).key;

                                    firebase.database().ref('/' + web + '/' + pathname + '/' + channelsKey).set(true)

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

export default withStyles(styles)(Table);