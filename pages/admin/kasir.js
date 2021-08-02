import React, { useContext, useEffect, useState } from 'react'
import Admin from '@components/layouts/Admin'
import Image from 'next/image';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
// import { AddCartProvider, AddCartContext } from '../../src/context/addCartContext';
// import { useAddCart } from '../../src/hooks/useCartContext';
import { toast } from 'react-toastify';
import { AddCartContext } from '../../src/context/addCartContext';
import { useAddCart } from '../../src/hooks/useCartContext';
import { ToggleDialogContext } from '../../src/context/toggleDialogContext';

export default function Kasir() {
    const { stateDialog, dispatchDialog } = useContext(ToggleDialogContext)
    const { dispatch } = useAddCart();

    const [productState, setProductState] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        console.info(`TOGGLE :${stateDialog}`);
        getProduct();
    }, []);

    const AddCart = (el) => {
        dispatch({
            type: "ADD_CART",
            drinks: [el],
            user: "YUHUHUUU",
            payment: "WOEEE"
        })
    }

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

    const addPutOrder = () => {
        dispatchDialog({
            type: "OPEN"
        })
    }

    const handleClose = () => {
        dispatchDialog({
            type: "CLOSE"
        })
    }

    return (
        <div className="flex flex-wrap mt-12">
            <ToggleDialogContext.Consumer>
                {({ state, dispatch }) => (
                    <>
                        {
                            loading ? <div></div> : (
                                <div className="container mx-auto">
                                    <div className="flex flex-wrap -mx-4">
                                        {
                                            productState.map((el) => (
                                                <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
                                                    <a onClick={() => AddCart(el)} className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                                                        <div className="relative pb-48 overflow-hidden">
                                                            <Image className="absolute inset-0 h-full w-full object-cover" layout="fill" objectFit="contain" src={el.image_url} alt="" />
                                                        </div>
                                                        <div className="p-4">
                                                            <span className="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">{el.category.name}</span>
                                                            <h2 className="mt-2 mb-2  font-bold">{el.name}</h2>
                                                            {/* <p className="text-sm">{el.description}</p> */}
                                                            <div className="mt-3 flex items-center">
                                                                <span className="text-sm font-semibold">Rp</span>&nbsp;<span className="font-bold text-xl">{el.price}</span>&nbsp;<span className="text-sm font-semibold">,-</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 border-t border-b text-gray-700">
                                                            <h3>{el.stock}</h3>
                                                        </div>
                                                        <button
                                                            onClick={() => { }}
                                                            className="bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                                            type="button"
                                                        >
                                                            + Tambah
                                                        </button>
                                                    </a>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                        <Dialog
                            open={stateDialog?.isOpen}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">Unggah Foto</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Silahkan upload foto sesui dengan format foto yang valid.
                                </DialogContentText>
                                <div>
                                    Content
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => { }}
                                    variant='contained'
                                    color="primary">
                                    Upload
                                </Button>

                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </ToggleDialogContext.Consumer>
        </div>
    );

}

Kasir.layout = Admin;
