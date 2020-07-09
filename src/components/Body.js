import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Grid, Select, MenuItem } from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import CategoryChip from './categoryChip'

import sampleCatList from '../static/sampleCatList'

const styles = {
    select: {
        textAlign: 'center',
        fontSize: '17px',
        color: '#707070',
        "&:focus": {
            backgroundColor: "#FFFFFF"
        }, 
        "&:hover": { 
            color: '#2B2B2B' 
        }
    }, 
    leftIcon: {
        cursor: 'pointer', 
        height: '50px', 
        padding: '0 14px 0 25px',
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
    rightIcon:{
        cursor: 'pointer', 
        height: '50px', 
        padding: '0 25px 0 14px',
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
    }
}

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web: 'Online', 

            categories: sampleCatList, 
            chosenCategory: sampleCatList[0] || '', 

            edit: false,
        }
        this.toggleOnOff = this.toggleOnOff.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);

        this.handleToggleCategory =this.handleToggleCategory.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this);

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

    render() {
        const { classes } = this.props;
        const { web, categories, chosenCategory, edit } = this.state
        console.log(categories, chosenCategory)

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Grid
                    container
                    alignItems='center'
                    justify='center'
                    style={{ borderWidth: '0px 0px 1px 0px', borderColor: '#707070', borderStyle: 'solid' }}
                >
                    <Grid item 
                        lg={1} 
                        style={{ borderRight: '1px solid #707070', height: '50px', padding:'10px' }}
                    >
                        <Select
                            value={ web }
                            onChange={ this.toggleOnOff }
                            fullWidth
                            disableUnderline    
                            inputProps={{
                                classes: { select: classes.select }
                            }}
                        >
                            <MenuItem value={'Online'}>Online</MenuItem>
                            <MenuItem value={'Offline'}>Offline</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item 
                        lg = {10}
                        style={{ borderRight: '1px solid #707070', height: '50px' }}
                    >
                        <Droppable droppableId = "categories" direction = "horizontal">
                            {(provided, snapshot) => (
                                <div
                                    style={{ display: 'flex', 
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
                        style={{  height: '50px' }}
                    >
                        {edit
                        ? <DoneIcon className ={classes.leftIcon} onClick={this.toggleEdit} />
                        : <EditIcon className={classes.leftIcon}  onClick={this.toggleEdit} />}
                        <AddIcon className={classes.rightIcon} />
                    </Grid>
                </Grid>
            </DragDropContext>
        );
    }
}

export default withStyles(styles)(Body);