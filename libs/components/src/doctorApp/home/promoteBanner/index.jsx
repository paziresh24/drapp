import styles from './promoteBanner.module.scss';
// import MobileBanner from '@paziresh24/assets/images/drapp/mobile-banner.png';
// import banner from '@paziresh24/assets/images/drapp/banner3.png';
import { useHistory } from 'react-router-dom';

const PromoteBanner = () => {
    const history = useHistory();

    return (
        <div className={styles['promote-banner']} onClick={() => history.push('/')} aria-hidden>
            {/* <img src={banner} alt="promoteBanner" className={styles['banner']} />
            <img src={MobileBanner} alt="promoteBanner" className={styles['mobile-banner']} /> */}
        </div>
    );
};

export { PromoteBanner };
