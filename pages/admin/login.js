import React, { useEffect, useState } from "react";
import Link from "next/link";

// layout for page


import Auth from "../components/layouts/Auth.js";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Login() {

    const [usernameState, setUsernameState] = useState("")
    const [passwordState, setPasswordState] = useState("")

    const router = useRouter();

    useEffect(() => {
        toast('Selamat Datang Di Admin Coffeshop')
    }, []);

    const requestLogin = () => {
        const body = {
            "username": usernameState.toString(),
            "password": passwordState.toString()
        }

        fetch('/api/v1/login',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            }
        ).then(res => res.json()).then((res) => {
            // console.log(res);
            if (res.status == 200) {
                if (res.previlage === 'admin') {
                    window.localStorage.setItem('token', res.token)
                    window.localStorage.setItem('user_id', res.user_id)
                    router.replace('/admin/dashboard')
                    toast.success('Berhasil login')
                } else {
                    toast.warning('Anda tidak memiliki akses untuk masuk\n silahkan menggunakan aplikasi mobile')
                }
            } else if (res.status == 422) {
                res.message.map(e => {
                    toast.warning(e)
                    // console.log(e)
                })
            } else {
                toast.error(res.message)
                // console.log(res.message);
            }
        }).catch(err => {
            toast.error("Internal Server Error")
            console.log(err);
        })
    }


    const onLogin = (e) => {
        e.preventDefault();
        requestLogin();
    }

    return (

        <>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-4/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                            <div className="rounded-t mb-0 px-6 py-6">
                                <div className="text-center mb-3">
                                    <h6 className="text-blueGray-500 text-sm font-bold">
                                        Silahkan Login
                                    </h6>
                                </div>

                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                            </div>
                            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                                <div className="text-blueGray-400 text-center mb-3 font-bold">
                                    <small>Di mohon untuk tidak membagikan username dan password kepada orang lain!</small>
                                </div>
                                <form>
                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                            htmlFor="grid-password"
                                        >
                                            Username
                                        </label>
                                        <input
                                            onChange={(e) => setUsernameState(e.target.value)}
                                            type="username"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Username"
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                            htmlFor="grid-password"
                                        >
                                            Password
                                        </label>
                                        <input
                                            onChange={(e) => setPasswordState(e.target.value)}
                                            type="password"
                                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <div className="text-center mt-6">
                                        <button
                                            onClick={onLogin}
                                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="button"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = Auth;
