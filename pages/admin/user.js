import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import CardTable from '../components/elements/Cards/CardTable.js';
import Admin from "../components/layouts/Admin.js";

import TableDropdown from "../components/elements/Dropdowns/TableDropdown.js";
import MaterialTable from 'material-table';
import { toast } from 'react-toastify';
import { locale } from '../../utils/locale.js';


export default function UserPage({ color = 'light' }) {

    const router = useRouter();

    const [userState, setUserState] = useState([])

    const [columns, setColumns] = useState([
        {
            title: 'Avatar', field: 'image_url', editable: 'true', render: rowData => (
                <img
                    style={{ height: 36, borderRadius: '50%' }}
                    src={rowData.image_url}
                />
            ),
        },
        { title: 'Nama', field: 'name', editable: 'never' },
        { title: 'Email', field: 'email' },
        {
            title: 'No. Telp',
            field: 'telp_number',
        },
        {
            title: 'Previlage',
            field: 'previlage',
        },
    ]);

    useEffect(() => {
        getUser()
    }, []);

    // get user
    const getUser = () => {
        fetch('/api/v1/users', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    const data = res.data;
                    setUserState(data);
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    console.info(res)
                    toast.error("Terjadi kesalahan data users, periksa kembali apakah berelasi dengan data lain")
                }
            }).catch(e => {
                toast.error("Internal Server Error")
                console.log(e);
            })
    }

    // delete user
    const deleteUser = (id) => {
        fetch(`/api/v1/users/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {
                console.info(id);
                if (res.status == 200) {
                    getUser();
                    toast.success('Berhasil hapus penguna')
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan hapus user,  periksa kembali apakah berelasi dengan data lain")
                }
            }).catch(e => {
                console.info(e);
                toast.error("Internal Server Error")
            })
    }

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="PENGGUNA"
                        columns={columns}
                        data={userState}
                        localization={locale}
                        editable={{
                            onRowDelete: (rawData, oldData) =>
                                new Promise((resolve, reject) => {
                                    deleteUser(rawData.id);
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


UserPage.layout = Admin;
