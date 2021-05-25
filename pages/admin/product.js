import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "../components/layouts/Admin.js";
import { locale } from '../../utils/locale.js';
import { toast } from 'react-toastify';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default function ProuctPage({ color = 'light' }) {

    const router = useRouter()
    const [productState, setProductState] = useState([])
    const [categoryState, setCategoryState] = useState([])

    const [drinkId, setdrinkId] = useState("");
    const [loading, setloading] = useState(false)

    const [selectedCategory, setselectedCategory] = useState(null)


    const [pickImage, setPickImage] = useState(false);
    const [fileFoto, setFileFoto] = useState("");

    useEffect(() => {
        getProduct()
        getCategory()
    }, []);

    useEffect(() => {
        setColumns([
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
                title: 'KATEGORI', editable: 'never', field: 'category', render: rowData => (
                    <>
                        <select value={selectedCategory != null ? selectedCategory : rowData.category.id} onChange={(e) => changeCategory(e, rowData)}>
                            {
                                categoryState.length > 0 ? categoryState.map((e) => <option value={e.id}>{e.name}</option>) : <options>Kategori Loading</options>
                            }
                        </select>
                    </>
                )
            },
            { title: 'HARGA', field: 'price' },
            { title: 'STOK', field: 'stock' },
            { title: 'DESKRIPSI', field: 'description' },
            {
                title: 'UPDATE', field: 'updated_at', type: 'date',
                dateSetting: {
                    format: 'dd/MM/yyyy'
                },
                editable: 'never'
            },
        ])
    }, [categoryState])


    useEffect(() => {
        if (selectedCategory != null) {
            updateDrinkCategory(drinkId, selectedCategory)
        }
    }, [selectedCategory])


    const changeCategory = (event, rowData) => {
        setselectedCategory(event.target.value != null ? event.target.value : rowData.id);
        setdrinkId(rowData.id);
        console.info(`DRINK ID :${rowData.id}`);
    }

    // get Product
    const getProduct = () => {
        setloading(true);
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
                    setloading(false);
                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false);
                } else {
                    setloading(false);
                    toast.error("Terjadi kesalahan data Minuman,  periksa kembali apakah berelasi dengan data lain")
                }
            }).catch(e => {
                setloading(false);
                toast.error("Internal Server Error");
                console.log(e);
            })
    }


    // get Product
    const addProduct = (name, description, stock, price) => {
        setloading(true);
        fetch('/api/v1/drink', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify({
                "name": name,
                "description": description,
                "stock": parseInt(stock),
                "price": price,
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    getProduct();
                    setloading(false);
                    window.location.reload();
                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false);
                } else {
                    toast.error("Terjadi kesalahan saat tambah Minuman")
                    setloading(false);
                }
            }).catch(e => {
                console.log(e);
                toast.error("Terjadi kesalahan saat tambah Minuman")
                setloading(false);
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
                    window.location.reload()
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
                    window.location.reload()
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

    const updateDrinkCategory = (drink, category) => {
        setloading(true)
        fetch('/api/v1/drink/category', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify({
                "drink_id": drink,
                "category_id": category,
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setCategoryState(data);
                    window.location.reload();
                    toast.success('Berhasil update minuman')
                    setloading(false)

                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false)
                } else {
                    toast.error("Terjadi kesalahan data Kategori")
                    setloading(false)
                }
            }).catch(e => {
                setloading(false)
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
                toast.error("Terjadi kesalahan data Katergori")
            })
    }

    const [columns, setColumns] = useState();


    const handleFotoChange = (event) => {
        const video = event.target.files[0];
        setFileFoto(video);
    }

    const handleClose = () => {
        setPickImage(false);
    }

    const toggleModalUpload = () => {
        setPickImage(!pickImage);
    }

    const handleUpload = () => {
        toggleModalUpload();
        setloading(true)
        const formData = new FormData();
        formData.append('file', fileFoto, fileFoto.name);
        let headers = {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
        };

        axios({
            method: "PATCH",
            url: `/api/v1/upload/drink/${drinkId}`,
            data: formData,
            headers: headers,
            timeout: 10000,
        }).then((res) => {
            if (res.status === 200) {
                toast.success("Berhasil upload foto")
                setloading(false)
                getProduct();
            } else {
                toast.warn("Gagal upload foto")
                setloading(false)
            }
        }).catch((err) => {
            setloading(false)
            toast.error("Gagal upload foto");
        });
    }


    return (
        <>
            <div className="flex flex-wrap mt-12">
                <div className="w-full mb-12 px-4">
                    <MaterialTable
                        title="KATEGORI"
                        columns={columns}
                        data={productState}
                        localization={locale}
                        isLoading={loading}
                        actions={[
                            {
                                icon: 'queue',
                                tooltip: 'Upload Foto',
                                onClick: (event, rowData) => {
                                    setPickImage(true);
                                    setdrinkId(rowData.id);
                                }
                            },
                        ]}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    addProduct(newData.name, newData.description, newData.stock, newData.price);
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
            <Dialog
                open={pickImage}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Unggah Foto</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Silahkan upload foto sesui dengan format foto yang valid.
                        </DialogContentText>
                    <input type="file" name="file" onChange={handleFotoChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleModalUpload}
                        variant='contained'>
                        Batal
                        </Button>
                    <Button onClick={handleUpload}
                        variant='contained'
                        color="primary">
                        Upload
                        </Button>

                </DialogActions>
            </Dialog>
        </>
    )
}


ProuctPage.layout = Admin
