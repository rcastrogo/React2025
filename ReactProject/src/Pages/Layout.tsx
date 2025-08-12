import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Dialog from "../components/Dialogs/Dialog";
import MessageLayer from "../components/Messages/MessageLayer";
import ProgressBar from "../components/Dialogs/ProgressBar";
import MobileMenu from "../components/Menu/MobileMenu";
import NotificationPanel from "../components/Notifications/NotificationPanel";

const Layout = () => {

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
        ];       
    }

    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    }, []);

    return (
        <>
            <Navbar></Navbar>
            <div className="main-wrapper">
                <Outlet />
                <Dialog></Dialog>
                <MessageLayer></MessageLayer>
            </div>
            <ProgressBar></ProgressBar>
            <MobileMenu/>
            <NotificationPanel />
        </>
    );
};

export default Layout;