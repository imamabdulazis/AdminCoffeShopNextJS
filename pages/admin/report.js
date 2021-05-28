import MaterialTable from 'material-table';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { locale } from '../../utils/locale.js';
import Admin from "../components/layouts/Admin.js";

export default function ReportPage() {

    const router = useRouter();

    const [reportState, setReportState] = useState([])
    const [loading, setloading] = useState(false)



    const [columns, setColumns] = useState([
        { title: 'PEMESANAN', field: 'orders.drink.name', editable: 'never' },
        { title: 'CUSTOMER', field: 'orders.users.email', editable: 'never' },
        { title: 'JUMLAH', field: 'orders.amount', },
        {
            title: 'TANGGAL UDPATE',
            field: 'updated_at',
            type: 'date',
            dateSetting: {
                format: 'dd/MM/yyyy'
            },
            editable: 'never'
        },
        {
            title: 'TANGGAL LAPORAN',
            field: 'date_report',
            type: 'date',
            dateSetting: {
                format: 'dd/MM/yyyy'
            },
            editable: 'never'
        },
    ]);


    useEffect(() => {
        getReport();
    }, []);

    const unAutorize = () => {
        router.replace('/login')
    }

    // get Report
    const getReport = () => {
        fetch('/api/v1/report', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
            }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setReportState(data);
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Katergori")
                }
            }).catch(e => {
                console.log(e);
            })
    }


    return ( <
        >
        <div className="flex flex-wrap mt-12">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="Report"
                        isLoading={loading}
                        columns={columns}
                        data={reportState}
                        localization={locale}
                        options={{
                          // ..other options
                          exportButton: {
                            csv: true,
                            pdf: true
                          }
                       }}
                    />
                </div>
            </div> <
        />
    )
}

ReportPage.layout = Admin