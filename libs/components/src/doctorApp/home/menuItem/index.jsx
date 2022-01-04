import styles from './menuItem.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { ChevronIcon, HelpIcon } from '../../../icons';
import { useMenu } from '@paziresh24/context/core/menu';
import { isMobile } from 'react-device-detect';
import ReactTooltip from 'react-tooltip';
import { useTour } from '@reactour/tour';

const MenuItem = ({
    children,
    link,
    external,
    submenu,
    openSubMenu,
    setOpenSubMenu,
    id,
    modal,
    toolTip,
    tourStep
}) => {
    const [, setOpenSideBar] = useMenu();
    const { currentStep, isOpen, setIsOpen } = useTour();

    return (
        <>
            {!external && !submenu ? (
                <NavLink
                    to={`${link}/${
                        tourStep && currentStep === tourStep?.key && isOpen ? tourStep?.value : ''
                    }`}
                    id={id}
                    exact
                    className={styles['menu-item']}
                    activeClassName={styles['active']}
                    onClick={e => {
                        if (modal) {
                            modal();
                            e.preventDefault();
                        }
                        setOpenSubMenu(false);
                        setIsOpen(false);
                        isMobile && setOpenSideBar(false);
                    }}
                >
                    <div className={styles['menu-item-content']}>
                        {children}{' '}
                        {toolTip && !isMobile && <HelpIcon data-tip data-for="providerhint" />}
                        <ReactTooltip id="providerhint" place="top" type="dark" effect="solid">
                            قبل از شروع نسخه نویسی از این قسمت احراز هویت بیمه ها را انجام دهید
                        </ReactTooltip>
                    </div>
                </NavLink>
            ) : (
                <Link
                    to={submenu[0].link}
                    className={`${styles['menu-item']} ${openSubMenu[id] ? styles['active'] : ''}`}
                    onClick={() =>
                        !openSubMenu[id]
                            ? setOpenSubMenu({ [id]: true })
                            : setOpenSubMenu({ [id]: false })
                    }
                    aria-hidden
                >
                    <div className={styles['menu-item-content']}>{children}</div>
                    {submenu && (
                        <ChevronIcon dir={openSubMenu[id] ? 'bottom' : 'left'} color="#fff" />
                    )}
                </Link>
            )}
            {external && (
                <a href={link} className={styles['menu-item']}>
                    {children}
                </a>
            )}
        </>
    );
};

export { MenuItem };
