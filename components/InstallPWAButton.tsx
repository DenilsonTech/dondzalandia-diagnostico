'use client'

import React, { useEffect, useState } from "react";

const InstallPWAButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showButton, setShowButton] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
            // Garante que o botão fique visível por pelo menos 30 segundos
            if (!timer) {
                const t = setTimeout(() => {
                    setShowButton(false);
                }, 30000);
                setTimer(t);
            }
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            if (timer) clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowButton(false);
        }
        setDeferredPrompt(null);
    };

    if (!showButton) return null;

    return (
        <button
            onClick={handleInstallClick}
            style={{
                padding: "10px 20px",
                background: "#f39d15",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
        >
            Instalar App
        </button>
    );
};

export default InstallPWAButton; 