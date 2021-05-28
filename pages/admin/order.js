import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "../components/layouts/Admin.js";
import TableDropdown from "../components/elements/Dropdowns/OrderDropdown.js";
import moment from 'moment';
import MaterialTable from 'material-table';
import { locale } from '../../utils/locale.js';
import { toast } from 'react-toastify';

export default function OrderPage({ color = 'light' }) {
    const router = useRouter()

    const [orderState, setOrderState] = useState([])
    const [showModal, setShowModal] = React.useState(false);
    const [orderStatus, setOrderStatus] = useState(null)
    const [orderId, setOrderId] = useState(null);
    const [loading, setloading] = useState(false)

    useEffect(() => {
        getOrder()
    }, []);

    const unAutorize = () => {
        router.replace('/login')
    }

    // get order
    const getOrder = () => {
        setloading(true);
        fetch('/api/v1/orders', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
            }).then(res => res.json())
            .then((res) => {
                console.info(`RESPONSE ORDER :$res`);
                if (res.status == 200) {
                    const data = res.data;
                    setOrderState(data);
                    setloading(false);

                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false);
                } else {
                    setloading(false);
                    toast.error(JSON.stringify(res));
                    // toast.error("Terjadi kesalahan data pemesanan")
                }
            }).catch(e => {
                setloading(false);
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

    // delete order
    const deleteOrder = (id) => {
        setloading(true);
        fetch(`/api/v1/orders/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
            }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    getOrder();
                    toast.success("Hapus pemesanan berhasil")
                    setloading(false);
                } else if (res.status == 401) {
                    setloading(false);
                    unAutorize();
                } else {
                    setloading(false);
                    toast.error("Terjadi kesalahan data pemesanan")
                }
            }).catch(e => {
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

    //update order
    const updateOrder = () => {
        setloading(true);
        fetch(`/api/v1/orders/status/${orderId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    order_status: orderStatus == 1 ? "Active" : "Selesai",
                })
            }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    getOrder();
                    window.location.reload();
                    setloading(false);
                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false);
                } else {
                    setloading(false);
                    toast.error("Terjadi kesalahan saat update pemesanan")
                }
            }).catch(e => {
                setloading(false);
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

    const [columns, setColumns] = useState([
        { title: 'CUSTOMER', field: 'users.name', editable: 'never' },
        { title: 'MINUMAN', field: 'drink.name', editable: 'never' },
        { title: 'JUMLAH', field: 'amount', editable: 'never' },
        { title: 'HARGA', field: 'drink.price', editable: 'never' },
        { title: 'DISCOUNT', field: 'discount', editable: 'never' },
        {
            title: 'ORDER STATUS',
            editable: 'never',
            field: 'category',
            render: rowData => (
                <select style={{border:0, outline:0}} value={orderStatus != null ? orderStatus : rowData.order_status=="Active"?1:2} onChange={(e) => changeOrderStatus(e, rowData)}>
                           <option value={1}>Active</option>
                           <option value={2}>Selesai</option>
                        </select>
            )
        },
        { title: 'STATUS PEMBAYARAN', field: 'payment_status', editable: 'never' },
        { title: 'TOTAL', field: 'total', editable: 'never' },
        {
            title: 'JAM',
            field: 'updated_at',
            type: 'time',
            dateSetting: {
                format: 'HH.mm'
            },
            editable: 'never'
        },
        {
            title: 'UPDATE',
            field: 'updated_at',
            type: 'date',
            dateSetting: {
                format: 'dd/MM/yyyy'
            },
            editable: 'never'
        },
    ]);


    useEffect(() => {
        if (orderStatus != null) {
            updateOrder();
        }
    }, [orderStatus])


    const changeOrderStatus = (event, rowData) => {
        setOrderStatus(event.target.value != null ? event.target.value : rowData.id);
        setOrderId(rowData.id);
    }

    return ( <
        >
        <div className="flex flex-wrap mt-12">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="Pemesanan"
                        columns={columns}
                        data={orderState}
                        localization={locale}
                        isLoading={loading}
                        options={{
                          // ..other options
                          exportButton: {
                            csv: false,
                            pdf: true
                          }
                        }}
                        editable={{
                            onRowDelete: (rawData, oldData) =>
                                new Promise((resolve, reject) => {
                                    deleteOrder(rawData.id);
                                    setTimeout(() => {
                                        resolve();
                                    }, 1000)
                                }),
                        }}
                    />
                </div>
            </div> <
        />
    )
}

OrderPage.layout = Admin;