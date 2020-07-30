import React, { Component } from 'react'
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import { TextField, Paper, Select, MenuItem, Fade, Chip } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import MaterialTable, { MTableCell, MTableBodyRow, MTableEditRow, MTableToolbar } from 'material-table'
import Linkify from 'react-linkify';

import styles from '../styles/TableStyles'
import tableIcons from '../styles/tableIcons'
import users_list from '../static/Usertypes'
import MyAction from './MyAction'

import firebase from '../firebase'

class OnlineTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: 'Enthusiasts', // indicates the User

            categories: [], // list of category names
            chosenCategoryId: '-1', // chosenCategoryId

            editMode: false,

            data:[],
            isLoaded: false,
        }
    }

    // called when 1) pathname/user changes or 2) chosenCategory changes
    update() {
        const { pathname, chosenCategoryId } = this.state

        let channelIdsRef = firebase.database().ref('Online/' + pathname + '/' + chosenCategoryId)
        channelIdsRef.on('value', async (snapshot) => {
            let channels = []
            let channelPromises = []
            
            snapshot.forEach((channelSnapShot) => {
                channelPromises.push(firebase.database().ref('online_channels/' + channelSnapShot.key).once('value'))
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
        const newPathname = nextProps.location.pathname.substring(1) || users_list[0]
        const cat_updated = nextProps.categories.sort().toString() !== prevState.categories.sort().toString()

        return (newPathname.toLowerCase() !== prevState.pathname.toLowerCase() || 
            nextProps.chosenCategoryId !== prevState.chosenCategoryId) 
            ? {
                pathname: newPathname, 

                categories: nextProps.categories,
                chosenCategoryId: newPathname.toLowerCase() !== prevState.pathname.toLowerCase() ? -1 : nextProps.chosenCategoryId,

                editMode: false,

                data: [],
                isLoaded: false,
            }
            : cat_updated ? { categories: nextProps.categories }  
            : nextProps.editMode !== prevState.editMode ? { editMode: nextProps.editMode } : null 
            // : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    render() {
        const { pathname, categories, chosenCategoryId, editMode, data, isLoaded } = this.state
        const { classes } = this.props

        const tableInfo = categories.find((option) => option.id === chosenCategoryId && option.user.toLowerCase() === pathname.toLowerCase())
        let title = 'Online User: ' + pathname + (tableInfo ? ', ' + tableInfo.name : '')

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
                            if (!newData.channel){
                                return reject();
                            }
                            const fixedOption = categories.filter((option) => option.id === chosenCategoryId && option.user.toLowerCase() === pathname.toLowerCase())
                            let additions = newData.categories ? [...fixedOption, ...newData.categories.filter((option) => option.id !== chosenCategoryId || option.user.toLowerCase() !== pathname.toLowerCase())] : fixedOption

                            newData['categories'] = additions
                            const channelsKey = firebase.database().ref('online_channels').push(newData).key;

                            let addCategoryPromises = []
                            additions.forEach((additional_category) => {
                                addCategoryPromises.push(firebase.database().ref('Online/' + additional_category.user + '/' + additional_category.id + '/' + channelsKey).set(true))
                            })
                            Promise.all(addCategoryPromises)
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
                                firebase.database().ref('online_channels/' + newData.id).set(newData)

                                /* Loop through any new Categories added + deleted */
                                let newCategories = newData.categories
                                let oldCategories = oldData.categories 

                                let promises = []
                                oldCategories.forEach((oldCategory) => {
                                    let inNewList = newCategories.some((category) => category.user === oldCategory.user && category.id === oldCategory.id)
                                    if (!inNewList) {
                                        promises.push(firebase.database().ref('Online/' + oldCategory.user + '/' + oldCategory.id + '/' + newData.id).remove())
                                    }
                                })

                                newCategories.forEach((newCategory) => {
                                    promises.push(firebase.database().ref('Online/' + newCategory.user + '/' + newCategory.id + '/' + newData.id).set(true))
                                })
                                Promise.all(promises).then(() =>{
                                    const foundIndex = data.findIndex(channel => channel.id === newData.id)
                                    data[foundIndex] = newData
                                    this.setState({ data: data })}
                                )
                                return resolve();
                            }
                        }, 1000)
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let promises = []

                            const fixedOption = categories.filter((option) => option.id === chosenCategoryId && option.user.toLowerCase() === pathname.toLowerCase())
                            let reordered_oldcategories = [...fixedOption, ...oldData.categories.filter((option) => option.id !== chosenCategoryId || option.user.toLowerCase() !== pathname.toLowerCase())]

                            if (reordered_oldcategories.length === 1) {
                                promises.push(firebase.database().ref('online_channels/' + oldData.id).remove());
                            } else {
                                promises.push(firebase.database().ref('online_channels/' + oldData.id + '/categories').set(reordered_oldcategories.slice(1)));
                            }

                            promises.push(firebase.database().ref('Online/' + pathname + '/' + chosenCategoryId + '/' + oldData.id).remove())

                            Promise.all(promises)
                            resolve();
                        }, 1000)
                    }),
            }
        : null

        return (
            isLoaded ? 
                <Fade in = {isLoaded}>
                    <MaterialTable
                        title = {title}
                        style={{ margin: '0px 30px' }}
                        columns={[
                            {   title: 'Channels', 
                                field: 'channel', 
                                width: "10%",
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
                                        rows = {1}
                                        fullWidth
                                        InputProps={{ disableUnderline: true, className: classes.textfield }}
                                        style={{ textAlign: 'center'}}
                                        autoFocus
                                        helperText={'Required'}
                                        error
                                    />
                                ),
                            },
                            {   title: 'Rating', 
                                field: 'rating', 
                                width: '7%',
                                cellStyle: { padding: '10px' },
                                // defaultSort: 'desc',
                                render: rowData => (
                                    <p style={{ textAlign: 'center', margin: '0px' }}>{rowData.rating}</p>
                                ),
                                editComponent: props => (
                                    <Select
                                        value={props.value || 1}
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
                            {   title: 'Customer Description',
                                field: 'customer_description',
                                width: '20%',
                                sorting: false,
                                cellStyle: { padding: '10px' },
                                render: rowData => {
                                    let data = rowData.customer_description
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
                            {   title: 'Tech, Product, Market, Company', 
                                field: 'TPMC', 
                                width: "20%",
                                sorting: false,
                                cellStyle: { padding: '10px' },
                                render: rowData => {
                                    let data = rowData.TPMC
                                    let newText = data ? data.split('\n').map((item, i) => <Linkify componentDecorator={componentDecorator}> <p key={i} style={{ margin: '0px' }}>{item}</p> </Linkify>) : data
                                    return newText
                                },
                                editComponent: props => (
                                    <TextField
                                        value={props.value}
                                        placeholder={'Tech, Product, Market, Company'}
                                        onChange={e => props.onChange(e.target.value)}
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
                                cellStyle: { padding: '10px' },
                                render: rowData => {
                                    let data = rowData.leverage
                                    let newText = data ? data.split('\n').map((item, i) => <Linkify componentDecorator={componentDecorator}> <p key={i} style={{ margin: '0px' }}>{item}</p> </Linkify> ) : data;
                                    return newText
                                },
                                editComponent: props => (
                                    <TextField
                                        value={props.value}
                                        placeholder={'How to Leverage'}
                                        onChange={e => props.onChange(e.target.value)}
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
                            {   title: 'Categories',
                                field: 'categories',
                                width: '13%', 
                                sorting: false,
                                cellStyle: { padding: '5px' },
                                render: rowData => {
                                    const fixedOption = categories.filter((option) => option.id === chosenCategoryId && option.user.toLowerCase() === pathname.toLowerCase())
                                    let value = rowData.categories ? [...fixedOption, ...rowData.categories.filter((option) => option.id !== chosenCategoryId || option.user.toLowerCase() !== pathname.toLowerCase())] : fixedOption 

                                    return value.map((category) => 
                                        <Chip
                                            size = "small"
                                            label={"(" + category.user.substring(0, 1) + ") " + category.name}
                                            style={{
                                                margin: '2.5px',
                                                backgroundColor: category.id === chosenCategoryId && category.user.toLowerCase() === pathname.toLowerCase() ? '#353B51' : '#707070',
                                                color: category.id === chosenCategoryId && category.user.toLowerCase() === pathname.toLowerCase() ? '#FFFFFF' : '#FFFFFF',
                                            }}
                                            key = {category}
                                        />
                                    )
                                },
                                editComponent: props => {
                                    const fixedOption = categories.filter((option) => option.id === chosenCategoryId && option.user.toLowerCase() === pathname.toLowerCase())
                                    return <Autocomplete
                                        autoHighlight
                                        fullWidth
                                        multiple
                                        
                                        options={categories}
                                        groupBy={(option) => option.user}
                                        value={props.value ? [...fixedOption, ...props.value.filter((option) => option.id !== chosenCategoryId || option.user.toLowerCase() !== pathname.toLowerCase())] : fixedOption}
                                        
                                        onChange = {(event, value, reason) => {
                                            let newValue = [...fixedOption, ...value.filter((option) => option.id !== chosenCategoryId || option.user.toLowerCase() !== pathname.toLowerCase())]
                                            props.onChange(newValue)
                                        }}

                                        getOptionDisabled={(option) => option.id === chosenCategoryId && option.user.toLowerCase() === pathname.toLowerCase()} // Disables selecting that option
                                        renderTags={(tagValue, getTagProps) =>
                                            tagValue.map((option, index) => (
                                                <Chip
                                                    label={"(" + option.user.substring(0, 1) + ") " + option.name}
                                                    {...getTagProps({ index })}
                                                    disabled={fixedOption.indexOf(option) !== -1}
                                                    size = "small"
                                                />
                                            ))
                                        }

                                        getOptionLabel={(option) => "("+option.user.substring(0,1) + ") "+ option.name} // Chip Label
                                        renderOption = { (option) => option.name } // Option labels in list
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                InputProps={{ ...params.InputProps, disableUnderline: true }}
                                            />
                                        )}
                                    />
                                }
                            },
                        ]}

                        components={{
                            Container: props => <Paper {...props} elevation={0} />,
                            Cell: props => < MTableCell {...props} className = {classes.cell} />,
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
                                    <div style = {{float: 'right'}}>
                                        <p className = {classes.channel_count}> {data.length} </p>  
                                    </div>
                                    <MTableToolbar {...props} classes={{ root: classes.toolBar }}/>
                                </div>
                            )
                        }}

                        icons={tableIcons}

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

                        editable= {editable}
                    />
                </Fade>
        : null
        )
    }
}

export default withRouter(withStyles(styles)(OnlineTable));