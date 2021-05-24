import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "../components/layouts/Admin.js";
import MaterialTable from 'material-table';
import { locale } from '../../utils/locale.js';

export default function Dashboard() {

    const router = useRouter()

    const [orderState, setOrderState] = useState([])

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.replace('/login')
        }
        getOrder();
    }, []);


    // get order
    const getOrder = () => {
        fetch('/api/v1/drink', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer $${localStorage.getItem('token')}`
            },
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setOrderState(data);
                }
            }).catch(e => {
                console.log(e);
            })

    }

    const [columns, setColumns] = useState([
        { title: 'CUSTOMER', field: 'users.name' },
        { title: 'MINUMAN', field: 'drink.name' },
        { title: 'JUMLAH', field: 'amount' },
        { title: 'HARGA', field: 'drink.price' },
        { title: 'DISCOUNT', field: 'discount' },
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
                        title="Pemesanan Minuman"
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

Dashboard.layout = Admin;