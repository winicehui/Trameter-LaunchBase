import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Grid, Select, MenuItem, Popover, TextField } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import CategoryChip from './categoryChip'

import sampleCatList from '../static/sampleCatList'

import styles from '../styles/ToolBarStyles'

class ToolBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online', 

            categories: sampleCatList, 
            chosenCategory: sampleCatList[0] || '', 

            edit: false,

            anchorE1: null, 
            openAdd: false, 
            newCategory: ''
        }
        this.toggleOnOff = this.toggleOnOff.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);

        this.handleToggleCategory =this.handleToggleCategory.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this);

        this.togglePopper = this.togglePopper.bind(this);
        this.handleAddChange = this.handleAddChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);
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
        const newCategories = Array.from(categories)
        newCategories[index] = newCategoryName 
        if (categories[index] === chosenCategory){
            this.setState({ categories: newCategories, chosenCategory: newCategoryName })
        } else {
        this.setState({ categories: newCategories  })
        }
    }

    handleDeleteCategory = (index) => {
        const { categories, chosenCategory } = this.state
        const newCategories = Array.from(categories) 
        newCategories.splice(index, 1)
        if (categories[index] === chosenCategory) {
            this.setState({ categories: newCategories, chosenCategory: '' })
        } else {
            this.setState({ categories: newCategories })
        }
    }

    togglePopper = (e) =>{
        const { anchorE1, openAdd } = this.state
        anchorE1
            ? this.setState({ anchorE1: null, openAdd: !openAdd, newCategory: '' })
            : this.setState({ anchorE1: e.currentTarget, openAdd: !openAdd })
    }

    handleAddChange = (e) => {
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

        const { categories } = this.state
        const newCategories = Array.from(categories)
        newCategories.splice(source.index, 1);
        newCategories.splice(destination.index, 0, draggableId);

        this.setState({
            categories: newCategories
        })
    }

    render() {
        const { classes } = this.props;
        const { web, categories, chosenCategory, edit, anchorE1, openAdd } = this.state

        const id = openAdd ? 'simple-popover' : undefined;
        // const open = anchorE1 === null ? false : true;
        console.log(categories, chosenCategory)

        return (
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
                                // className={classes.textfield}
                                onChange={this.handleAddChange}
                                onKeyPress={this.onKeyPress}
                                inputProps={{ maxLength: 140 }}
                                autoFocus >

                                </TextField>

                        </Popover>
                    </Grid>
                </Grid>
            </DragDropContext>
        );
    }
}

export default withStyles(styles)(ToolBar);