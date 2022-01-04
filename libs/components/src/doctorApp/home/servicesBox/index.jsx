import styles from './servicesBox.module.scss';
import { ServiceBox } from '../serviceBox';
import TurningIcon from '../../../icons/doctorApp/turning';
import ConsultIcon from '../../../icons/doctorApp/consult';
import QaIcon from '../../../icons/doctorApp/qa';
import PrescriptionIcon from '../../../icons/doctorApp/prescription';
import { Link } from 'react-router-dom';
import { getToken } from '@paziresh24/utils/localstorage';

const ServicesBox = () => {
    const token = getToken();

    return (
        <div className={styles['services-wrapper']}>
            <div className={styles['inner']}>
                <Link to="/prescription">
                    <ServiceBox
                        title="صدور نسخه در کمتر از 1 دقیقه"
                        // description="صدور آنلاین نسخه های بیماران"
                        icon={<PrescriptionIcon />}
                    />
                </Link>
                {/* <Link to="/consult">
                    <ServiceBox
                        title="مشاوره آنلاین"
                        description="ویزیت آنلاین بیماران از سراسر دنیا"
                        icon={<ConsultIcon />}
                    />
                </Link> */}
            </div>
            <div className={styles['inner']}>
                <Link to="/turning">
                    <ServiceBox
                        title="مدیریت نوبت های مطب"
                        // description="مدیریت نوبت دهی بیماران مطب"
                        icon={<TurningIcon />}
                    />
                </Link>
                {/* <Link to="/qa">
                    <ServiceBox
                        title="پرسش و پاسخ"
                        description="پاسخ به سوالات کاربران"
                        icon={<QaIcon />}
                    />
                </Link> */}
            </div>
        </div>
    );
};

export { ServicesBox };
