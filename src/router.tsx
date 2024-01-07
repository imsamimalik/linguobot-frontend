import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandmarkCanvas from "./LandmarkCanvas";
import App from "./App";
import Header from "./components/Header";

const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/avatar" element={<App />} />
                <Route path="/" element={<LandmarkCanvas />} />
            </Routes>
        </BrowserRouter>
    );
};
export default Router;
