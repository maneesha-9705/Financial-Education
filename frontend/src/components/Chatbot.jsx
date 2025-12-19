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
                // Also try to remove the widget container if known (often they append to body)
                // Chatling usually doesn't provide a clean destroy method in the public docs,
                // but removing the script prevents double-loading logic issues on re-mount often.
            } catch (e) {
                console.error("Error cleaning up chatbot script", e);
            }
        };
    }, []);

    return null;
};

export default Chatbot;
