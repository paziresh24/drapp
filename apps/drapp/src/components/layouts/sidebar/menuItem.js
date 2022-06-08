import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';
import { useMenu } from '@paziresh24/context/core/menu';
import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';

export const MeunuItem = ({ menuProps, id }) => {
    const [open] = useMenu();
    const [anchorEl, setAnchorEl] = useState(null);
    const openSubMenu = Boolean(anchorEl);

    const handleOpenSubMenu = useCallback(
        event => {
            setAnchorEl(event.currentTarget);
        },
        [anchorEl, setAnchorEl]
    );
    const handleCloseSubMenu = useCallback(() => {
        setAnchorEl(false);
    }, [anchorEl]);

    return (
        <>
            <Tooltip
                title={!open ? menuProps.desc : ''}
                placement={'left'}
                componentsProps={{
                    tooltip: {
                        sx: {
                            backgroundColor: 'gray',
                            color: 'white',
                            marginLeft: '22px !important',
                            boxShadow: '0px 0px 22px -2px rgba(0,0,0,0.20)'
                        }
                    }
                }}
            >
                <ListItemButton
                    sx={{
                        margin: '6px 16px',
                        // padding: '5px',
                        borderRadius: '8px'
                    }}
                    onClick={menuProps.subList.length > 0 && handleOpenSubMenu}
                    component={menuProps.to ? Link : 'div'}
                    to={menuProps.to}
                    id={`menu-${id}-button`}
                    aria-controls={openSubMenu ? `menu-${id}-item` : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSubMenu ? 'true' : undefined}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <Badge badgeContent={menuProps.badge} color="primary" variant="dot">
                            <menuProps.icon sx={{ fontSize: '25px' }} />
                        </Badge>
                    </ListItemIcon>

                    <ListItemText
                        primary={menuProps.desc}
                        primaryTypographyProps={{
                            variant: 'body2'
                        }}
                        sx={{
                            display: 'inline',
                            margin: '0px',
                            overflowX: 'hidden',
                            color: 'lightgray',
                            whiteSpace: 'nowrap',
                            minWidth: '126px'
                        }}
                    />
                    {menuProps.badge !== 0 ? (
                        <Chip
                            label={menuProps.badge}
                            color={'primary'}
                            size="small"
                            sx={{ height: 'auto', color: '#fff' }}
                        />
                    ) : (
                        <></>
                    )}
                    {/* <Button
                    id="basic-button"
                    aria-controls={openSubMenu ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openSubMenu ? 'true' : undefined}
                    onClick={handleOpenSubMenu}
                >
                    Dashboard
                </Button> */}

                    {/* <Menu
                    id={`menu-${id}-item`}
                    anchorEl={anchorEl}
                    open={openSubMenu}
                    onClose={handleCloseSubMenu}
                    MenuListProps={{
                        'aria-labelledby': `menu-${id}-button`
                    }}
                >
                    <MenuItem onClick={handleCloseSubMenu}>Profile</MenuItem>
                    <MenuItem onClick={handleCloseSubMenu}>My account</MenuItem>
                    <MenuItem onClick={handleCloseSubMenu}>Logout</MenuItem>
                </Menu> */}
                </ListItemButton>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openSubMenu}
                onClose={handleCloseSubMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        'overflow': 'visible',
                        'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        // 'mt': 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            bottom: 15,
                            left: -5,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0
                        }
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                {menuProps.subList.map((subMenu, index) => (
                    <MenuItem
                        onClick={handleCloseSubMenu}
                        sx={{
                            padding: 1.5
                        }}
                    >
                        {subMenu.icon && (
                            <ListItemIcon sx={{ minWidth: '46px' }}>
                                <Badge badgeContent={subMenu.badge} color="primary" variant="dot">
                                    <subMenu.icon color="#000" sx={{ fontSize: '20px' }} />
                                </Badge>
                            </ListItemIcon>
                        )}

                        <ListItemText
                            primary={subMenu.desc}
                            primaryTypographyProps={{
                                variant: 'body2'
                            }}
                            sx={{
                                display: 'inline',
                                margin: '0px',
                                overflowX: 'hidden',
                                color: 'lightgray',
                                whiteSpace: 'nowrap',
                                minWidth: '126px'
                            }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
