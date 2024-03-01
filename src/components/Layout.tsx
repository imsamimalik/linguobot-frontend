import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="flex flex-col w-full min-h-screen">
            <Navbar />
            <div className="flex-1 w-4/5 py-5 mx-auto">
                <Outlet />
            </div>
        </main>
    );
};
export default Layout;
