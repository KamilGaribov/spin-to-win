"use client";

import { useState } from "react";
import PriveForm from "./form";

export default function PriveWrapper() {
    const [bgSrc, setBgSrc] = useState("/prive-home.png");

    return (
        // <div id="prive-page-2" className="relative w-full">
        <div
            id="prive-page-2"
            className={`relative w-full ${bgSrc === "/prive-success.png" ? "h-dvh overflow-hidden" : "min-h-dvh overflow-y-auto"}`}
        >
            {/* Background (full size) */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgSrc})` }}
            />

            {/* Overlay like Figma */}
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/80" />

            {/* Content */}
            <div className="relative z-10">
                <PriveForm
                    onSuccess={() => setBgSrc("/prive-success.png")}
                />
            </div>
        </div>
    );
}