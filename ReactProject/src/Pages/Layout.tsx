import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useEffect } from "react";
import Dialog from "../components/Dialogs/Dialog";
import MessageLayer from "../components/Messages/MessageLayer";
import ProgressBar from "../components/Dialogs/ProgressBar";

const Layout = () => {

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [];
    }

    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    });

    return (
        <>
            <Navbar></Navbar>
            <div className="main-wrapper">
                <Outlet />
                <Dialog></Dialog>
                <MessageLayer></MessageLayer>
            </div>
            <ProgressBar></ProgressBar>
        </>
    );
};

export default Layout;