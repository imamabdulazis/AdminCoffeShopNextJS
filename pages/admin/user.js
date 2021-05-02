import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import CardTable from '../components/elements/Cards/CardTable.js';
import Admin from "../components/layouts/Admin.js";


export default function UserPage() {

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.replace('/login')
        }
    }, []);


    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CardTable name="Pengguna" />
                </div>

            </div>
        </>
    )
}


UserPage.layout = Admin;
