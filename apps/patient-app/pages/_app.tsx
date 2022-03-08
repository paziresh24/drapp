import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'tailwindcss/tailwind.css';
import '../public/styles/global.scss';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false
        }
    }
});

toast.configure({
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick: true,
    rtl: true,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: false,
    closeButton: true,
    limit: 3,
    theme: 'dark'
});

function CustomApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Head>
                    <title>My Turns</title>
                </Head>
                <main className="app">
                    <Component {...pageProps} />
                </main>
            </QueryClientProvider>
        </>
    );
}

export default CustomApp;