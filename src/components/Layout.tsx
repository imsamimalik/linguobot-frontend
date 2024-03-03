import { useAvatarStore } from "@/store/AvatarStore";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import ReadyPlayerCreator from "./ReadyPlayerCreator";

const Layout = () => {
    const setModelUrl = useAvatarStore((state) => state.setModelUrl);
    const toggleAvatarCreatorView = useAvatarStore(
        (state) => state.toggleAvatarCreatorView
    );
    const showAvatarCreator = useAvatarStore(
        (state) => state.showAvatarCreator
    );
    const handleAvatarCreationComplete = (url: string) => {
        setModelUrl(url);
        toggleAvatarCreatorView();
    };
    return (
        <main className="flex flex-col w-full min-h-screen">
            <Navbar />
            <div className="flex-1 w-4/5 py-5 mx-auto">
                <Outlet />
            </div>
            {showAvatarCreator && (
                <ReadyPlayerCreator
                    handleComplete={handleAvatarCreationComplete}
                />
            )}
        </main>
    );
};
export default Layout;
