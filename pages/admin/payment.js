import MaterialTable from 'material-table';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { locale } from '../../utils/locale.js';
import Admin from "../components/layouts/Admin.js";

export default function ReportPage() {

    const router = useRouter();

    const [paymentState, setpaymentState] = useState([])
    const [loading, setloading] = useState(false)



    const [columns, setColumns] = useState([
        {
            title: 'Avatar', field: 'image_url', editable: 'true', render: rowData => (
                <img
                    style={{ height: 36, borderRadius: '0%' }}
                    src={rowData.image_url}
                />
            ),
        },
        { title: 'Metode', field: 'payment_type', editable: 'never' },
        { title: 'DESKRIPSI', field: 'description', },
        {
            title: 'UPDATE', field: 'updated_at', type: 'date',
            dateSetting: {
                format: 'dd/MM/yyyy'
            },
            editable: 'never'
        },
    ]);


    useEffect(() => {
        getReport();
    }, []);

    // get Report
    const getReport = () => {
        fetch('/api/v1/payment_method', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setpaymentState(data);
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Pembayaran")
                }
            }).catch(e => {
                toast.error("Terjadi kesalahan data Pembayaran")
                console.log(e);
            })
    }


    return (
        <>
            <div className="flex flex-wrap mt-12">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="Metode pembayaran"
                        isLoading={loading}
                        columns={columns}
                        data={paymentState}
                        localization={locale}
                    />
                </div>
            </div>
        </>
    )
}

ReportPage.layout = Admin
