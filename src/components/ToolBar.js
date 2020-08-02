import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import { Grid, Select, MenuItem, Popover, TextField, IconButton, Fade } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'

import CategoryChip from './categoryChip'

import users_list from '../static/Usertypes'
import styles from '../styles/ToolBarStyles'

import firebase from '../firebase'


class ToolBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online',  // 'Online' or 'Offline'
            user: 'Enthusiasts', // indicates User, 
            params: null, 

            categoryIDs: [], // list of categoryIDs of categories for specified User
            chosenCategoryId: null, // categoryID of chosen Category

            edit: false, // T/F condiition for editing in toolbar

            anchorE1: null, // anchor for Popover
            openAdd: false, // T/F condition for opening Add Category Popover
            newCategory: '', // controlled text for Add Category text

            isLoaded: false // T/F condition for data (categoryIDs) loaded
        }
        this.scroll = React.createRef()
        this.toggleOnOff = this.toggleOnOff.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);

        this.handleToggleCategory =this.handleToggleCategory.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this);

        this.togglePopper = this.togglePopper.bind(this);
        this.handleAddTextChange = this.handleAddTextChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    // called each time the user changes + when '/' path and user searchparam changes
    update = async () => {
        const { user } = this.state

        const orderRef = firebase.database().ref('/order/' + user)
        orderRef.on('value', (snapshot) => { // called each time order of categories changes
            const { chosenCategoryId }= this.state 
            const params = new URLSearchParams(window.location.search)
            let emptypath = !this.props.location.pathname.substring(1) && !params.get('user') && !params.get('id')
            let categoryIDs = snapshot.val() || [];
            this.setState({
                categoryIDs: categoryIDs, 
                chosenCategoryId: (!chosenCategoryId && emptypath) ? (categoryIDs ? categoryIDs[0] : '') : chosenCategoryId,
                isLoaded: true
            })
        })
    }

    componentDidMount(){
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const params = new URLSearchParams(nextProps.location.search)
        const user = params.get('user') || users_list[0]
        let id = params.get('id')
        const web = nextProps.location.pathname.substring(1) || 'Online'

        let emptypath = !nextProps.location.pathname.substring(1) && !params.get('user') && !params.get('id')

        const oldparams = new URLSearchParams(prevState.params)
        let user_param = params.get('user')
        let old_userparam = oldparams.get('user')
        
        return (user.toLowerCase() !== prevState.user.toLowerCase() || (!user_param && old_userparam && emptypath))
            ? { 
                web: web, 
                user: user,
                params: params, 
                
                categoryIDs: [],
                chosenCategoryId: id, 

                edit: false,

                anchorE1: null,
                openAdd: false,
                newCategory: '',

                isLoaded: false
            }
            : (web.toLowerCase() !== prevState.web.toLowerCase()) 
                ? {
                    web: web, 
                    params: params, 
                    
                    edit: false,
                    chosenCategoryId: prevState.chosenCategoryId ? prevState.chosenCategoryId : id, 

                    anchorE1: null,
                    openAdd: false,
                    newCategory: ''
                } : (id !== prevState.chosenCategoryId && !emptypath)
                    ? {
                        params: params, 
                        chosenCategoryId: id,  
                    }
                    :  null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    toggleOnOff = async (e) => {
        const { web, user, chosenCategoryId } = this.state 
        const newWeb = (web === 'Online') ? 'Offline' : 'Online'

        const params = new URLSearchParams(window.location.search)
        params.set('user', user)
        if ( web === 'Online'){
            params.delete('id')
        } else {
            if (!chosenCategoryId){
                await firebase.database().ref('/order/' + user).once('value').then((snapshot) => {
                    let firstCatId = snapshot.val() ? snapshot.val()[0] : null
                    if (firstCatId) {
                        params.set('id', firstCatId)
                    }
                })
            } else {
                params.set('id', chosenCategoryId)
            }
        }
        const url = '?' + params.toString()
        this.props.history.push({
            pathname: newWeb,
            search: url
        })
    }

    toggleEdit = (e) => {
        const { edit } = this.state
        this.setState({ edit: !edit })
    }

    handleToggleCategory = (categoryId) => {
        const { web, user } = this.state
        const params = new URLSearchParams(window.location.search)
        params.set('user', user)
        params.set('id', categoryId)
        const url = '?' + params.toString()
        this.props.history.push({
            pathname: web,
            search: url
        })
    }

    handleCategoryChange = (newCategoryName, index) => {
        const { categoryIDs } = this.state

        let changeCategoryId = categoryIDs[index] 
        firebase.database().ref('categories/' + changeCategoryId).set(newCategoryName)
    }

    handleDeleteCategory = async (index) => {
        const { web, user, categoryIDs, chosenCategoryId } = this.state
        const deletedCategoryId = categoryIDs[index]

        firebase.database().ref('categories/' + deletedCategoryId).remove()

        let deletePromises = [] 

        users_list.forEach((user) => {
            const orderRef = firebase.database().ref('/order/' + user)
            orderRef.once('value', snapshot => {
                const user_categoryIds = snapshot.val() || []
                const i = user_categoryIds.indexOf(deletedCategoryId)
                const newCategoryIds = Array.from(user_categoryIds)
                newCategoryIds.splice(i, 1)
                deletePromises.push(firebase.database().ref('/order/' + user).set(newCategoryIds))
            })
            const channelRef = firebase.database().ref('Online/' + user +'/' + deletedCategoryId)
            channelRef.once('value', snapshot => {
                snapshot.forEach((id) => {
                    deletePromises.push(firebase.database().ref('online_channels/' + id.key).remove())
                })
            })
            deletePromises.push(firebase.database().ref('Online/'+ user + '/' + deletedCategoryId).remove())
        })
        await Promise.all(deletePromises)
        if (deletedCategoryId === chosenCategoryId) {
            let newCategoryId = categoryIDs[(index +1 )]
            const params = new URLSearchParams(window.location.search)
            params.set('user', user)
            if (newCategoryId) {
                params.set('id', newCategoryId)
            } else {
                params.delete('id')
            }
            
            const url = '?' + params.toString()
            this.props.history.push({
                pathname: web, 
                search: url
            })
        }
    }

    togglePopper = (e) =>{
        const { anchorE1, openAdd } = this.state
        anchorE1
            ? this.setState({ anchorE1: null, openAdd: !openAdd, newCategory: '' })
            : this.setState({ anchorE1: e.currentTarget, openAdd: !openAdd })
    }

    handleAddTextChange = (e) => {
        const add = e.target.value
        this.setState({ newCategory: add })
    }

    onKeyPress = async (e) => {
        if (e.key === 'Enter') {
            const { web, user, categoryIDs, newCategory, openAdd } = this.state
            if (newCategory.length === 0) {
                this.setState({ 
                    anchorE1: null, 
                    openAdd: !openAdd, 
                    newCategory: '' 
                })
            } else {
                let newCategoryKey = await firebase.database().ref('categories/').push(newCategory.trim()).key
                let addCategoryPromises = []

                users_list.forEach(user => {
                    addCategoryPromises.push(firebase.database().ref('/order/'+user+'/'+categoryIDs.length).set(newCategoryKey))
                })
                
                Promise.all(addCategoryPromises)
                
                this.setState({
                    anchorE1: null,
                    openAdd: !openAdd,
                    newCategory: '',
                })

                const params = new URLSearchParams(window.location.search)
                params.set('user', user)
                params.set('id', newCategoryKey)
               
                const url = '?' + params.toString()
                this.props.history.push({
                    pathname: web, 
                    search: url
                })

                if (this.scroll) {
                    this.scroll.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                };
            }
        }
    }
    
    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination || (
            destination.droppableId === source.droppableId &&
            destination.index === source.index)
        ) return;

        const { web, user, categoryIDs, chosenCategoryId } = this.state
        const newCategories = Array.from(categoryIDs)
        newCategories.splice(source.index, 1);
        newCategories.splice(destination.index, 0, draggableId);

        firebase.database().ref('/order/' + user).set(newCategories)
    
        const params = new URLSearchParams(window.location.search)
        params.set('user', user)
        params.set('id', chosenCategoryId)
        const url = '?' + params.toString()
        this.props.history.push({
            pathname: web,
            search: url
        })
    }

    render() {
        const { classes } = this.props;
        const { web, categoryIDs, chosenCategoryId, edit, anchorE1, openAdd, newCategory, isLoaded } = this.state
        const id = openAdd ? 'simple-popover' : undefined;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Grid
                    container
                    alignItems='center'
                    justify='center'
                    className= {classes.Toolbox}
                >
                    <Grid item 
                        xs = {12}
                        sm = {2}
                        md = {2}
                        lg={1} 
                        className= {classes.LeftToolbox}
                    >
                        <Select
                            fullWidth
                            disableUnderline    
                            inputProps={{
                                classes: { select: classes.select }
                            }}
                            value={web}
                            onChange={this.toggleOnOff}
                        >
                            <MenuItem value={'Online'}>Online</MenuItem>
                            <MenuItem value={'Offline'}>Offline</MenuItem>
                        </Select>
                    </Grid>

                    {web === "Online"
                        ? <React.Fragment>
                            <Grid item 
                                xs = {12}
                                sm = {8}
                                md = {8}
                                lg = {10}
                                className = {classes.MiddleToolbox}
                                >    
                                {isLoaded ? 
                                    <Fade in = {isLoaded}>
                                    <Droppable droppableId = "categories" direction = "horizontal">
                                            {(provided, snapshot) => (
                                                <div
                                                    style={{ 
                                                        display: 'flex', 
                                                        overflowX: 'scroll', 
                                                        backgroundColor: !snapshot.isDraggingOver && !edit ? '#FFFFFF' : '#F2F3F4'
                                                    }}
                                                    ref = {provided.innerRef}
                                                    {...provided.droppableProps}
                                                >
                                                    {categoryIDs.map((element, i) =>
                                                        (
                                                            <CategoryChip 
                                                                key = {element} 
                                                                index = {i} 
                                                                categoryId = {element} 
                                                                chosenCategoryId = {chosenCategoryId}
                                                                edit = {edit} 
                                                                handleToggleCategory = {this.handleToggleCategory}
                                                                handleCategoryChange = {this.handleCategoryChange}
                                                                handleDeleteCategory = {this.handleDeleteCategory}
                                                            /> 
                                                        )
                                                    )}
                                                    <div ref = {this.scroll}> </div>
                                                    {provided.placeholder}
                                                </div> 
                                            )}
                                        </Droppable>
                                    </Fade>   
                                : null}
                                
                            </Grid>

                            <Grid item 
                                xs = {12}
                                sm = {2}
                                md={2}
                                lg={1} 
                                className = {classes.RightToolbox}
                            >
                                <Grid
                                    container
                                >
                                    <Grid item align="center"
                                        xs = {6} 
                                    > 
                                        <IconButton onClick={this.toggleEdit} className = {classes.Button}>
                                            {edit
                                                ? <DoneIcon className ={classes.Icon} />
                                                : <EditIcon className={classes.Icon} />
                                            }
                                        </IconButton>
                                    </Grid>
                                    
                                    <Grid item align="center"
                                        xs={6}  
                                    > 
                                        <IconButton onClick={this.togglePopper} className={classes.Button}>
                                            <AddIcon className={classes.Icon}  aria-describedby={id} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                    
                                <Popover
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'center',
                                    }}
                                    anchorEl= {anchorE1}
                                    open = {openAdd}
                                    id = {id}
                                    onClose= {this.togglePopper}
                                >
                                    <TextField
                                        value = {newCategory}
                                        placeholder = "New Category"
                                        onChange={this.handleAddTextChange}
                                        onKeyPress={this.onKeyPress}
                                        rowsMax={1}
                                        className={classes.textfield}
                                        inputProps={{ maxLength: 140 }}
                                        autoFocus />
                                </Popover>
                            </Grid>
                        </React.Fragment>
                    : <Grid item
                        xs={12}
                        sm={10}
                        md={10}
                        lg={11}
                        style = {{height: '50px'}}
                    /> }
                </Grid>
            </DragDropContext>
        );
    };
};

export default withRouter(withStyles(styles)(ToolBar));