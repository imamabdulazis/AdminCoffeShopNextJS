import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "@components/layouts/Admin.js";
import TableDropdown from "@components/elements/Dropdowns/TableDropdown.js";
import moment from 'moment';
import MaterialTable from 'material-table';
import { toast } from 'react-toastify';
import { locale } from '@utils/locale.js';

export default function CategoryPage({ color = 'light' }) {

    const router = useRouter()
    const [categoryState, setCategoryState] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        getCategory()
    }, []);

    const unAutorize = () => {
        router.replace('/login')
    }

    // get Kategori
    const getCategory = () => {
        setloading(true);
        fetch('/api/v1/category', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
            }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setCategoryState(data);
                    setloading(false);
                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false);
                } else {
                    toast.error("Terjadi kesalahan data Katergori")
                    setloading(false);
                }
            }).catch(e => {
                setloading(false);
                toast.error("Internal Server Error")
                console.log(e);
            })
    }


    const deleteCategory = (id) => {
        setloading(true);
        fetch(`/api/v1/category/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
            }).then((res) => res.json())
            .then((res) => {
                console.log(res)
                if (res.status == 200) {
                    getCategory()
                    toast.success('Berhasil menghapus');
                    window.location.reload()
                    setloading(false);
                } else {
                    setloading(false);
                    toast.warning('Gagal menghapus');
                }
            }).catch(err => {
                setloading(false);
                toast.error('Terjadi kesalaan server');
            })
    }

    const updateCategory = (name, description, id) => {
        setloading(true);
        fetch(`/api/v1/category/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            }).then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    getCategory()
                    toast.success("Berhasil tambah kategory")
                    window.location.reload()
                    setloading(false);
                } else {
                    toast.warning("Terjadi kesalahan")
                    setloading(false);
                }
            }).catch((err) => {
                toast.error("Internal Server Error")
                setloading(false);
            });
    }

    const addCategory = (name, description) => {
        setloading(true);
        fetch('/api/v1/category', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            }).then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    getCategory();
                    toast.success("Berhasil tambah kategory")
                    window.location.reload()
                    setloading(false);
                } else {
                    console.log(res);
                    toast.warning("Terjadi kesalahan");
                    setloading(false);
                }
            }).catch((err) => {
                toast.error("Internal Server Error")
                setloading(false);
            });
    }

    const [columns, setColumns] = useState([
        { title: 'NAMA', field: 'name' },
        { title: 'DESKRIPSI', field: 'description', cellStyle: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 100 } },
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

    return ( <
        >
        <div className="flex flex-wrap mt-12">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="KATEGORI"
                        columns={columns}
                        data={categoryState}
                        localization={locale}
                        isLoading={loading}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    addCategory(newData.name, newData.description)
                                    setTimeout(() => {
                                        resolve();
                                    }, 1000)
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    updateCategory(newData.name, newData.description, oldData.id);
                                    setTimeout(() => {

                                        resolve();
                                    }, 1000)
                                }),
                            onRowDelete: (rawData, oldData) =>
                                new Promise((resolve, reject) => {
                                    deleteCategory(rawData.id);
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


CategoryPage.layout = Admin