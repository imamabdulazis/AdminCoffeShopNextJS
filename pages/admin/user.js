import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import CardTable from '../components/elements/Cards/CardTable.js';
import Admin from "../components/layouts/Admin.js";

import TableDropdown from "../components/elements/Dropdowns/TableDropdown.js";


export default function UserPage({ color = 'light' }) {

    const router = useRouter();

    const [userState, setUserState] = useState([])

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
                                            PENGGUNA
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
                                                NAME
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                USERNAME
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                EMAIL
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                NOMOR TELP
                                            </th>
                                            <th
                                                className={
                                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                                    (color === "light"
                                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                                        : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                                                }
                                            >
                                                PREVILAGE
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
                                            userState.map(e => {
                                                return <tr key={e.id}>
                                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                                        <img
                                                            src={e.image_url}
                                                            className="h-12 w-12 bg-white rounded-full border"
                                                            alt="..."
                                                        ></img>{" "}
                                                        <span
                                                            className={
                                                                "ml-3 font-bold " +
                                                                +(color === "light" ? "text-blueGray-600" : "text-white")
                                                            }
                                                        >
                                                            {e.name}
                                                        </span>
                                                    </th>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {e.username}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {e.email}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        {e.telp_number ?? "-"}
                                                    </td>
                                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                        <p style={{ color: e.previlage == 'admin' ? 'red' : 'green', fontWeight: 'bold' }}>{e.previlage}</p>
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


UserPage.layout = Admin;
