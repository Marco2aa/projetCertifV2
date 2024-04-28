import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './DataGrid.css'
import { LinearProgress } from '@mui/material';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 250
    },
    {
        field: 'top3Coins', headerName: 'Top 3', width: 130, renderCell: (params) => {
            const top3Coins = params.value;
            return (
                <div>
                    {top3Coins.map((coinUrl, index) => (
                        <img key={index} src={coinUrl} alt={`Coin ${index + 1}`} style={{ width: 25, height: 25 }} />
                    ))}
                </div>
            );
        },
    },
    {
        field: 'market_cap',
        headerName: 'Market Cap',
        type: 'number',
        width: 200,
        cellClassName: (params) => {
            const value = params.value;
            if (value < 0) {
                return 'negative-value';
            } else if (value > 0) {
                return 'positive-value';
            }
            return '';
        },
    },
    {
        field: 'market_cap_change_24h',
        headerName: '24h',
        type: 'number',
        width: 200,
        cellClassName: (params) => {
            const value = params.value;
            if (value < 0) {
                return 'negative-value';
            } else if (value > 0) {
                return 'positive-value';
            }
            return '';
        },
    },
    {
        field: 'volume_24h',
        headerName: 'Volume',
        type: 'number',
        width: 250,
    },
    {
        field: 'updatedAt',
        headerName: 'Update',
        width: 200,

    },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];






export default function DataTable() {

    const [tableData, setTableData] = React.useState([])
    const [loading, setLoading] = React.useState(false);

    const fetchCategorie = async () => {
        setLoading(true)
        try {
            let allCategories = [];
            for (let page = 1; page <= 8; page++) {
                const response = await axios.get(`https://localhost:8000/api/categories?page=${page}`);
                const data = response.data;
                allCategories = [...allCategories, ...data['hydra:member']];
            }

            setTableData(allCategories);
            setLoading(false)
            console.log(allCategories)
        } catch (err) {
            console.error(err)
            setLoading(false)

        }
    }

    React.useEffect(() => {
        fetchCategorie()
    }, [])

    const rows = tableData
    console.log(rows)
    return (

        <div style={{
            width: '85%', display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // minHeight: '100vh',
            margin: 'auto',
            marginTop: '40px',
            flexDirection: 'column',
            fontFamily: 'Poppins'

        }}>


            {loading && <LinearProgress style={{ width: '100%', position: 'relative', backgroundColor: 'orange' }} />}
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 15 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                autoWidth
                autoHeight
                loading={rows.length === 0}
            />



        </div>
    );
}