import React from "react";
import { useGlobalContext } from "../context/globalContext";
import ThemeDropdown from "./ThemeDropdown/ThemeDropdown";

function Navbar() {
    const { state } = useGlobalContext();

    return (
        <div className="w-full py-4 flex items-center justify-between">
            <div className="left">
                <span className="text-lg font-bold">WeatherTM</span>
            </div>
            <div className="search-container flex shrink-0 w-full gap-2 sm:w-fit">
                <div className="btn-group flex items-center gap-2">
                    <ThemeDropdown />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
