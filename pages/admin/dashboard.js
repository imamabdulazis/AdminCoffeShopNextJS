import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import CardTable from '../components/elements/Cards/CardTable.js';

import Admin from "../components/layouts/Admin.js";
import HeaderStats from '../components/modules/Headers/HeaderStats.js';

export default function Dashboard() {

    const router = useRouter()

    const [orderState, setOrderState] = useState([])
    const [drinkState, setDrinkState] = useState([])
    const [userState, setUserState] = useState([])
    const [notificationState, setNotificationState] = useState([])

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.replace('/login')
        }
    }, []);


    // get order
    const getOrder = () => {
        fetch('/api/v1/drink', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer $${localStorage.getItem('token')}`
            },
        }).then(res => res.json())
            .then((res) => {
                if (res.status == 200) {
                    const data = res.data;
                    setOrderState(data);
                }
            }).catch(e => {
                console.log(e);
            })

    }

    // get drink
    // get user
    // get notification




    return (
        <>
            <div className="flex flex-wrap mt-4">

            </div>
        </>
    )
}

Dashboard.layout = Admin;