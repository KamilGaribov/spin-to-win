import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Fish from "components/Fish";
import SplitText from "components/SplitText";


gsap.registerPlugin(ScrollTrigger);


export default function Overlay() {
    useEffect(() => {
        const fish_1 = gsap.timeline({
            scrollTrigger: {
                start: "top top",
                end: "+=1700",
                scrub: 2,
            },
        });

        fish_1.to(".fish-1", {
            x: 180,
            scale: 1.1,
            ease: "none",
        }, 0);

        fish_1.to(".fish-1", {
            x: 260,
            scale: 1.4,
            ease: "none",
        }, 0.5);

        fish_1.to(".fish-1", {
            scale: 1.8,
            opacity: 0,
            ease: "none",
            filter: "blur(4px)",
        }, 0.85);


        const fish_2 = gsap.timeline({
            scrollTrigger: {
                start: "top top",
                end: "+=1600",
                scrub: 1.5,
            },
        });

        fish_2.to(".fish-2", {
            x: 150,
            scale: 1.1,
            ease: "none",
        }, 0);

        fish_2.to(".fish-2", {
            x: 200,
            scale: 1.3,
            ease: "none",
        }, 0.5);

        fish_2.to(".fish-2", {
            scale: 1.5,
            opacity: 0,
            ease: "none",
            filter: "blur(4px)",
        }, 0.85);


        const fish_3 = gsap.timeline({
            scrollTrigger: {
                start: "top top",
                end: "+=1550",
                scrub: 1.5,
            },
        });

        fish_3.to(".fish-3", {
            x: 155,
            scale: 1.1,
            ease: "none",
        }, 0);

        fish_3.to(".fish-3", {
            x: 220,
            scale: 1.3,
            ease: "none",
        }, 0.5);

        fish_3.to(".fish-3", {
            scale: 1.5,
            y: -50,
            opacity: 0,
            ease: "none",
            filter: "blur(4px)",
        }, 0.85);


        const fish_4 = gsap.timeline({
            scrollTrigger: {
                start: "top top",
                end: "+=1500",
                scrub: 1.5,
            },
        });

        fish_4.to(".fish-4", {
            x: 170,      // sağa kayma
            y: -10,      // hafif yukarı
            scale: 1.1,
            ease: "none",
        }, 0);

        fish_4.to(".fish-4", {
            x: 250,
            y: -40,
            scale: 1.35,
            ease: "none",
        }, 0.5);

        fish_4.to(".fish-4", {
            x: 300,
            y: -60,
            scale: 1.7,
            opacity: 0,
            ease: "none",
            filter: "blur(4px)",
        }, 0.85);


        // Fish 5 (3rd column)
        const fish_5 = gsap.timeline({
            scrollTrigger: {
                start: "top top",
                end: "+=1500",
                scrub: 1.5,
            },
        });

        fish_5.to(".fish-5", {
            x: 180,
            y: -40,
            scale: 1.1,
            ease: "none",
        }, 0);

        fish_5.to(".fish-5", {
            x: 260,
            y: -70,
            scale: 1.35,
            ease: "none",
        }, 0.5);

        fish_5.to(".fish-5", {
            x: 310,
            y: -100,
            scale: 1.7,
            opacity: 0,
            ease: "none",
            filter: "blur(4px)",
        }, 0.85);

    }, []);

    useEffect(() => {
        // hide initially
        gsap.set([".fish-6", ".fish-7", ".fish-8"], {
            opacity: 0,
            filter: "blur(0px)",
            force3D: true,
        });

        const fishGroup2 = gsap.timeline({
            scrollTrigger: {
                start: "+=1600",
                end: "+=1900",
                scrub: 1.6,
            },
        });

        // ===== APPEAR =====
        fishGroup2.to(".fish-6", { opacity: 1, x: 50, y: 10 }, 0);
        fishGroup2.to(".fish-7", { opacity: 1, x: 50, y: 10 }, 0.08);
        fishGroup2.to(".fish-8", { opacity: 1, x: 50, y: 10 }, 0.16);

        // ===== DRIFT =====
        fishGroup2.to(".fish-6", { x: 120, y: 20 }, 0.25);
        fishGroup2.to(".fish-7", { x: 120, y: 20 }, 0.32);
        fishGroup2.to(".fish-8", { x: 120, y: 20 }, 0.39);

        // ===== EXIT =====
        fishGroup2.to(".fish-6", {
            opacity: 0,
            x: 180,
            y: 200,
            filter: "blur(6px)",
        }, 0.65);

        fishGroup2.to(".fish-7", {
            opacity: 0,
            x: 180,
            y: 200,
            filter: "blur(6px)",
        }, 0.72);

        fishGroup2.to(".fish-8", {
            opacity: 0,
            x: 180,
            y: 200,
            filter: "blur(6px)",
        }, 0.79);

    }, []);




    useEffect(() => {
        // hide third group initially
        gsap.set(
            [".fish-11", ".fish-12", ".fish-13", ".fish-14", ".fish-15"],
            { opacity: 0, scale: 0.9 }
        );

        const fishGroup3 = gsap.timeline({
            scrollTrigger: {
                start: 10000,      // absolute scroll position
                // end: 13000,        // adjust length if needed
                scrub: 2,
            },
        });

        // ===== APPEAR =====
        fishGroup3.to(
            [".fish-11", ".fish-12", ".fish-13", ".fish-14", ".fish-15"],
            {
                opacity: 1,
                scale: 1,
                stagger: 0.1,
                ease: "none",
            },
            0
        );

        // ===== MOVE / DEPTH =====
        fishGroup3.to(".fish-11", { x: 100, scale: 1.2 }, 0.2);
        fishGroup3.to(".fish-12", { x: 100, scale: 1.15 }, 0.25);
        fishGroup3.to(".fish-13", { x: 120, y: -40, scale: 1.25 }, 0.3);
        fishGroup3.to(".fish-14", { x: 130, y: -60, scale: 1.35 }, 0.35);
        fishGroup3.to(".fish-15", { x: 200, y: -90, scale: 1.4 }, 0.4);

        // ===== EXIT =====
        fishGroup3.to(
            [".fish-11", ".fish-12", ".fish-13", ".fish-14", ".fish-15"],
            {
                opacity: 0,
                scale: 1.8,
                filter: "blur(4px)",
                stagger: 0.08,
                // ease: "none",
            },
            0.8
        );

    }, []);

    useEffect(() => {
        const headlineChars = document.querySelectorAll(".typography .headline .char");
        const subheadlineChars = document.querySelectorAll(".typography .subheadline .char");

        // Headline animation
        gsap.to(headlineChars, {
            scrollTrigger: {
                start: 7800,
                end: 8800,
                scrub: true,
            },
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: "power2.out",
        });

        // Subheadline animation
        gsap.to(subheadlineChars, {
            scrollTrigger: {
                start: 7900,
                end: 8900,
                scrub: true,
            },
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: "power2.out",
        });

        // Optional: fade out letters later
        gsap.to(headlineChars, {
            scrollTrigger: {
                start: 9000,
                end: 10000,
                scrub: true,
            },
            opacity: 0,
            y: -20,
            stagger: 0.02,
            ease: "power1.in",
        });

        gsap.to(subheadlineChars, {
            scrollTrigger: {
                start: 9100,
                end: 10100,
                scrub: true,
            },
            opacity: 0,
            y: -20,
            stagger: 0.02,
            ease: "power1.in",
        });
    }, []);



    useEffect(() => {
        const logo = gsap.timeline({
            scrollTrigger: {
                start: 11200,
                // end: 12000,   // optional, for scrub
                scrub: true,
            },
        });

        logo.fromTo(
            ".logo",
            { opacity: 0, y: -50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, ease: "power2.out" }
        );
    }, []);

    useEffect(() => {
        const parallaxLayers = gsap.timeline({
            scrollTrigger: {
                start: "top top",
                end: "+=3500", // same as first fish group
                scrub: true,
            },
        });

        // Move layers downward (parallax effect)
        parallaxLayers.to(".parallax-layer-1", { y: 420, ease: "none", opacity: 0, filter: "blur(4px)" }, 0);
        parallaxLayers.to(".parallax-layer-2", { y: 600, ease: "none" }, 0);
        parallaxLayers.to(".parallax-layer-3", { y: 780, ease: "none" }, 0);
        parallaxLayers.to(".parallax-layer-4", { y: 740, ease: "none" }, 0);
    }, []);

    useEffect(() => {
        const headlineChars = document.querySelectorAll(".landing-typography .headline .char");
        const subheadlineChars = document.querySelectorAll(".landing-typography .subheadline .char");

        // Start visible
        gsap.set([headlineChars, subheadlineChars], { opacity: 1, y: 0 });

        // Fade out on scroll
        gsap.to([headlineChars, subheadlineChars], {
            scrollTrigger: {
                start: 3500,
                end: "+=1000",
                scrub: true,
            },
            opacity: 0,
            y: -50,
            stagger: 0.02,
            ease: "power1.in",
        });
    }, []);






    return (
        <div className="overlay">
            <div className="overlay">

                <div className="landing-typography">
                    <h1 className="headline">
                        <SplitText text="Balique is the premier supplier of fine caviar, fresh fish, shellfish, and smoked seafood to both elite restaurants and home kitchens" />
                    </h1>
                    <h2 className="subheadline">
                        <SplitText text="Direct from the Ocean to Your Plate" />
                    </h2>
                </div>


                <div className="parallax">
                    <img src="/parallax/1.png" className="parallax-layer-1" alt="overlay-1"/>
                    <img src="/parallax/2.png" className="parallax-layer-2" alt="overlay-2"/>
                    <img src="/parallax/3.png" className="parallax-layer-3" alt="overlay-3"/>
                    <img src="/parallax/4.png" className="parallax-layer-4" alt="overlay-4"/>
                </div>

                <div className="fishes">

                    {/* first fishes */}
                    <div className="fish fish-1">
                        <Fish src="/fishes/fish-1.png" name="Salmon" />
                    </div>

                    <div className="fish fish-2">
                        <Fish src="/fishes/fish-2.png" name="Sea bass" />
                    </div>
                    <div className="fish fish-3">
                        <Fish src="/fishes/fish-3.png" name="Dorado" />
                    </div>

                    <div className="fish fish-4">
                        <Fish src="/fishes/fish-4.png" name="Tuna" />
                    </div>
                    <div className="fish fish-5">
                        <Fish src="/fishes/fish-5.png" name="Mackerel" />
                    </div>

                    {/* second fishes */}
                    <div className="fish fish-second fish-6">
                        <Fish src="/fishes/fish-6.png" name="Lobster" />
                    </div>
                    <div className="fish fish-second fish-7">
                        <Fish src="/fishes/fish-7.png" name="Octopus" />
                    </div>
                    <div className="fish fish-second fish-8">
                        <Fish src="/fishes/fish-8.png" name="Shrimp" />
                    </div>

                    {/* third fishes */}
                    <div className="fish fish-third fish-11">
                        <Fish src="/fishes/octopus.png" name="Octopus" />
                    </div>
                    <div className="fish fish-third fish-12">
                        <Fish src="/fishes/lobster.png" name="Lobster" />
                    </div>
                    <div className="fish fish-third fish-13">
                        <Fish src="/fishes/shrimp.png" name="Shrimp" />
                    </div>

                    <div className="fish fish-third fish-14">
                        <Fish src="/fishes/beluga-caviar.png" name="Beluga Caviar" />
                    </div>
                    <div className="fish fish-third fish-15">
                        <Fish src="/fishes/red-caviar.png" name="Sturgeon Caviar" />
                    </div>
                </div>

                <div className="typography">
                    <h1 className="headline">
                        <SplitText text="Fresh, Premium Seafood" />
                    </h1>
                    <h2 className="subheadline">
                        <SplitText text="Direct from the Ocean to Your Plate" />
                    </h2>
                </div>

                <div className="logo">
                    <img src="/logo.png" alt="Balique Logo" />
                    <a href="https://balique.az" class="fancy-cta" target="_blank" rel="noreferrer">
                        Visit Balique.az
                    </a>
                </div>
            </div>
        </div>

    );
}
