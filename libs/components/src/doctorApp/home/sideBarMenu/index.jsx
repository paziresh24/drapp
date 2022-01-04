import classNames from 'classnames';
import styles from './sideBarMenu.module.scss';
import { MenuItem } from '../../home/menuItem';
import { SubMenuItem } from '../../home/subMenuItem';
import { Fragment, useState } from 'react';

const SideBarMenu = ({ menuItems, noborder, setOpenSubMenu, openSubMenu, children }) => {
    return (
        <div className={classNames([styles['sidebar-menu'], { [styles['no-border']]: noborder }])}>
            {menuItems.map(
                ({ id, name, icon, link, external, subMenu, modal, badge, toolTip, tourStep }) =>
                    id && (
                        <Fragment key={id}>
                            <MenuItem
                                link={link}
                                external={external}
                                submenu={subMenu}
                                setOpenSubMenu={setOpenSubMenu}
                                openSubMenu={openSubMenu}
                                id={id}
                                modal={modal}
                                toolTip={toolTip}
                                tourStep={tourStep}
                            >
                                {/* {icon} */}
                                {name}
                                {badge && children}
                            </MenuItem>
                            {subMenu &&
                                subMenu.map(({ name, icon, link, external }) => (
                                    <SubMenuItem
                                        key={link}
                                        link={link}
                                        external={external}
                                        openSubMenu={openSubMenu}
                                        id={id}
                                    >
                                        {icon}
                                        {name}
                                    </SubMenuItem>
                                ))}
                        </Fragment>
                    )
            )}
        </div>
    );
};

export { SideBarMenu };
