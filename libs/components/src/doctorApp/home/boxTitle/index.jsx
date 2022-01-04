import styles from './boxTitle.module.scss';
import Chevron from '../../../icons/public/chevron';
import { Link } from 'react-router-dom';

const BoxTitle = ({ title, subtitle, link, external }) => {
    return (
        <div className={styles['box-title']}>
            <div className={styles['title']}>{title}</div>
            {link && !external && (
                <Link
                    to={{
                        pathname: link
                    }}
                >
                    <div className={styles['inner']}>
                        <span className={styles['sub-title']}>{subtitle}</span>
                        <Chevron />
                    </div>
                </Link>
            )}
            {link && external && (
                <a href={link}>
                    <div className={styles['inner']}>
                        <span className={styles['sub-title']}>{subtitle}</span>
                        <Chevron />
                    </div>
                </a>
            )}
        </div>
    );
};

export { BoxTitle };
