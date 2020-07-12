import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Grid, Select, MenuItem, Popover, TextField, Container } from '@material-ui/core';
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
            this.setState({                 
                categories: categories || [],
                chosenCategory: !chosenCategory ? (categories ? categories[0] : '') : chosenCategory,
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
        const { categories, chosenCategory } = this.state
        if (categories[index] === chosenCategory) {
            this.setState({ chosenCategory: newCategoryName }, users_lists.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(categories[index])
                    const newCategories = Array.from(user_categories)
                    newCategories[i] = newCategoryName
                    firebase.database().ref('/order/' + user).set(newCategories)
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
                    firebase.database().ref('/order/'+user).set(newCategories)
                })
            })
        }
    }

    handleDeleteCategory = (index) => {
        const { categories, chosenCategory } = this.state
        const deletedCategory = categories[index]
        if (categories[index] === chosenCategory) {
            this.setState({ chosenCategory: categories[(index+1)] }, users_lists.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(deletedCategory)
                    const newCategories = Array.from(user_categories)
                    newCategories.splice(i, 1)
                    firebase.database().ref('/order/' + user).set(newCategories)
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
                    firebase.database().ref('/order/' + user).set(newCategories)
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
            const { newCategory, openAdd } = this.state
            if (newCategory.length === 0) {
                this.setState({ anchorE1: null, openAdd: !openAdd, newCategory: '' })
            } else {
                this.setState({ 
                    anchorE1: null, openAdd: !openAdd, 
                    newCategory: '', chosenCategory: newCategory},
                    users_lists.forEach(user => {
                        const orderRef = firebase.database().ref('/order/' + user)
                        orderRef.once('value', snapshot => {
                            const user_categories = snapshot.val() || []
                            const newCategories = Array.from(user_categories)
                            newCategories.push(newCategory)
                            firebase.database().ref('/order/' + user).set(newCategories)
                        })
                    })
                )
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

        firebase.database().ref('/order/' + pathname).set(newCategories)
    }

    render() {
        const { classes } = this.props;
        const { web, categories, chosenCategory, edit, anchorE1, openAdd, isLoaded, newCategory } = this.state

        const id = openAdd ? 'simple-popover' : undefined;
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

                    <Grid item 
                        xs = {12}
                        sm = {8}
                        md = {8}
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
                        xs = {12}
                        sm = {2}
                        md={2}
                        lg={1} 
                        className = {classes.RightToolbox}
                    >
                        <Grid
                            container
                        >
                            <Grid item align = "center"
                                xs = {6} 
                            > 
                                {edit
                                    ? <DoneIcon className ={classes.Icon} onClick={this.toggleEdit} />
                                    : <EditIcon className={classes.Icon}  onClick={this.toggleEdit} />}
                            </Grid>
                            
                                <Grid item align="center"
                                xs={6}
                            > 
                                <AddIcon className={classes.Icon} onClick={this.togglePopper} aria-describedby={id} />
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
                                rowsMax={1}
                                value = {newCategory}
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