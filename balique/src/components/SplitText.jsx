import React from "react";


export default function SplitText({ text, className }) {
    return (
        <span className={className}>
            {text.split("").map((char, i) => (
                <span key={i} className="char">
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
}
