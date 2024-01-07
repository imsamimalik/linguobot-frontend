import { useAvatarStore } from "@/store/AvatarStore";
import { Link } from "react-router-dom";

const Header = () => {
    const toggleAvatarCreatorView = useAvatarStore(
        (state) => state.toggleAvatarCreatorView
    );

    return (
        <nav className="start-0 w-full bg-white border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
                <Link
                    to="/"
                    className="rtl:space-x-reverse flex items-center space-x-3"
                >
                    <span className="whitespace-nowrap self-center text-2xl font-semibold">
                        LinguoBot
                    </span>
                </Link>
                <div className="md:order-2 md:space-x-0 rtl:space-x-reverse flex space-x-3">
                    <button
                        type="button"
                        className="hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg"
                        onClick={toggleAvatarCreatorView}
                    >
                        Customize
                    </button>
                </div>
                <div
                    className="md:flex md:w-auto md:order-1 items-center justify-between hidden w-full"
                    id="navbar-sticky"
                >
                    <ul className="md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg">
                        <li>
                            <Link
                                to="/"
                                className="md:bg-transparent md:text-blue-700 md:p-0 block px-3 py-2 text-white bg-blue-700 rounded"
                                aria-current="page"
                            >
                                Skeleton View
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/avatar"
                                className="md:bg-transparent md:text-blue-700 md:p-0 block px-3 py-2 text-white bg-blue-700 rounded"
                                aria-current="page"
                            >
                                Avatar View
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
export default Header;
