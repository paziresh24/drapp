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
    onSelect: (type: ServicesType) => void;
}

const icons = {
    office: <OfficeIcon />,
    consult: <ConsultIcon />,
    prescription: <PrescriptionIcon />
};

export const Service = (props: Props) => {
    const { title, description, type, onSelect, selected } = props;

    return (
        <ListItemButton
            className={clsx(
                '!bg-white !rounded-md !p-3 !items-stretch !shadow-sm !border !border-solid',
                {
                    '!border-primary': selected,
                    '!border-transparent': !selected
                }
            )}
            onClick={() => onSelect(type)}
        >
            <ListItemAvatar className="bg-gray-500 bg-opacity-10 flex justify-center items-center rounded-md ml-3">
                {icons[type]}
            </ListItemAvatar>
            <ListItemText primary={title} secondary={description} />
        </ListItemButton>
    );
};

export default Service;
