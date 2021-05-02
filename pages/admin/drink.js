import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import Admin from "../components/layouts/Admin.js";

export default function DrinkPage() {
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.replace('/login')
        }
    }, [])


    return (
        <div>
            DRINK
        </div>
    )
}

DrinkPage.layout = Admin
