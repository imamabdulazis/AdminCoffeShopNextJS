import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/router";

import NotificationDropdown from "../../elements/Dropdowns/NotificationDropdown.js";
import UserDropdown from "../../elements/Dropdowns/UserDropdown.js";
import { AddCartContext } from "../../../context/addCartContext.js";
import { useAddCart } from "../../../hooks/useCartContext.js";
import { ToggleDialogContext } from "../../../context/toggleDialogContext.js";

export default function SidebarKasir() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();

  const { state } = useAddCart();

  const { stateDialog, dispatchDialog } = useContext(ToggleDialogContext);

  // useEffect(() => {
  //   alert(stateDialog)
  // }, [state]);

  return (
    <>
      <AddCartContext.Consumer>
        {({ _ }) => (
          <ToggleDialogContext.Consumer>
            {({ _ }) => (
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
                      href="#pablo"
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
                              href="#pablo"
                              className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                            >Admin Copsychus
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
                    {
                      state?.drinks.map((el) => (
                        <div className="w-full lg:w-1/1 p-1">
                          <div className="flex flex-col lg:flex-row rounded overflow-hidden h-auto lg:h-32 border shadow shadow-lg">
                            <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                              <div className="text-black font-bold text-xl mb-0 leading-tight">{el.name}</div>
                              <div className="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                                {el.category?.name}
                              </div>
                              <p className="text-green-darker text-base">{el.price}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    {/* </div> */}

                    {/* Divider */}
                    <hr className="my-4 md:min-w-full" />
                  </div>
                  <button
                    onClick={() => dispatchDialog({ type: "OPEN" })}
                    className="bottom-0 bg-blue-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="button"
                  >
                    PESAN  {state?.drinks[0]?.price}
                  </button>
                </div>

              </nav>
            )}
          </ToggleDialogContext.Consumer>
        )}
      </AddCartContext.Consumer>
    </>
  );
}
