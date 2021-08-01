import React, { useEffect, useState } from "react";
import AdminNavbar from "../modules/Navbars/AdminNavbar.js";
import Sidebar from "../modules/Sidebars/Sidebar.js";
import HeaderStats from "../modules/Headers/HeaderStats.js";
import SidebarKasir from "../modules/Sidebars/SidebarKasir.js";
// import FooterAdmin from "../modules/Footers/FooterAdmin.js";

export default function Admin({ children }) {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(window.localStorage.getItem('@previlage') === 'admin' ? true : false);
    }, []);
    return (
        <>
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
        </>
    );
}
