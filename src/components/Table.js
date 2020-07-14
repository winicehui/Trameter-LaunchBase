import React, { Component } from 'react'

import { Container } from '@material-ui/core'
import MaterialTable from 'material-table'

import firebase from '../firebase'

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pathname: '',
            chosenCategory: '', 
            web: 'Online',

            data:[],
            isLoaded: false,
        }
    }

    update = () => {
        const { pathname, chosenCategory, web } = this.state
        // const orderRef = firebase.database().ref('/' + web + )
        // orderRef.on('value', (snapshot) => {
        //     const { chosenCategory } = this.state
        //     let categories = snapshot.val();
            this.setState({
                // chosenCategory: !chosenCategory ? (categories ? categories[0] : '') : chosenCategory,
                isLoaded: true,
            })
        // })
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.pathname !== prevState.pathname || nextProps.chosenCategory !== prevState.chosenCategory || nextProps.web !== prevState.web)
            ? {
                pathname: nextProps.pathname, 
                chosenCategory: nextProps.chosenCategory,
                web: nextProps.web,
                isLoaded: false,
            }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    render() {
        const { isLoaded } = this.state
        return (
            isLoaded 
                ? <MaterialTable
                    style = {{margin: '30px 70px 30px 70px'}}
                    columns={[
                        {   title: 'Channels', 
                            field: 'channel', 
                            width: "10%",
                            sorting: false 
                        },
                        {   title: 'Rating', 
                            field: 'rating', 
                            type: 'numeric',
                            width: '10%',
                        },
                        {
                            title: 'Customer Description',
                            field: 'description',
                            width: '20%',
                            sorting: false
                        },
                        {   title: 'Tech, Product, Market, Company', 
                            field: 'details', 
                            width: "20%",
                            sorting: false 
                        },
                        {   title: 'How to Leverage', 
                            field: 'leverage', 
                            width: '25%',
                            sorting: false 
                        }, 
                        {   title: 'Sub/Link', 
                            field: 'link', 
                            width: '15%',
                            sorting: false 
                        }
                    ]}
                    data={[{ channel: 'StackOverflow', rating: 3, details: 'FAANG', leverage: 'leverage', link: 'StackOverflow.com' }]}
                    title="Channels"

                    options={{
                        headerStyle: { backgroundColor: '#707070', color: '#FFFFFF', fontSize: '16px', padding:'15px', wordBreak: 'break-word', }, 
                        cellStyle: { wordBreak: 'break-word', color: '#707070', fontSize: '14px', hyphens: 'auto',  padding: '15px' },
                        showTitle: false, 
                        draggable: false, 
                        toolbar: false,
                        tableLayout: 'fixed'
                    }}

                    editable={{
                        // onRowAdd: newData =>
                        //     new Promise((resolve, reject) => {
                        //         setTimeout(() => {
                        //             setData([...data, newData]);

                        //             resolve();
                        //         }, 1000)
                        //     }),
                        // onRowUpdate: (newData, oldData) =>
                        //     new Promise((resolve, reject) => {
                        //         setTimeout(() => {
                        //             const dataUpdate = [...data];
                        //             const index = oldData.tableData.id;
                        //             dataUpdate[index] = newData;
                        //             setData([...dataUpdate]);

                        //             resolve();
                        //         }, 1000)
                        //     }),
                        // onRowDelete: oldData =>
                        //     new Promise((resolve, reject) => {
                        //         setTimeout(() => {
                        //             const dataDelete = [...data];
                        //             const index = oldData.tableData.id;
                        //             dataDelete.splice(index, 1);
                        //             setData([...dataDelete]);

                        //             resolve()
                        //         }, 1000)
                        //     }),
                    }}
                />
                : null
        )
        
    }
}

export default Table;