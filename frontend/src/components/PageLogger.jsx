import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PageLogger = () => {
    const location = useLocation();

    useEffect(() => {
        const logPageAccess = async () => {
            try {
                // Send the current path to the backend for logging
                await axios.post('/log-page-view', {
                    url: location.pathname + location.search
                });
            } catch (error) {
                // Silently fail if logging fails to avoid disrupting user experience
                console.error('Failed to log page view:', error);
            }
        };

        logPageAccess();
    }, [location]);

    return null;
};

export default PageLogger;
