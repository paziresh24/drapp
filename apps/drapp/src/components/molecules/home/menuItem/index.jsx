import styles from './menuItem.module.scss';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';
import { useMenu } from '@paziresh24/context/core/menu';
import Tooltip from '@mui/material/Tooltip';

const MenuItem = ({ item }) => {
    const [open] = useMenu();
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const RootNodeComponent = item?.onClick && !item.link ? 'div' : NavLink;

    const handleClickOutside = e => {
        if (isDropDownOpen) {
            setIsDropDownOpen(false);
        }
    };
    useEffect(() => {
        document.body.addEventListener('click', handleClickOutside);

        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, [isDropDownOpen]);

    return (
        <div className={styles.menuBarItem}>
            <Tooltip
                title={!open ? item.name : ''}
                placement={'left'}
                componentsProps={{
                    tooltip: {
                        sx: {
                            backgroundColor: 'gray',
                            color: 'white',
                            boxShadow: '0px 0px 22px -2px rgba(0,0,0,0.20)'
                        }
                    }
                }}
            >
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
                    onClick={
                        item?.subMenu
                            ? e => {
                                  //   / e.stopPropagation();
                                  setTimeout(() => setIsDropDownOpen(prev => !prev), 0);
                              }
                            : item?.onClick
                    }
                    exact={item?.link ? true : undefined}
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
            </Tooltip>

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
