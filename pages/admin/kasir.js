import React, { useEffect, useState } from 'react'
import Admin from '@components/layouts/Admin'
import Image from 'next/image';
import moment from 'moment';

export default function Kasir() {
    const [productState, setProductState] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        getProduct();
    }, []);

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

    return (
        <div className="flex flex-wrap mt-12">
            <div className="container mx-auto">
                <div className="flex flex-wrap -mx-4">
                    {
                        productState.map((el) => (
                            <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-4">
                                <a onClick={() => console.log('oke')} className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
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
                                </a>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );

}

Kasir.layout = Admin;
