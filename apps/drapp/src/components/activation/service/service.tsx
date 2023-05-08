import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import clsx from 'classnames';
import { ConsultIcon, OfficeIcon, PrescriptionIcon } from './icons';

interface Props {
    title: string;
    description: string;
    type: ServicesType;
    selected: boolean;
    status?: 'active' | 'disable';
    onSelect: (type: ServicesType) => void;
}

const icons = {
    office: <OfficeIcon />,
    consult: <ConsultIcon />,
    prescription: <PrescriptionIcon />
};

export const Service = (props: Props) => {
    const { title, description, type, onSelect, selected, status = 'active' } = props;
    const cardStatusstyles = {
        active: '!bg-white !rounded-md !p-3 !items-stretch !shadow-sm !border !border-solid',
        disable:
            '!bg-gray-200 !rounded-md !p-3 !items-stretch !border-transparent pointer-events-none'
    };

    return (
        <ListItemButton
            className={clsx(cardStatusstyles[status], {
                '!border-primary': selected,
                '!border-transparent': !selected
            })}
            onClick={() => onSelect(type)}
        >
            <ListItemAvatar className="bg-gray-500 bg-opacity-10 flex justify-center items-center rounded-md ml-3">
                {icons[type]}
            </ListItemAvatar>
            <ListItemText
                primary={title}
                secondary={description}
                className={clsx({
                    '[&>p]:!text-gray-500 [&>span]:!text-gray-500': status === 'disable'
                })}
            />
        </ListItemButton>
    );
};

export default Service;
