import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// components

import CardStats from "../../elements/Cards/CardStats.js";

export default function HeaderStats() {

  const router = useRouter();

  const [tokenState, setTokenState] = useState(null)

  const [orderState, setOrderState] = useState([])
  const [drinkState, setDrinkState] = useState([])
  const [userState, setUserState] = useState([])
  const [deviceState, setDeviceState] = useState([])



  useEffect(() => {
    setTokenState(window.localStorage.getItem('token'));
    getOrder();
    getDrink();
    getUser();
    getDevice();
  }, []);


  const unAutorize = () => {
    router.replace('/login')
  }


  // get order
  const getOrder = () => {
    fetch('/api/v1/new_orders', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
      },
    }).then(res => res.json())
      .then((res) => {
        if (res.status == 200) {
          const data = res.data;
          setOrderState(data);
        } else if (res.status == 401) {
          unAutorize();
        } else {
          console.log(res)
          toast.error("Terjadi kesalahan data pemesanan")
        }
      }).catch(e => {
        toast.error("Internal Server Error")
        console.log(e);
      })
  }

  // get drink
  const getDrink = () => {
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
          setDrinkState(data);
        } else if (res.status == 401) {
          unAutorize();
        } else {
          toast.error("Terjadi kesalahan data minuman")
        }
      }).catch(e => {
        console.log(e);
      })
  }

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
          toast.error("Terjadi kesalahan data pengguna")
        }
      }).catch(e => {
        console.log(e);
      })
  }
  // get notification
  const getDevice = () => {
    fetch('/api/v1/device', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token'),
      },
    }).then(res => res.json())
      .then((res) => {
        if (res.status == 200) {
          const data = res.data;
          setDeviceState(data);
        } else if (res.status == 401) {
          unAutorize();
        } else {
          toast.error("Terjadi kesalahan data notifikasi")
        }
      }).catch(e => {
        console.log(e);
      })
  }

  return (
    <>
      {/* Header */}
      <div className="relative bg-white-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PEMESANAN"
                  statTitle={`${orderState.length}`}
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="MINUMAN"
                  statTitle={`${drinkState.length}`}
                  statIconName="fas fa-coffee"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PENGGUNA"
                  statTitle={`${userState.length}`}
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PERANGKAT"
                  statTitle={`${deviceState.length}`}
                  statArrow="up"
                  statPercent="12"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName="fas fa-tools"
                  statIconColor="bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
