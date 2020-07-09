import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Chip , TextField } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';

const styles = {
    textfield: {
        borderBottomColor: '#353B51',
        '& .MuiInput-underline:after': {
            borderBottomColor: '#353B51',
        }
    }, 
    hover:{
        "&:hover": {
            opacity: '0.8'
            // fontWeight: '425'
        }
    }
}

class CategoryChip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: null,
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

    componentDidMount(){
        const { category, edit, chosenCategory, index } = this.props
        this.setState({
            category: category, 
            edit: edit, 
            chosenCategory:chosenCategory, 
            index: index,
            isLoaded: true, 
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.chosenCategory !== prevState.chosenCategory || nextProps.edit !== prevState.edit || nextProps.index !== prevState.index)
            ? { chosenCategory: nextProps.chosenCategory, 
                edit: nextProps.edit, 
                index: nextProps.index,
                textEdit: !nextProps.edit ? false : prevState.textEdit, 
                isLoaded: false 
            }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            if (this.props.category !== this.state.category){
                this.props.handleCategoryChange(this.state.category, this.state.index)
            }
            this.setState({ isLoaded: true })
        }
    }
    
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

    deleteCategory(){
        const { index } = this.state
        this.props.handleDeleteCategory(index)
    }

    render() {
        const { category, edit, chosenCategory, index, isLoaded, textEdit } = this.state
        const { classes } = this.props
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
                                    variant={edit ? "outlined" : "default"}
                                    label={category}
                                    className = {classes.hover}
                                    style={{
                                        margin: '9px 10px 9px 10px',
                                        backgroundColor: chosenCategory === category ? '#707070' : snapshot.isDragging ? '#D6DADD' :  '#FFFFFF',
                                        color: chosenCategory === category ? '#FFFFFF' :  '#707070',
                                        borderRadius: '8px',
                                        fontSize: '17px',
                                        cursor: 'pointer',
                                        fontWeight: !snapshot.isDragging ? 'normal' : '500', 
                                    }}
                                    {...provided.dragHandleProps}
                                    onClick={!edit ? (e) => { this.toggleCategory(e, category) } : this.toggleTextEdit}
                                    onDelete={!edit ? undefined : this.deleteCategory}
                                />
                                : <TextField
                                    rowsMax={1}
                                    value={category}
                                    style = {{ padding :'8px' }}
                                    className ={classes.textfield}
                                    onChange={this.handleTextChange}
                                    onKeyPress= {this.onKeyPress}
                                    inputProps={{ maxLength: 140 }}
                                    {...provided.dragHandleProps}
                                    autoFocus
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