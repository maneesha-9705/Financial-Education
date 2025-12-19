import { useEffect } from 'react';

const Chatbot = () => {
    useEffect(() => {
        // Configure Chatling
        window.chtlConfig = { chatbotId: "1184452643" };

        // Create and inject the script
        const script = document.createElement('script');
        script.async = true;
        script.dataset.id = "1184452643";
        script.id = "chtl-script";
        script.type = "text/javascript";
        script.src = "https://chatling.ai/js/embed.js";

        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            try {
                document.body.removeChild(script);

                // Attempt to remove the Chatling widget element
                // Common selectors for chatling (may vary, but we can try generic ones or check the window object)
                const widget = document.getElementById('chatling-embed') || document.querySelector('.chtl-widget') || document.querySelector('[id^="chtl"]');
                if (widget) {
                    widget.remove();
                }

                // Also clean up any global styles injected if possible, though harder to track
                // Remove global variable to force re-init if needed
                delete window.chtlConfig;
            } catch (e) {
                console.error("Error cleaning up chatbot script", e);
            }
        };
    }, []);

    return null;
};

export default Chatbot;
