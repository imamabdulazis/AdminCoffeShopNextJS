import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "../components/layouts/Admin.js";
import TableDropdown from "../components/elements/Dropdowns/TableDropdown.js";
import moment from 'moment';
import { locale } from '../../utils/locale.js';
import MaterialTable from 'material-table';
import { toast } from 'react-toastify';

export default function NotificationPage({ color = 'light' }) {
    const router = useRouter()
    const [notificationState, setNotificationState] = useState([])

    useEffect(() => {
        getNotification()
    }, []);

    // get Notification
    const getNotification = () => {
        fetch('/api/v1/notification', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    const data = res.data;
                    setNotificationState(data);
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data notifikasi")
                }
            }).catch(e => {
                console.log(e);
            })
    }

    // get Notification
    const deleteNotification = (id) => {
        fetch(`/api/v1/notification/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    getNotification();
                    toast.success('Hapus notifikasi berhasil')
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data notifikasi")
                }
            }).catch(e => {
                console.log(e);
            })
    }

    const [columns, setColumns] = useState([
        { title: 'CUSTOMER', field: 'device.users.name' },
        { title: 'TITLE', field: 'title' },
        { title: 'DESKRIPSI', field: 'body' },
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
                        title="NOTIFIKASI"
                        columns={columns}
                        data={notificationState}
                        localization={locale}
                        editable={{
                            onRowDelete: (rawData, oldData) =>
                                new Promise((resolve, reject) => {
                                    deleteNotification(rawData.id);
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

NotificationPage.layout = Admin;
