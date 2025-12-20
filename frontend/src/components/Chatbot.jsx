import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Chatbot = ({ isOnboarded }) => {
    const location = useLocation();

    useEffect(() => {
        // Inject script if not already present
        if (!document.getElementById('chtl-script')) {
            window.chtlConfig = { chatbotId: "1184452643" };

            const script = document.createElement('script');
            script.async = true;
            script.dataset.id = "1184452643";
            script.id = "chtl-script";
            script.type = "text/javascript";
            script.src = "https://chatling.ai/js/embed.js";

            document.body.appendChild(script);
        }
    }, []);

    useEffect(() => {
        // Determine if we should hide the chatbot
        const isRestricted = !isOnboarded || location.pathname === '/profile';

        // Method 1: CSS Injection (Instant & Robust)
        const styleId = 'chatling-hider';
        let styleTag = document.getElementById(styleId);

        if (isRestricted) {
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                styleTag.innerHTML = `
                    #chtl-open-chat-icon, 
                    .chtl-display-floating, 
                    #chatling-embed-container,
                    #chtl-chat-iframe,
                    #chtl-widget-container {
                        display: none !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        visibility: hidden !important;
                        z-index: -9999 !important;
                    }
                `;
                document.head.appendChild(styleTag);
            }
        } else {
            if (styleTag) {
                styleTag.remove();
            }
        }

        // Method 2: API (Cleanup)
        const updateApiVisibility = () => {
            if (window.Chatling) {
                if (isRestricted) {
                    window.Chatling.hideChatIcon();
                } else {
                    window.Chatling.showChatIcon();
                }
            }
        };

        // Try API immediately and after delay
        updateApiVisibility();
        setTimeout(updateApiVisibility, 1000);
        setTimeout(updateApiVisibility, 3000);

    }, [location, isOnboarded]);

    return null;
};

export default Chatbot;
