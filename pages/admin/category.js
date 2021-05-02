import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Admin from "../components/layouts/Admin.js";
import TableDropdown from "../components/elements/Dropdowns/TableDropdown.js";
import moment from 'moment';

export default function CategoryPage({ color = 'light' }) {

    const router = useRouter()
    const [categoryState, setCategoryState] = useState([])

    useEffect(() => {
        getCategory()
    }, []);

    // get Device
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
                    toast.error("Terjadi kesalahan data pemesanan")
                }
            }).catch(e => {
                console.log(e);
            })
    }


    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <>
                        <div
                            className={
                                "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                                (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
                            }
                        >
                            <div className="rounded-t mb-0 px-4 py-3 border-0">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                        <h3
                                            className={
                                                "font-semibold text-lg " +
                                                (color === "light" ? "text-blueGray-700" : "text-white")
                                            }
                                        >
                                            KATEGORI
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="block w-full overflow-x-auto">
                                {/* Projects table */}
                                <table className="items-center w-full bg-transparent border-collapse">
                                    <thead>
                                        <tr>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                NAMA
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                DESRIPSI
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                UPDATE
                                            </th>
                                            
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categoryState.map(e => {
                                                return <tr key={e.id}>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <h5 style={{ color: 'black', fontWeight: 'bold' }}>{e.name}</h5>
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <h5 style={{ color: 'orange', fontWeight: 'bold' }}> {e.description}</h5>
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                    <h5 style={{ color: 'black', fontWeight: 'bold' }}> {moment(e.updated_at).format('DD MMM YYYY')}</h5>
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                                        <TableDropdown />
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}


CategoryPage.layout = Admin
