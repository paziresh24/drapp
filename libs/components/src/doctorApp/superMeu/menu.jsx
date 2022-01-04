import { MenuData } from './menuData';
import styles from './menu.module.scss';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

const Menu = () => {
    const menuData = MenuData();
    return (
        <div className={styles.wrapper}>
            {menuData.map(item => (
                <Link to={item.path} key={item.path} className={styles.item}>
                    <div className={styles.icon}>
                        {item.icon}
                        {item.badge ? (
                            <span className={styles.badge}>
                                <span className={styles.red}>{item.badge}</span>
                            </span>
                        ) : null}
                    </div>
                    <span className={styles.title}>{item.title}</span>
                </Link>
            ))}
        </div>
    );
};

export default Menu;
