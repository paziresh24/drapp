import styles from './subMenuItem.module.scss';
import { NavLink } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useMenu } from '@paziresh24/context/core/menu';

const SubMenuItem = ({ children, link, external, openSubMenu, id }) => {
    const [, setOpenSideBar] = useMenu();

    return (
        <>
            {!external && openSubMenu[id] && (
                <NavLink
                    to={link}
                    exact
                    className={styles['menu-item']}
                    activeClassName={styles['active']}
                    onClick={() => isMobile && setOpenSideBar(false)}
                >
                    {children}
                </NavLink>
            )}
            {external && (
                <a href={link} className={styles['menu-item']}>
                    {children}
                </a>
            )}
        </>
    );
};

export { SubMenuItem };
