import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "@components/layouts/Admin.js";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import { toast } from 'react-toastify';
import { locale } from '@utils/locale.js';
import axios from 'axios';

export default function UserPage({ color = 'light' }) {

    const router = useRouter();

    const [userState, setUserState] = useState([])

    const [userId, setUserId] = useState("");

    const [loading, setloading] = useState(false);

    const [pickImage, setPickImage] = useState(false);

    const [fileFoto, setFileFoto] = useState("");

    const [columns, setColumns] = useState([{
        title: 'Avatar',
        field: 'image_url',
        editable: 'never',
        render: rowData => (
            <img
                style={{ height: 36, borderRadius: '50%' }}
                src={rowData.image_url}
            />
        ),
    },
    { title: 'Nama', field: 'name' },
    { title: 'Username', field: 'username' },
    { title: 'Password', field: 'password' },
    { title: 'Email', field: 'email' },
    {
        title: 'No. Telp',
        field: 'telp_number',
        type: 'numeric'
    },
    {
        title: 'Previlage',
        field: 'previlage',
    },
    ]);

    useEffect(() => {
        getUser()
    }, []);


    const unAutorize = () => {
        router.replace('/login')
    }

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

    // get user
    const getUser = () => {
        setloading(true)
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
                    setloading(false)
                } else if (res.status == 401) {
                    setloading(false)
                    unAutorize();
                } else {
                    setloading(false)
                    console.info(res)
                    toast.error("Terjadi kesalahan data users, periksa kembali apakah berelasi dengan data lain")
                }
            }).catch(e => {
                setloading(false)
                toast.error("Internal Server Error")
                console.log(e);
            })
    }

    /**
     * @addUser
     */
    const addUser = (newData) => {
        setloading(true);
        const body = {
            "name": newData.name,
            "username": newData.username,
            "email": newData.email,
            "password": newData.password,
            "telp_number": `${newData.telp_number}`,
            "previlage": newData.previlage,
        }
        console.info(body);
        fetch('/api/v1/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
            .then((res) => {
                console.info(`RESPONSE :${res.data}`)
                if (res.status == 200) {
                    const data = res.data;
                    getUser();
                    setloading(false);
                    window.location.reload();
                } else if (res.status == 401) {
                    unAutorize();
                    setloading(false);
                    window.location.reload()
                } else {
                    toast.error("Terjadi kesalahan saat tambah User")
                    setloading(false);
                    window.location.reload()
                }
            }).catch(e => {
                console.log(e);
                toast.error("Internal Server Error")
                setloading(false);
                window.location.reload()
            })
    }

    const updateUser = (newData, oldData) => {
        console.log(newData, oldData);
        fetch(`/api/v1/users/${oldData.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
            },
            body: JSON.stringify({
                name: newData.name,
                username: newData.username,
                email: newData.email,
                telp_number: newData.telp_number,
                previlage: oldData.previlage,
                updated_at: new Date()
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    getUser();
                    toast.success('Update data user berhasil')
                    window.location.reload()
                } else if (res.status == 401) {
                    unAutorize();
                } else {
                    toast.error("Terjadi kesalahan data Minuman")
                }
            }).catch(e => {
                console.log(e);
                if (e) {
                    toast.error('Internal Server Error')
                }
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
            method: "PUT",
            url: `/api/v1/upload/users/${userId}`,
            data: formData,
            headers: headers,
            timeout: 10000,
        }).then((res) => {
            console.info(res);
            if (res.status === 200) {
                toast.success("Berhasil upload foto")
                setloading(false)
                getUser();
            } else {
                console.log(res);
                toast.warn("Gagal upload foto")
                setloading(false)
            }
        }).catch((err) => {
            setloading(false)
            console.info(err);
            if (err != null) {
                // toast.error("Gagal upload foto");
            }
        });
    }

    return (
        <div className="flex flex-wrap mt-4">
            <div className="w-full mb-12 px-4">
                <MaterialTable
                    title="USER"
                    columns={columns}
                    data={userState}
                    localization={locale}
                    actions={[
                        {
                            icon: 'add_a_photo',
                            tooltip: 'Upload Foto',
                            onClick: (event, rowData) => {
                                setPickImage(true);
                                setUserId(rowData.id);
                            }
                        },
                    ]}
                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                addUser(newData);
                                setTimeout(() => {
                                    resolve();
                                }, 1000)
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                updateUser(newData, oldData);
                                setTimeout(() => {
                                    resolve();
                                }, 1000)
                            }),
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
        </div>
    )
}


UserPage.layout = Admin;