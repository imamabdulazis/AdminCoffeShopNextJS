import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import NotificationDropdown from "../../elements/Dropdowns/NotificationDropdown.js";
import UserDropdown from "../../elements/Dropdowns/UserDropdown.js";
import { AddCartContext } from "../../../context/addCartContext.js";
import { useAddCart } from "../../../hooks/useCartContext.js";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import formatCurrency from "../../../utils/formater.js";
import { toast } from "react-toastify";

export default function SidebarKasir() {
  const router = useRouter();
  const { state, dispatch } = useAddCart();

  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const [loading, setloading] = useState(false);

  const [totalOrder, settotalOrder] = useState(1);

  const [paymentMethod, setpaymentMethod] = useState(null);

  const [visible, setvisible] = useState(false);

  const [sumary, setSumary] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [drinks, setdrinks] = useState();

  const [total, settotal] = useState();

  useEffect(() => {
    setIsAdmin(
      window.localStorage.getItem("@previlage") === "admin" ? true : false
    );
  }, []);

  useEffect(() => {
    if (isAdmin) {
      router.replace("dashboard");
    } else {
      getPayment();
    }
  }, [isAdmin]);

  const addOrder = (state) => {
    setloading(true);
    const body = {
      user_id: window.localStorage.getItem("user_id"),
      drinks: drinks,
      payment_method_id: "060443dc-dea4-464d-aea2-2bb2206d44c7",
      total: total,
    };

    //   fetch("/api/v1/new_orders", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + window.localStorage.getItem("token"),
    //     },
    //     body: JSON.stringify(body),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       console.info(`RESPONSE :${res.data}`);
    //       if (res.status == 200) {
    //         const data = res.data;
    //         window.location.reload();
    //         setloading(false);
    //         setvisible(false);
    //         window.location.reload();
    //         toast.success("Pesanan berhasil");
    //       } else if (res.status == 401) {
    //         unAutorize();
    //         setloading(false);
    //         window.location.reload();
    //       } else {
    //         toast.warning(res.message);
    //         setloading(false);
    //         window.location.reload();
    //       }
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       toast.error("Internal Server Error");
    //       setloading(false);
    //       window.location.reload();
    //     });
  };

  const getPayment = () => {
    fetch("/api/v1/payment_method", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          const index = res?.data.findIndex(
            (item) => item.payment_type === "Cash"
          );
          setpaymentMethod(res?.data[index]?.id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openOrder = (state) => {
    if (state?.drinks.length == 0) {
      alert("Mohon pilih produk");
    } else {
      setvisible(true);
      setdrinks(state?.drinks);
      settotal(state?.total);
      console.info(drinks);
      console.info(total);
    }
  };

  return (
    <>
      <AddCartContext.Consumer>
        {({ _ }) => (
          <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
              <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                {/* Toggler */}
                <button
                  className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  type="button"
                  onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
                >
                  <i className="fas fa-bars"></i>
                </button>
                {/* Brand */}
                <Link href="/">
                  <a
                    href="#"
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                  >
                    Admin Copsychus Coffe
                  </a>
                </Link>
                {/* User */}
                <ul className="md:hidden items-center flex flex-wrap list-none">
                  <li className="inline-block relative">
                    <NotificationDropdown />
                  </li>
                  <li className="inline-block relative">
                    <UserDropdown />
                  </li>
                </ul>
                {/* Collapse */}
                <div
                  className={
                    "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                    collapseShow
                  }
                >
                  {/* Collapse header */}
                  <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                    <div className="flex flex-wrap">
                      <div className="w-6/12">
                        <Link href="/">
                          <a
                            href="#"
                            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                          >
                            Admin Copsychus
                          </a>
                        </Link>
                      </div>
                      <div className="w-6/12 flex justify-end">
                        <button
                          type="button"
                          className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                          onClick={() => setCollapseShow("hidden")}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Minuman */}
                  {/* <div className="space-y-6"> */}
                  {state?.drinks.map((el) => (
                    <div className="w-full lg:w-1/1 p-1">
                      <div className="flex flex-col lg:flex-row rounded overflow-hidden h-auto lg:h-32 border shadow shadow-lg">
                        <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                          <div className="text-black font-bold text-xl mb-0 leading-tight">
                            {el.name}
                          </div>
                          <div className="inline-block py-1 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                            {el?.category}
                          </div>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p className="text-green-darker text-base">
                              {formatCurrency(el?.price)}
                            </p>
                            <p>X {el?.quantity}</p>
                          </span>
                          {/* <Button variant="contained" color="primary">
                            Primary
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* </div> */}

                  {/* Divider */}
                  <hr className="my-4 md:min-w-full" />
                </div>
                <button
                  onClick={() => dispatch({ type: "DELETE_CART" })}
                  className="bottom-0 bg-red-800 text-white active:bg-redGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                >
                  CLEAR
                </button>
                <button
                  // onClick={state?.drinks != null ? () => setvisible(true) : () => { }}
                  onClick={() => openOrder(state)}
                  className="bottom-0 bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                >
                  PESAN {state?.total}
                </button>
              </div>
            </nav>
            <Dialog
              open={visible}
              fullWidth
              maxWidth="sm"
              onClose={() => setvisible(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                className="bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              >
                Detail pesanan
              </DialogTitle>
              <DialogContent className="w-full">
                <DialogContentText id="alert-dialog-description">
                  <div style={{ display: "flex", justifyContent: "start" }}>
                    <h3 style={{ width: 100 }}>JUMLAH</h3>
                    <h3 style={{ width: 15 }}>:</h3>
                    <h1>1</h1>
                  </div>
                  <div style={{ display: "flex", justifyContent: "start" }}>
                    <h3 style={{ width: 100 }}>TOTAL</h3>
                    <h3 style={{ width: 15 }}>:</h3>
                    <h1 style={{ color: "green" }}>{state?.total}</h1>
                  </div>
                  {state?.drinks.map((el) => (
                    <div className="w-full lg:w-1/1 p-1">
                      <div className="flex flex-col lg:flex-row rounded overflow-hidden h-auto lg:h-32 border shadow shadow-lg">
                        <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                          <div className="text-black font-bold text-xl mb-0 leading-tight">
                            {el.name}
                          </div>
                          <div className="inline-block py-1 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                            {el?.category}
                          </div>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p className="text-green-darker text-base">
                              {formatCurrency(el?.price)}
                            </p>
                            <p>X {el?.quantity}</p>
                          </span>
                          {/* <Button variant="contained" color="primary">
                            Primary
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => addOrder(state)}
                  className="bottom-0 bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  variant="contained"
                  color="primary"
                >
                  {loading ? "LOADING...." : "BAYAR"}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={visible}
              fullWidth
              maxWidth="sm"
              onClose={() => setvisible(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle
                id="alert-dialog-title"
                className="bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              >
                Detail pesanan
              </DialogTitle>
              <DialogContent className="w-full">
                <DialogContentText id="alert-dialog-description">
                  <div style={{ display: "flex", justifyContent: "start" }}>
                    <h3 style={{ width: 100 }}>JUMLAH</h3>
                    <h3 style={{ width: 15 }}>:</h3>
                    <h1>1</h1>
                  </div>
                  <div style={{ display: "flex", justifyContent: "start" }}>
                    <h3 style={{ width: 100 }}>TOTAL</h3>
                    <h3 style={{ width: 15 }}>:</h3>
                    <h1 style={{ color: "green" }}>{state?.total}</h1>
                  </div>
                  {state?.drinks.map((el) => (
                    <div className="w-full lg:w-1/1 p-1">
                      <div className="flex flex-col lg:flex-row rounded overflow-hidden h-auto lg:h-32 border shadow shadow-lg">
                        <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                          <div className="text-black font-bold text-xl mb-0 leading-tight">
                            {el.name}
                          </div>
                          <div className="inline-block py-1 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                            {el?.category}
                          </div>
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p className="text-green-darker text-base">
                              {formatCurrency(el?.price)}
                            </p>
                            <p>X {el?.quantity}</p>
                          </span>
                          {/* <Button variant="contained" color="primary">
                            Primary
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={addOrder}
                  className="bottom-0 bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  variant="contained"
                  color="primary"
                >
                  {loading ? "LOADING...." : "BAYAR"}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </AddCartContext.Consumer>
    </>
  );
}
