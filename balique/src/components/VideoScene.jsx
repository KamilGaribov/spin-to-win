import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function VideoScene() {
    const imgRef = useRef(null);

    const TOTAL_FRAMES = 624;

    // frame paths
    const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        const frameNumber = String(i + 1).padStart(3, "0");
        return `/extracted-frames/frame-${frameNumber}.webp`;
    });

    useEffect(() => {
        // Preload ALL frames upfront
        const preloadedFrames = [];
        frames.forEach((src) => {
            const img = new Image();
            img.src = src;
            preloadedFrames.push(src);
        });

        // GSAP ScrollTrigger
        const st = ScrollTrigger.create({
            trigger: "#container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => {
                const frameIndex = Math.floor(self.progress * (TOTAL_FRAMES - 1));
                if (imgRef.current) {
                    imgRef.current.src = preloadedFrames[frameIndex];
                }
            },
        });

        return () => {
            st.kill(); // cleanup on unmount
        };
    }, [frames]); // ✅ add frames here


    useEffect(() => {
        let mouseX = 0, mouseY = 0;
        let posX = 0, posY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 70;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 70;
        });

        function animate() {
            posX += (mouseX - posX) * 0.1;
            posY += (mouseY - posY) * 0.1;
            if (imgRef.current) {
                imgRef.current.style.transform = `translate(${posX}px, ${posY}px) scale(1.1)`;
            }
            requestAnimationFrame(animate);
        }

        animate();

    }, []);

    return (
        <div id="container">
            <div className="video-container">
                <img
                    ref={imgRef}
                    src={frames[0]}
                    alt="scroll video"
                    className="video-frame"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
        </div>
    );
};
