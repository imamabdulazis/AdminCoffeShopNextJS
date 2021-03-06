import React, { useEffect, useState } from "react";
import AdminNavbar from "../modules/Navbars/AdminNavbar.js";
import Sidebar from "../modules/Sidebars/Sidebar.js";
import HeaderStats from "../modules/Headers/HeaderStats.js";
import SidebarKasir from "../modules/Sidebars/SidebarKasir.js";
import { AddCartProvider } from "../../context/addCartContext.js";
import { ToggleDialogProvider } from "../../context/toggleDialogContext.js";

export default function Admin({ children }) {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(window.localStorage.getItem('@previlage') === 'admin' ? true : false);
    }, []);
    return (
        <>
            <AddCartProvider>
                <ToggleDialogProvider>

                    {
                        isAdmin ?
                            <Sidebar /> :
                            <SidebarKasir />
                    }
                    <div className={'relative  md:ml-64 bg-white-100'}>
                        <AdminNavbar />
                        {/* Header */}
                        <HeaderStats />
                        <div className="px-4 md:px-10 mx-auto w-full -m-24">
                            {children}
                            {/* <FooterAdmin /> */}
                        </div>
                    </div>
                </ToggleDialogProvider>
            </AddCartProvider>
        </>
    );
}
