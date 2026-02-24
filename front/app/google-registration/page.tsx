"use client";

import { useState } from "react";
import PriveForm from "../components/prive/form"

export default function PriveWrapper() {
    const [bgSrc, setBgSrc] = useState("/prive-success.webp");
    const [success, setSuccess] = useState(false);

    return (
        <div
            id="prive-page-2"
            className="relative w-full h-dvh overflow-hidden"
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
                    success2={true}
                    onSuccess={() => setBgSrc("/prive-success.webp")}
                />
            </div>
        </div>
    );
}