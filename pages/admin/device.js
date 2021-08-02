import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "@components/layouts/Admin.js";
import TableDropdown from "@components/elements/Dropdowns/TableDropdown.js";
import moment from 'moment';
import MaterialTable from 'material-table';
import { locale } from '@utils/locale.js';

export default function DevicePage({ color = 'light' }) {

    const router = useRouter()

    const [deviceState, setDeviceState] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        if (window.localStorage.getItem("@previlage") === 'kasir') {
            router.replace('/admin/kasir')
        } else {
            getDevice()
        }
    }, []);

    const unAutorize = () => {
        router.replace('/login')
    }

    // get Device
    const getDevice = () => {
        setloading(true)
        fetch('/api/v1/device', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setDeviceState(data);
                    setloading(false)
                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false)
                } else {
                    toast.error("Terjadi kesalahan data Device")
                    setloading(false)
                }
            }).catch(e => {
                toast.error("Internal Server Error")
                console.log(e);
            })
    }

    // get Device
    const deleteDevice = (id) => {
        fetch(`/api/v1/device/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    getDevice();
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Device")
                }
            }).catch(e => {
                console.log(e);
            })
    }

    const [columns, setColumns] = useState([
        { title: 'CUSTOMER', field: 'users.name' },
        { title: 'VERSI APLIKASI', field: 'app_version' },
        { title: 'SISTEM OPERASI', field: 'os_name' },
        { title: 'BRAND', field: 'manufacture' },
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
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="PERANGKAT"
                        columns={columns}
                        data={deviceState}
                        localization={locale}
                        editable={{
                            onRowDelete: (rawData, oldData) =>
                                new Promise((resolve, reject) => {
                                    deleteDevice(rawData.id);
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


DevicePage.layout = Admin
