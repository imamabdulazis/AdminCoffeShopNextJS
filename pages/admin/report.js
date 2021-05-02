import { useRouter } from 'next/router';
import React from 'react'
import Admin from "../components/layouts/Admin.js";

export default function ReportPage() {

    const router=useRouter();

    useRouter(()=>{
        if (!localStorage.getItem('token')) {
            router.replace('/login')
        }
    },[])

    return (
        <div>
            REPORT
        </div>
    )
}

ReportPage.layout = Admin
