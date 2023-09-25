import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useState } from 'react';

interface DropDownProps {
    items: Array<
        | {
              id: number;
              name: string;
              icon?: React.ReactNode;
              action: () => void;
              testId?: string;
              diabled: boolean;
          }
        | boolean
    >;
    element?: React.ReactNode;
}

export const DropDown: React.FC<DropDownProps> = props => {
    const { items, element } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {element && (
                <div
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className="cursor-pointer"
                >
                    {element}
                </div>
            )}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {items?.map(({ id, action, name, icon, testId, diabled }: any) => (
                    <MenuItem
                        key={id}
                        data-testid={testId}
                        onClick={() => {
                            action();
                            handleClose();
                        }}
                        disabled={diabled}
                    >
                        {icon && <ListItemIcon>{icon}</ListItemIcon>}
                        <ListItemText>{name}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default DropDown;
