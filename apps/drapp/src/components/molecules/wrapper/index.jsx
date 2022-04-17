import styles from 'assets/styles/pages/drApp/index.module.scss';
import { Header } from '@paziresh24/shared/ui/header';
import { SideBar } from '../home/sideBar';
import { useDrApp } from '@paziresh24/context/drapp';
import BottomBar from '../bottomBar';
import { isMobile } from 'react-device-detect';

const Wrapper = ({ children }) => {
    const [info] = useDrApp();
    const isLogined = info.doctor ? true : false;

    return (
        <div className={styles['wrapper']} id="wrapper">
            {isLogined && !isMobile && <SideBar />}
            <div className={styles['article']}>
                {isLogined && <Header />}
                {children}
                {isLogined && <BottomBar />}
            </div>
        </div>
    );
};

export default Wrapper;