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

    useEffect(() => {
        getOrder()
    }, []);

    // get order
    const getOrder = () => {
        fetch('/api/v1/orders', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    const data = res.data;
                    setOrderState(data);
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data pemesanan")
                }
            }).catch(e => {
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

     // delete order
     const deleteOrder = (id) => {
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
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data pemesanan")
                }
            }).catch(e => {
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

    const [columns, setColumns] = useState([
        { title: 'CUSTOMER', field: 'users.name' },
        { title: 'MINUMAN', field: 'drink.name' },
        { title: 'JUMLAH', field: 'amount' },
        { title: 'HARGA', field: 'drink.price' },
        { title: 'DISCOUNT', field: 'discount' },
        { title: 'ORDER STATUS', field: 'order_status' },
        { title: 'STATUS PEMBAYARAN', field: 'payment_status' },
        { title: 'TOTAL', field: 'total' },
        {
            title: 'UPDATE', field: 'updated_at', type: 'date',
            dateSetting: {
                format: 'dd/MM/yyyy'
            },
            editable: 'never'
        },
    ]);

    return (
        <>
            <div className="flex flex-wrap mt-12">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="Pemesanan"
                        columns={columns}
                        data={orderState}
                        localization={locale}
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
            </div>
        </>
    )
}

OrderPage.layout = Admin;
