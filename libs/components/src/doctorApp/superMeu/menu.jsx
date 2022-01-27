import styles from './menu.module.scss';
import { Link } from 'react-router-dom';
import { ChevronIcon } from '@paziresh24/components/icons';

const Menu = ({ items }) => {
    return (
        <div className={styles.wrapper}>
            {items.map(item => (
                <Link
                    to={item.path ? item.path : '#'}
                    key={item.title}
                    onClick={item?.onClick}
                    className={styles.item}
                >
                    <div className={styles.item_content}>
                        {item.icon && <div className={styles.icon}>{item.icon}</div>}
                        <span className={styles.title}>{item.title}</span>
                    </div>
                    <div className={styles.item_action}>
                        {item.badge ? (
                            <span className={styles.badge}>
                                <span className={styles.red}>{item.badge}</span>
                            </span>
                        ) : null}
                        <ChevronIcon dir="left" />
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Menu;
