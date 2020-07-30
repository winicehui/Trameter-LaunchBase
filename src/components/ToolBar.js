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

import firebase from '../firebase'

import styles from '../styles/ToolBarStyles'

class ToolBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online',  // 'Online' or 'Offline'
            pathname: 'Enthusiasts', // indicates User

            categoryIDs: [], // list of categoryIDs of categories for specified User
            chosenCategoryId: '-1', // categoryID of chosen Category

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

    // called each time pathname/user changes
    update = () => {
        const { pathname } = this.state
        const orderRef = firebase.database().ref('/order/' + pathname)
        orderRef.on('value', (snapshot) => { // called each time order of categories changes
            const { chosenCategoryId, web } = this.state 
            let categoryIDs = snapshot.val() || [];
            // const newChosenCategoryId = !chosenCategoryId ? (categoryIDs ? categoryIDs[0] : '') : chosenCategoryId
            const newChosenCategoryId = (chosenCategoryId === '-1') ? (categoryIDs ? categoryIDs[0] : '') : chosenCategoryId
            this.setState({
                categoryIDs: categoryIDs, 
                chosenCategoryId: newChosenCategoryId,
                isLoaded: true
            })
            this.props.handleToggleCategory(newChosenCategoryId) // send back to parent component
            this.props.handleToggleWeb(web) // send back to parent component (typically 'Online')
        })
    }

    componentDidMount(){
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newPathname = nextProps.location.pathname.substring(1) || users_list[0]
        // change state when pathname(user) changes
        return (newPathname.toLowerCase() !== prevState.pathname.toLowerCase())
            ? { 
                // web: 'Online',
                pathname: newPathname,
                
                categoryIDs: [],
                chosenCategoryId: '-1',

                edit: false,

                anchorE1: null,
                openAdd: false,
                newCategory: '',

                isLoaded: false
            }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    toggleOnOff = (e) => {
        const { web } = this.state 
        const newWeb = (web === 'Online') ? 'Offline' : 'Online'
        this.setState({ web: newWeb })
        this.props.handleToggleWeb(newWeb)
    }

    toggleEdit = (e) => {
        const { edit } = this.state
        this.setState({ edit: !edit })
    }

    handleToggleCategory = (categoryId) => {
        this.setState({ chosenCategoryId: categoryId })
        this.props.handleToggleCategory(categoryId)
    }

    handleCategoryChange = (newCategoryName, index) => {
        const { categoryIDs } = this.state

        let changeCategoryId = categoryIDs[index] 
        firebase.database().ref('categories/' + changeCategoryId).set(newCategoryName)
    }

    handleDeleteCategory = async (index) => {
        const { categoryIDs, chosenCategoryId } = this.state
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
        })
        Promise.all(deletePromises)
        if (deletedCategoryId === chosenCategoryId) {
            this.setState({ chosenCategoryId: categoryIDs[(index + 1)]})
            this.props.handleToggleCategory(categoryIDs[(index + 1)])
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
            const { newCategory, openAdd, categoryIDs } = this.state
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
                    chosenCategoryId: newCategoryKey
                })

                if (this.scroll) {
                    this.scroll.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                };

                this.props.handleToggleCategory(newCategoryKey)
            }
        }
    }
    
    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination || (
            destination.droppableId === source.droppableId &&
            destination.index === source.index)
        ) return;

        const { categoryIDs, pathname } = this.state
        const newCategories = Array.from(categoryIDs)
        newCategories.splice(source.index, 1);
        newCategories.splice(destination.index, 0, draggableId);

        firebase.database().ref('/order/' + pathname).set(newCategories)
    }

    render() {
        const { classes } = this.props;
        const { web, categoryIDs, chosenCategoryId, edit, anchorE1, openAdd, isLoaded, newCategory } = this.state

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
                                                        (<div> 
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
                                                            </div>
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