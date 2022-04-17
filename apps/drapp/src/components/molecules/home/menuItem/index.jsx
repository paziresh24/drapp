import styles from './menuItem.module.scss';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useState } from 'react';
import { useMenu } from '@paziresh24/context/core/menu';

const MenuItem = ({ item }) => {
    const [open] = useMenu();
    const history = useHistory();
    const [isDropDownOpen, setIsDropDownOpen] = useState();

    const RootNodeComponent = item?.onClick && !item.link ? 'div' : NavLink;

    return (
        <div className={styles.menuBarItem}>
            <RootNodeComponent
                key={item?.id}
                to={item?.link ?? '#'}
                className={styles.menuContent}
                activeClassName={item?.link ? styles['active'] : undefined}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                }}
                onClick={item?.onClick}
                exact={item?.link ? true : undefined}
                onMouseOver={() => item?.subMenu && setIsDropDownOpen(true)}
                onMouseLeave={() => item?.subMenu && setIsDropDownOpen(false)}
            >
                <div className={styles.menuIcon}>{item?.icon}</div>
                <span
                    style={{
                        right: open ? '3.5rem' : '0',
                        transitionDelay: !open ? 'unset' : '0.2s',
                        opacity: open ? '1' : '0'
                    }}
                    className={styles.menuName}
                >
                    {item?.name}
                </span>
            </RootNodeComponent>

            {item.subMenu && (
                <CSSTransition
                    in={isDropDownOpen}
                    timeout={300}
                    classNames={{
                        enter: styles.dropdown_enter,
                        enterActive: styles.dropdown_enter_active,
                        enterDone: styles.dropdown_enter_done,
                        exitActive: styles.dropdown_exit_active
                    }}
                    unmountOnExit
                >
                    <div
                        className={`${styles.items_dropdown} ${
                            isDropDownOpen === 'open' ? styles.open : ''
                        } ${isDropDownOpen === 'closing' ? styles.closing : ''}`}
                        onMouseOver={() => setIsDropDownOpen(true)}
                        onMouseLeave={() => setIsDropDownOpen(false)}
                    >
                        {item.subMenu.map(item => (
                            <Link key={item.link} to={item.link}>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </CSSTransition>
            )}
        </div>
    );
};

export { MenuItem };