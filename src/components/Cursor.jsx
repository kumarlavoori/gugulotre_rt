// src/components/Cursor.jsx
import { useEffect } from "react";

export default function Cursor() {
    useEffect(() => {
        const dot = document.getElementById("qg-cursor-dot");
        const ring = document.getElementById("qg-cursor-ring");
        if (!dot || !ring) return;
        let mx = 0, my = 0, rx = 0, ry = 0;
        const onMove = (e) => { mx = e.clientX; my = e.clientY; dot.style.left = mx + "px"; dot.style.top = my + "px"; };
        document.addEventListener("mousemove", onMove, { passive: true });
        let raf;
        const tick = () => { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + "px"; ring.style.top = ry + "px"; raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);

        const addHov = () => document.querySelectorAll("a,button,[data-hover]").forEach((el) => {
            el.addEventListener("mouseenter", () => ring.classList.add("hov"));
            el.addEventListener("mouseleave", () => ring.classList.remove("hov"));
        });

        addHov();
        const mo = new MutationObserver(addHov);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); mo.disconnect(); };
    }, []);

    return (
        <>
            <div id="qg-cursor-dot" />
            <div id="qg-cursor-ring" />
        </>
    );
}