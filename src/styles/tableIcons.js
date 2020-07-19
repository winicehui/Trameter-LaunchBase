import React, { forwardRef } from 'react'
import { withStyles } from "@material-ui/core/styles";

import { Add, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage, 
    LastPage, Remove, SaveAlt, Search, ViewColumn} from '@material-ui/icons';

import { Button } from '@material-ui/core'

const styles = {
    // User Button (unselected)
    button: {
        color: '#FFFFFF',
        backgroundColor: '#353B51',
        textTransform: 'none',
        fontSize: '16px',
        padding: '5px 20px 5px 20px',
        margin: '0px', 
    }, 
    Icon: {
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
}

const tableIcons = {
    Add: forwardRef((props, ref) => <Button {...props} ref = {ref} style = {styles.button} > New Channel </Button>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} style={styles.Icon} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} style={styles.Icon} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} style={styles.Icon} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} style={styles.Icon} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default tableIcons;