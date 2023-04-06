import styles from 'assets/styles/pages/drApp/index.module.scss';
import { Header } from '@paziresh24/shared/ui/header';
import { SideBar } from '../home/sideBar';
import { useDrApp } from '@paziresh24/context/drapp';
import BottomBar from '../bottomBar/bottomBar';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorByRefresh from '@paziresh24/shared/ui/errorByRefresh';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import useShouldShowActionBars from '../../hooks/useShouldShowActionBars';

const Wrapper = ({ children }) => {
    const [info] = useDrApp();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [isOffline, setIsOffline] = useState(false);
    const isLogined = info.doctor ? true : false;
    const shouldShowActionBars = useShouldShowActionBars();

    useEffect(() => {
        window.addEventListener('offline', () => {
            setIsOffline(true);
        });
        window.addEventListener('online', () => {
            setIsOffline(false);
        });
    }, []);

    useEffect(() => {
        if (isOffline) {
            toast.loading('ارتباط شما با اینترنت قطع شده است.', {
                toastId: 'offline'
            });
        } else {
            toast.dismiss('offline');
        }
    }, [isOffline]);

    return (
        <ErrorBoundary FallbackComponent={props => <></>} onError={error => console.log(error)}>
            <div
                className={classNames(styles['wrapper'], 'transition-all duration-700', {
                    'blur-sm grayscale pointer-events-none': isOffline
                })}
                id="wrapper"
            >
                {isLogined && !isMobile && shouldShowActionBars && <SideBar />}
                <div className={styles['article']}>
                    {isLogined && <Header />}
                    {children}
                    {isLogined && shouldShowActionBars && <BottomBar />}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Wrapper;
