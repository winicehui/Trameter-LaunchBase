import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Chip , TextField } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';

import firebase from '../firebase'

import styles from '../styles/categoryChipStyles'

class CategoryChip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: null,
            id: null,
            category:'',
            chosenCategory: '',
        
            edit: false,
            textEdit: false, 

            isLoaded: false, 
        }
        this.toggleCategory = this.toggleCategory.bind(this);

        this.toggleTextEdit = this.toggleTextEdit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    async componentDidMount(){
        const { index, category, chosenCategory, edit } = this.props
        firebase.database().ref('/categories/' + category).on('value', (snapshot) => {
            let categoryName = snapshot.val()
            console.log(category)
            console.log(categoryName)
            this.setState({
                index: index,
                id: category,
                category: categoryName,
                chosenCategory: chosenCategory,

                edit: edit,
                textEdit: false,

                isLoaded: true,
            })
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.chosenCategory !== prevState.chosenCategory || 
            nextProps.edit !== prevState.edit || 
            nextProps.index !== prevState.index)
            ? { chosenCategory: nextProps.chosenCategory, 
                edit: nextProps.edit, 
                index: nextProps.index,
                textEdit: !nextProps.edit ? false : prevState.textEdit, 
                // isLoaded: false 
            }
            : null
    }

    // componentDidUpdate(nextProps) {
    //     const { category, index } = this.state
    //     if (this.state.isLoaded === false) {
            // SEEMS IRRELEVANT -- SHOULD ASK IF YOU WOULD LIKE TO SAVE 
            // if (category.length === 0) {
            //     console.log("WOWOTOASDF")
            //     this.props.handleDeleteCategory(index)
            // }
            // else if (this.props.category !== category){
            //     this.props.handleCategoryChange(category, index)
            // }
    //         this.setState({ isLoaded: true })
    //     }
    // }
    
    toggleCategory = (e, category) => {
        this.props.handleToggleCategory(category)
    }

    toggleTextEdit = (e) => {
        const { textEdit } = this.state
        this.setState({ textEdit: !textEdit })
    }

    handleTextChange = (e) => {
        const category = e.target.value
        this.setState({ category: category })
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { category, index } = this.state
            this.setState({ textEdit: false })
            if (category.length === 0){
                this.props.handleDeleteCategory(index)
            } else {
                this.props.handleCategoryChange(category, index)
            }
        }
    }

    deleteCategory= (e) => {
        alert("Deleting the category will delete all contents under this category for all users. Would you like to proceed?")
        const { index } = this.state
        this.props.handleDeleteCategory(index)
    }

    render() {
        const { index, id, category, chosenCategory, edit, textEdit, isLoaded  } = this.state
        const { classes } = this.props
        const width = (category.length + 1) * 8 + 'px'
        return (
            isLoaded 
            ? <Draggable 
                    draggableId={category} 
                    index={index}
                    // isDragDisabled = {edit}
                >
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >
                            {!textEdit || !edit 
                                ? <Chip
                                    label={category}
                                    variant={edit && chosenCategory !== id? "outlined" : "default"}
                                    className = { chosenCategory === id ? classes.selectedButton : snapshot.isDragging ? classes.isDraggingButton : classes.Button }
                                    style={{
                                        margin: '9px 10px 9px 10px',
                                        borderRadius: '8px',
                                        fontSize: '17px',
                                        cursor: 'pointer',
                                        fontWeight: !snapshot.isDragging ? 'normal' : '500', 
                                    }}
                                    onClick={!edit ? (e) => { this.toggleCategory(e, id) } : this.toggleTextEdit}
                                    onDelete={!edit ? undefined : this.deleteCategory}
                                    {...provided.dragHandleProps}
                                />
                                : <TextField
                                    value={category}
                                    onChange={this.handleTextChange}
                                    onKeyPress= {this.onKeyPress}
                                    autoFocus
                                    rowsMax={1}
                                    className ={classes.textfield}
                                    style = {{ width: width }}
                                    inputProps={{ maxLength: 140 }}
                                    {...provided.dragHandleProps}
                                    
                                />
                            }
                        </div>
                    )}
                </Draggable>
            : null   
        );
    }
}

export default withStyles(styles)(CategoryChip);