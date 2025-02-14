import React from "react";
import { GiFallingStar } from "react-icons/gi";
import { FaHome } from "react-icons/fa";

export default function NavBar() {
    return (
        <div className="w-75 rounded-pill border px-5 py-3 shadow bg-light d-flex align-items-center justify-content-between">
            <p className="lead fs-4">Kanbana <GiFallingStar /></p>
            <FaHome className="fs-3" style={{cursor: "pointer"}}/>
        </div>
    )
}