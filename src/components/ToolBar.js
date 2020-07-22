import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";

import { Grid, Select, MenuItem, Popover, TextField, Fade } from '@material-ui/core';
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

            categories: [], // list oc categories for specified User
            chosenCategory: '', // chosen category

            edit: false, // T/F condiition for editing/deleting categories in toolbar

            anchorE1: null, // anchor for Popover
            openAdd: false, // T/F condition for opening Add Category Popover
            newCategory: '', // controlled text for Add Category text

            isLoaded: false // T/F condition for data Loaded
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
            const { chosenCategory, web } = this.state 
            let categories = snapshot.val() || [];
            const newChosenCategory = !chosenCategory ? (categories ? categories[0] : '') : chosenCategory
            this.setState({                 
                categories: categories,
                chosenCategory: newChosenCategory,
                isLoaded: true,                 
            })
            this.props.handleToggleCategory(newChosenCategory) // send back to parent component 
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
            ? { web: 'Online',
                pathname: newPathname,
                
                categories: [],
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
        const newWeb = (web === 'Online') ? 'Offline' : 'Online'
        this.setState({ web: newWeb })
        this.props.handleToggleWeb(newWeb)
    }

    toggleEdit = (e) => {
        const { edit } = this.state
        this.setState({ edit: !edit })
    }

    handleToggleCategory = (category) => {
        this.setState({ chosenCategory: category })
        this.props.handleToggleCategory(category)
    }

    handleCategoryChange = (newCategoryName, index) => {
        const { categories, chosenCategory } = this.state
        if (categories[index] === chosenCategory) {
            this.setState({ chosenCategory: newCategoryName }, users_list.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(categories[index])
                    const newCategories = Array.from(user_categories)
                    newCategories[i] = newCategoryName
                    firebase.database().ref('/order/' + user).set(newCategories)
                })
            }))
            this.props.handleToggleCategory(newCategoryName)
        } else { 
            users_list.forEach(user => {
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
            this.setState({ chosenCategory: categories[(index+1)] }, users_list.forEach(user => {
                const orderRef = firebase.database().ref('/order/' + user)
                orderRef.once('value', snapshot => {
                    const user_categories = snapshot.val() || []
                    const i = user_categories.indexOf(deletedCategory)
                    const newCategories = Array.from(user_categories)
                    newCategories.splice(i, 1)
                    firebase.database().ref('/order/' + user).set(newCategories)
                })
            }))
            this.props.handleToggleCategory(categories[(index+1)])
        } else {
            users_list.forEach(user => {
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

    onKeyPress = async (e) => {
        if (e.key === 'Enter') {
            const { newCategory, openAdd, categories } = this.state
            if (newCategory.length === 0) {
                this.setState({ 
                    anchorE1: null, 
                    openAdd: !openAdd, 
                    newCategory: '' 
                })
            } else {
                // this.setState({ 
                //     anchorE1: null, 
                //     openAdd: !openAdd, 
                //     newCategory: '', 
                //     chosenCategory: newCategory},
                //     users_list.forEach(user => {
                //         const orderRef = firebase.database().ref('/order/' + user)
                //         orderRef.once('value', snapshot => {
                //             const user_categories = snapshot.val() || []
                //             const newCategories = Array.from(user_categories)
                //             newCategories.push(newCategory)
                //             firebase.database().ref('/order/' + user).set(newCategories)
                //         })
                //     })
                // )
                let addCategoryPromises = []
                let newOrder = {}
                newOrder[categories.length] = newCategory

                users_list.forEach(user => {
                    addCategoryPromises.push(firebase.database().ref('/order/'+user).push(newOrder))
                })
                await Promise.all(addCategoryPromises)
                this.setState({
                    anchorE1: null,
                    openAdd: !openAdd,
                    newCategory: '',
                    chosenCategory: newCategory
                })
                this.props.handleToggleCategory(newCategory)
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
                                    : null 
                                }
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
                    /> }
                </Grid>
            </DragDropContext>
        );
    };
};

export default withRouter(withStyles(styles)(ToolBar));