import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Chip, TextField, Fade, Dialog, DialogContentText, Button, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';

import CloseIcon from '@material-ui/icons/Close';
import firebase from '../firebase'

import styles from '../styles/categoryChipStyles'

class CategoryChip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: null, // index in list of categories (react-beautiful-dnd)
            id: null, // category Id
            category:'', // category Name
            chosenCategoryId: '', // chosen category Id
        
            edit: false, // T/F condition for toolbar editing setting
            textEdit: false, // T/F condition for chip editing

            openDelete: false, 
            deleteCategoryText: '',

            isLoaded: false, 
        }
        this.toggleCategory = this.toggleCategory.bind(this);

        this.toggleTextEdit = this.toggleTextEdit.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);

        this.toggleDialog = this.toggleDialog.bind(this);
        this.handleDeleteTextChange = this.handleDeleteTextChange.bind(this);
    }

    componentDidMount(){
        const { index, categoryId, chosenCategoryId, edit } = this.props
        firebase.database().ref('/categories/' + categoryId).on('value', (snapshot) => {
            let categoryName = snapshot.val()
            this.setState({
                index: index,
                id: categoryId,
                category: categoryName,
                chosenCategoryId: chosenCategoryId,

                edit: edit,
                textEdit: false, 

                isLoaded: true,
            })
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.chosenCategoryId !== prevState.chosenCategoryId || 
            nextProps.edit !== prevState.edit || 
            nextProps.index !== prevState.index)
            ? { chosenCategoryId: nextProps.chosenCategoryId, 
                edit: nextProps.edit, 
                index: nextProps.index,
                textEdit: !nextProps.edit ? false : prevState.textEdit, 
                // isLoaded: false 
            }
            : null
    }

    toggleCategory = (e, categoryId) => {
        this.props.handleToggleCategory(categoryId)
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

    deleteCategory= async (e) => {
        const { index } = this.state
        await this.setState({ openDelete: false })
        this.props.handleDeleteCategory(index)
    }

    toggleDialog = (e) => {
        const { openDelete } = this.state
        this.setState({ openDelete: !openDelete, deleteCategoryText:'' })
    }

    handleDeleteTextChange = (e) =>{ 
        const text = e.target.value
        this.setState({ deleteCategoryText: text })
    }

    render() {
        const { index, id, category, chosenCategoryId, edit, textEdit, isLoaded, openDelete, deleteCategoryText  } = this.state
        const { classes } = this.props
        const width = category ?  (category.length + 1) * 8 + 'px' : '0px'
        return (
            isLoaded ? 
            <Fade in = {isLoaded}>
                <Draggable 
                    draggableId={id} 
                    index={index}
                    // isDragDisabled = {edit}
                >
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >
                            {!textEdit || !edit 
                                    ? <div> 
                                        <Chip
                                            label={category}
                                            variant={edit && chosenCategoryId !== id? "outlined" : "default"}
                                            className = { chosenCategoryId === id ? classes.selectedButton : snapshot.isDragging ? classes.isDraggingButton : classes.Button }
                                            style={{
                                                margin: '9px 10px 9px 10px',
                                                borderRadius: '8px',
                                                fontSize: '17px',
                                                cursor: 'pointer',
                                                fontWeight: !snapshot.isDragging ? 'normal' : '500', 
                                            }}
                                            onClick={!edit ? (e) => { this.toggleCategory(e, id) } : this.toggleTextEdit}
                                            onDelete={!edit ? undefined : this.toggleDialog}
                                            {...provided.dragHandleProps}
                                        />
                                        <Dialog
                                            open={openDelete}
                                            onClose={this.toggleDialog}
                                        >
                                            <DialogTitle>
                                                {"Are you absolutely sure?"} 
                                                <IconButton aria-label="close" className={classes.closeButton} onClick={this.toggleDialog}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </DialogTitle>

                                            <DialogContent>
                                                <DialogContentText>
                                                    <p style={{ backgroundColor: '#fdfd96', padding: '5px', margin: '0px', textAlign: 'center' }}> 
                                                    Unexpected bad things will happen if you don't read this! 
                                                    </p>
                                                    <p> Deleting this category <b> cannot </b> be undone. Deleting this category will delete all channels listed under this category for <b> all </b> users. </p>
                                                    <p> Please type <b> {category} </b> to confirm. </p>
                                                </DialogContentText>
                                                <TextField
                                                    value = {deleteCategoryText}
                                                    onChange = {this.handleDeleteTextChange}
                                                    fullWidth
                                                    variant="outlined"
                                                    size= "small"
                                                    autoFocus
                                                >
                                                </TextField> 
                                            </DialogContent>

                                            <DialogActions>
                                                <Button 
                                                    fullWidth 
                                                    onClick={this.deleteCategory} 
                                                    className = {classes.deleteButton} 
                                                    variant = "outlined" 
                                                    disabled = {category !== deleteCategoryText}
                                                >
                                                    I understand the consequences, delete this category.    
                                                </Button>
                                            </DialogActions>

                                        </Dialog>
                                     </div>
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
                </Fade>
                :null
        );
    }
}

export default withStyles(styles)(CategoryChip);