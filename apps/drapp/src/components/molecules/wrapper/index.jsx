import styles from 'assets/styles/pages/drApp/index.module.scss';
import { Header } from '@paziresh24/shared/ui/header';
import { SideBar } from '../home/sideBar';
import { useDrApp } from '@paziresh24/context/drapp';
import BottomBar from '../bottomBar/bottomBar';
import { isMobile } from 'react-device-detect';
import { useLocation } from 'react-router-dom';

const Wrapper = ({ children }) => {
    const [info] = useDrApp();
    const isLogined = info.doctor ? true : false;
    const router = useLocation();

    const excloudShowBottomBar = ['/activation/*'];
    const excloudShowBottomBarRegex = excloudShowBottomBar.map(item => new RegExp(item));
    const shouldShowBottomBar =
        isLogined && !excloudShowBottomBarRegex.some(item => item.test(router.pathname));

    return (
        <div className={styles['wrapper']} id="wrapper">
            {isLogined && !isMobile && <SideBar />}
            <div className={styles['article']}>
                {isLogined && <Header />}
                {children}
                {shouldShowBottomBar && <BottomBar />}
            </div>
        </div>
    );
};

export default Wrapper;
