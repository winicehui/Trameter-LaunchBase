import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";

import { TextField, Paper } from '@material-ui/core'
import MaterialTable, { MTableEditField, MTableCell } from 'material-table'

import firebase from '../firebase'

const styles = {
    textfield: {
        color: '#707070',
        fontSize: '13px',
        borderBottomColor: '#353B51',
        '& .MuiInput-underline:after': {
            borderBottomColor: '#353B51',
        }
    }
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
        return (nextProps.pathname !== prevState.pathname || nextProps.chosenCategory !== prevState.chosenCategory || nextProps.web !== prevState.web)
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
            e.preventDefault(); // Let's stop this event.
            e.stopPropagation()
        }
    }

    render() {
        const { isLoaded } = this.state
        const { classes } = this.props
        console.log(this.state.data)
        return (
            isLoaded 
                ? <div style={{ margin: '30px 30px 30px 30px' }}>
                <MaterialTable
                    columns={[
                        {   title: 'Channels', 
                            field: 'channel', 
                            width: "10%",
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    rowsMax={2}
                                    value={props.value}
                                    placeholder={'Channel'}
                                    fullWidth
                                    multiline
                                    className={classes.textfield}
                                    onChange={e => props.onChange(e.target.value)}
                                    onKeyPress = {e => props.handleKeyPress}
                                    inputProps={{ maxLength: 140 }}
                                    autoFocus />
                            )
                        },
                        {   title: 'Rating', 
                            field: 'rating', 
                            // type: 'numeric',
                            width: '7%',
                        },
                        {
                            title: 'Customer Description',
                            field: 'customer_description',
                            width: '20%',
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    rowsMax = {6}
                                    value={props.value}
                                    placeholder={'Customer Description'}
                                    style={{ width: '100%' }}
                                    className={classes.textfield}
                                    onChange={e => props.onChange(e.target.value)}
                                />
                            )
                        },
                        {   title: 'Tech, Product, Market, Company', 
                            field: 'tpmc', 
                            width: "20%",
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    rowsMax={6}
                                    value={props.value}
                                    placeholder={'Tech, Product, Market, Company'}
                                    style={{ width: '100%' }}
                                    className={classes.textfield}
                                    onChange={e => props.onChange(e.target.value)}
                                />
                            )
                        },
                        {   title: 'How to Leverage', 
                            field: 'leverage', 
                            width: '20%',
                            sorting: false,
                            editComponent: props => (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    rowsMax={6}
                                    value={props.value}
                                    placeholder={'Customer Description'}
                                    style={{ width: '100%' }}
                                    className={classes.textfield}
                                    onChange={e => props.onChange(e.target.value)}
                                />
                            )
                        }, 
                        {   title: 'Sub/Link', 
                            field: 'link', 
                            width: '10%',
                            sorting: false
                        }, 
                        {
                            title: 'Categories',
                            field: 'categories',
                            width: '13%', 
                            sorting: false
                        }
                    ]}
                    data={[{ channel: 'StackOverflow', description: 'description', rating: 3, details: 'FAANG', leverage: 'leverage', link: 'StackOverflow.com' }]}
                    // data={Array.from(this.state.data)}
                    // data = {this.state.data}
                    title="Channels"

                    options={{  
                        headerStyle: {  backgroundColor: '#707070', 
                                        color: '#FFFFFF', 
                                        fontSize: '16px', 
                                        padding:'10px', 
                                        wordBreak: 'break-word', 
                                        border: '1px solid black', 
                                        textAlign: 'center' }, 
                        rowStyle: { fontSize: '14px' },
                        actionsCellStyle: { border: '1px solid black', padding: '1px', margin: '0px' },
                        showTitle: false, 
                        draggable: false, 
                        // toolbar: false,
                        tableLayout: 'fixed',
                        search: false,
                        emptyRowsWhenPaging: false,
                        loadingType: 'linear'
                    }}

                    localization= {{
                        header: {
                            actions: 'Actions'
                        },
                    }}

                    components={{
                        Container: props => <Paper {...props} elevation={0} style = {{borderBottom:'none'}}/>,
                        // Body: props => < MTableBody {...props} style={{ border: '1px #707070 solid' }} />,
                        Cell: props => < MTableCell {...props} style={{ border: '1px solid black', 
                                                                        padding: '10px', 
                                                                        textAlign: 'center', 
                                                                        wordBreak: 'break-word', 
                                                                        color: '#707070',
                                                                        hyphens: 'auto',
                                                                     }}/>, 
                        EditField: props => < MTableEditField {... props} style = {{width: '100%'}}/>
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
                </div>
                : null
        )
        
    }
}

export default withStyles(styles)(Table);