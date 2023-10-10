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
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { isEmbed } from '@paziresh24/shared/utils';
import { CenterList } from '../centerList';
import { ChevronIcon } from '@paziresh24/shared/icon';
import { usePage } from '@paziresh24/context/core/page';

const Wrapper = ({ children }) => {
    const [info] = useDrApp();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [isOffline, setIsOffline] = useState(false);
    const isLogined = info.doctor ? true : false;
    const shouldShowActionBars = useShouldShowActionBars();
    const [page] = usePage();

    const router = useHistory();

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
                {isLogined && !isMobile && !isEmbed() && shouldShowActionBars && <SideBar />}
                <div className={styles['article']}>
                    {/* {isEmbed() && (
                        <div className="bg-slate-100 p-1 z-10 w-full pr-5 flex justify-between items-center border-b border-solid border-slate-200/50  shadow-sm">
                            <div className="flex space-s-3 items-center">
                                <ChevronIcon
                                    dir="right"
                                    onClick={() => router.goBack()}
                                    className="cursor-pointer"
                                />
                                <span className="font-medium text-sm">{page.title}</span>
                            </div>
                            <div className="w-56 md:w-96">
                                <CenterList />
                            </div>
                        </div>
                    )} */}
                    {isLogined && <Header />}
                    {children}
                    {isLogined && !isEmbed() && shouldShowActionBars && <BottomBar />}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Wrapper;
