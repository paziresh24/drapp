import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { TransitionGroup } from 'react-transition-group';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const isProduction = process.env.NODE_ENV === 'production';
const isMainDomain = window.location.host === process.env.REACT_APP_MAIN_DOMAIN;

if (isProduction && isMainDomain) {
    TagManager.initialize({
        gtmId: 'GTM-P5RPLDP'
    });
}

if (!isProduction) {
    TagManager.initialize({
        gtmId: 'GTM-P5RPLDP'
    });
}

toast.configure({
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: true,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: false,
    closeButton: true,
    limit: 3
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        }
    }
});

if (isProduction && isMainDomain) {
    Sentry.init({
        dsn: 'https://cf12c705f54f4d4ba6e963e4b52476bb@p24guard.paziresh24.com/13',
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV
    });
}

if (!isProduction) {
    Sentry.init({
        dsn: 'https://cf12c705f54f4d4ba6e963e4b52476bb@p24guard.paziresh24.com/13',
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV
    });
}

const Provider = ({ children }) => {
    return (
        <Router
            basename={
                window.location.host === process.env.REACT_APP_MAIN_DOMAIN
                    ? ''
                    : process.env.PUBLIC_URL
            }
        >
            <ScrollToTop />
            <QueryClientProvider client={queryClient}>
                <TransitionGroup>{children}</TransitionGroup>
            </QueryClientProvider>
        </Router>
    );
};
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export { Provider };
