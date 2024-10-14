import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { LinearProgress } from '@mui/material';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 250
    },
    {
        field: 'quantity',
        headerName: 'Montant',
        width: 130,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.quantity}
                </div>
            );
        },
    },
    {
        field: 'createdAt',
        headerName: 'Executé le :',
        width: 200,
    },
    {
        field: 'walletName',
        headerName: 'Wallet',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.wallet?.name || ''}
                </div>
            );
        },
    },
    {
        field: 'deviseName',
        headerName: 'Devise',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.devise?.name || ''}
                </div>
            );
        },
    },
    {
        field: 'deviseValeur',
        headerName: 'Valeur',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.devise?.valeur || ''}
                </div>
            );
        },
    },
    {
        field: 'stripeReceiptUrl',
        headerName: 'Receipt URL',
        width: 250,
        renderCell: (params) => {
            const order = params.row;
            const receiptUrl = order.stripe?.receipt_url;
            return (
                <div>
                    {receiptUrl && <a href={receiptUrl}>Cliquez pour voir la facture</a>}
                </div>
            );
        },
    },


];








export default function TransactionData() {

    const [tableData, setTableData] = React.useState([])
    const [loading, setLoading] = React.useState(false);

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('jwtToken')
            const response = await axios.get(`https://localhost:8000/api/getorders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            const data = response.data;
            console.log(data)



            setTableData(data);
            setLoading(false)

        } catch (err) {
            console.error(err)
            setLoading(false)

        }
    }

    React.useEffect(() => {
        fetchOrders()
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