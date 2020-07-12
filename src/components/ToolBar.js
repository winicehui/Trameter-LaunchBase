import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Grid, Select, MenuItem, Popover, TextField } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import CategoryChip from './categoryChip'
import users_lists from '../static/Usertypes'

import firebase from '../firebase'

import styles from '../styles/ToolBarStyles'

class ToolBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online', 
            pathname: '',

            categories: [], 
            chosenCategory: '', 

            edit: false,

            anchorE1: null, 
            openAdd: false, 
            newCategory: '',

            isLoaded: false
        }
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

    update = () => {
        const { pathname } = this.state
        const orderRef = firebase.database().ref('/order/' + pathname)
        orderRef.on('value', (snapshot) => {
            const { chosenCategory } = this.state 
            let categories = snapshot.val();
            console.log(categories)
            console.log(chosenCategory)
            this.setState({                 
                categories: categories || [],
                chosenCategory: chosenCategory.length === 0 ? (categories ? categories[0] : '') : chosenCategory,
                isLoaded: true,                 
            })
        })
    }

    componentDidMount(){
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.pathname !== prevState.pathname)
            ? { web: 'Online',
                pathname: nextProps.pathname,

                chosenCategory: '',

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
        if (web === 'Online'){
            this.setState ({ web: 'Offline' })
        } else {
            this.setState({ web: 'Online' })
        }
    }

    toggleEdit = (e) => {
        const { edit } = this.state
        this.setState({ edit: !edit })
    }

    handleToggleCategory = (category) => {
        this.setState({ chosenCategory: category })
    }

    handleCategoryChange = (newCategoryName, index) => {
        // const { categories, chosenCategory } = this.state
        // const newCategories = Array.from(categories)
        // newCategories[index] = newCategoryName 
        // if (categories[index] === chosenCategory){
        //     this.setState({ categories: newCategories, chosenCategory: newCategoryName })
        // } else {
        //     this.setState({ categories: newCategories  })
        // }
        const { categories, chosenCategory } = this.state
        if (categories[index] === chosenCategory) {
            this.setState({ chosenCategory: newCategoryName }, users_lists.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(categories[index])
                    const newCategories = Array.from(user_categories)
                    newCategories[i] = newCategoryName
                    firebase.database().ref('/order/' + user).update(newCategories)
                })
            }))
        } else { 
            users_lists.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(categories[index])
                    const newCategories = Array.from(user_categories)
                    newCategories[i] = newCategoryName 
                    firebase.database().ref('/order/'+user).update(newCategories)
                })
            })
        }
    }

    handleDeleteCategory = (index) => {
        // const { categories, chosenCategory } = this.state
        // const newCategories = Array.from(categories) 
        // newCategories.splice(index, 1)
        // if (categories[index] === chosenCategory) {
        //     this.setState({ categories: newCategories, chosenCategory: '' })
        // } else {
        //     this.setState({ categories: newCategories })
        // }

        const { categories, chosenCategory } = this.state
        const deletedCategory = categories[index]
        
        if (deletedCategory === chosenCategory) {
            this.setState({ chosenCategory: '', isLoaded: false }, users_lists.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(deletedCategory)
                    const newCategories = Array.from(user_categories)
                    if (i >= 0) { 
                        newCategories.splice(i, 1)
                    }
                    console.log(user)
                    console.log(user + " deletedCategory " + deletedCategory)
                    console.log(user + " user_Categories " +user_categories)
                    console.log(user + " index " +i)
                    console.log(user + " newCategories " + newCategories)

                    
                    firebase.database().ref('/order/' + user).update(newCategories)
                })
            }))
        } else {
            users_lists.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(deletedCategory)
                    const newCategories = Array.from(user_categories)
                    newCategories.splice(i, 1)
                    firebase.database().ref('/order/' + user).update(newCategories)
                })
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

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { newCategory, openAdd, categories } = this.state
            if (newCategory.length === 0) {
                this.setState({ anchorE1: null, openAdd: !openAdd, newCategory: '' })
            } else {
                const newCategories = Array.from(categories)
                newCategories.push(newCategory)
                this.setState({ anchorE1: null, openAdd: !openAdd, newCategory: '', categories: newCategories })
            }
        }
    }
    
    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination || (
            destination.droppableId === source.droppableId &&
            destination.index === source.index)
        ) return;

        const { categories, pathname } = this.state
        const newCategories = Array.from(categories)
        newCategories.splice(source.index, 1);
        newCategories.splice(destination.index, 0, draggableId);

        // this.setState({
        //     categories: newCategories
        // })
        
        firebase.database().ref('/order/' + pathname).update(newCategories)
    }

    render() {
        const { classes } = this.props;
        const { web, categories, chosenCategory, edit, anchorE1, openAdd, isLoaded } = this.state

        const id = openAdd ? 'simple-popover' : undefined;
        // const open = anchorE1 === null ? false : true;
        return (
            isLoaded ? 
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Grid
                    container
                    alignItems='center'
                    justify='center'
                    className= {classes.Toolbox}
                >
                    <Grid item 
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

                    <Grid item 
                        lg = {10}
                        className = {classes.MiddleToolbox}
                    >
                        <Droppable droppableId = "categories" direction = "horizontal">
                            {(provided, snapshot) => (
                                <div
                                    style={{ 
                                        display: 'flex', 
                                        overflowX: 'scroll', 
                                        // flexWrap: edit ? 'wrap': 'nowrap', 
                                        backgroundColor: !snapshot.isDraggingOver && !edit ? '#FFFFFF' : '#F2F3F4'
                                    }}
                                    ref = {provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {categories.map((element, i) =>
                                        (
                                            <CategoryChip 
                                                key = {element} 
                                                index = {i} 
                                                category = {element} 
                                                chosenCategory = {chosenCategory}
                                                edit = {edit} 
                                                handleToggleCategory = {this.handleToggleCategory}
                                                handleCategoryChange = {this.handleCategoryChange}
                                                handleDeleteCategory = {this.handleDeleteCategory}
                                            /> 
                                        )
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>   
                    </Grid>

                    <Grid item 
                        lg={1} 
                        className = {classes.RightToolbox}
                    >
                        {edit
                        ? <DoneIcon className ={classes.leftIcon} onClick={this.toggleEdit} />
                        : <EditIcon className={classes.leftIcon}  onClick={this.toggleEdit} />}
                        <AddIcon className={classes.rightIcon} onClick={this.togglePopper} aria-describedby={id} />
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
                                rowsMax={1}
                                placeholder = "New Category"
                                style={{ padding: '8px', minWidth: '50px' }}
                                className={classes.textfield}
                                onChange={this.handleAddTextChange}
                                onKeyPress={this.onKeyPress}
                                inputProps={{ maxLength: 140 }}
                                autoFocus />
                        </Popover>
                    </Grid>
                </Grid>
            </DragDropContext>
            : null
        );
    }
}

export default withStyles(styles)(ToolBar);