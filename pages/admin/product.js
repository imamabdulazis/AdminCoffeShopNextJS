import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "../components/layouts/Admin.js";
import TableDropdown from "../components/elements/Dropdowns/TableDropdown.js";
import moment from 'moment';
import { locale } from '../../utils/locale.js';
import { toast } from 'react-toastify';
import MaterialTable from 'material-table';

export default function ProuctPage({ color = 'light' }) {

    const router = useRouter()
    const [productState, setProductState] = useState([])
    const [categoryState, setCategoryState] = useState([])

    useEffect(() => {
        getProduct()
        getCategory()
    }, []);

    // get Product
    const getProduct = () => {
        fetch('/api/v1/drink', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    const data = res.data;
                    setProductState(data);
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Minuman,  periksa kembali apakah berelasi dengan data lain")
                }
            }).catch(e => {
                console.log(e);
            })
    }

    // update Product
    const updateProduct = (newData, oldData) => {
        fetch(`/api/v1/drink/${oldData.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify({
                name: newData.name,
                description: oldData.description,
                category_id: oldData.category.id,
                price: newData.price,
                stock: parseInt(newData.stock)
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    getProduct();
                    toast.success('Update data produk berhasil')
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Minuman")
                }
            }).catch(e => {
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

    // delete Product
    const deleteProduct = () => {
        fetch('/api/v1/drink', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
        }).then(res => res.json())
            .then((res) => {

                if (res.status == 200) {
                    getProduct();
                    toast.success("Hapus produk berhasil")
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Minuman")
                }
            }).catch(e => {
                toast.error('Internal Server Error')
                console.log(e);
            })
    }

    const getCategory = () => {
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
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Katergori")
                }
            }).catch(e => {
                console.log(e);
            })
    }

    const [columns, setColumns] = useState([
        {
            title: 'Avatar', field: 'image_url', editable: 'true', render: rowData => (
                <img
                    style={{ height: 36, borderRadius: '50%' }}
                    src={rowData.image_url}
                />
            ),
        },
        { title: 'NAMA', field: 'name' },
        {
            title: 'KATEGORI', field: 'category.name', render: rowData => (
                <>
                    <select className={{}}>
                        {
                            categoryState.map((e) => <option>{e}</option>)
                        }
                    </select>
                </>
            )
        },
        { title: 'HARGA', field: 'price' },
        { title: 'STOK', field: 'stock' },
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
                        title="KATEGORI"
                        columns={columns}
                        data={productState}
                        localization={locale}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    addProduct(newData.name, newData.description)
                                    setTimeout(() => {
                                        resolve();
                                    }, 1000)
                                }),
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    updateProduct(newData, oldData);
                                    setTimeout(() => {
                                        resolve();
                                    }, 1000)
                                }),
                            onRowDelete: (rawData, oldData) =>
                                new Promise((resolve, reject) => {
                                    deleteProduct(rawData.id);
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


ProuctPage.layout = Admin
