import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { CalendarIcon, ClockIcon } from '@paziresh24/shared/icon';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { sendEventForSetting } from './sendEventForSetting';

const Setting = () => {
    const router = useHistory();

    useEffect(() => {
        sendEventForSetting({
            action: 'load',
            type: 'page'
        });
    }, []);

    const listItems = [
        {
            primary: 'ساعت کاری',
            secondary: 'ساعت کاری خود را همیشه بروز نگه دارید.',
            icon: <CalendarIcon color="#000" />,
            onclick: () => {
                sendEventForSetting({
                    action: 'click',
                    type: 'workHoues'
                });
                router.push('/setting/duration');
            }
        },
        {
            primary: 'اعلام تاخیر',
            secondary: 'دیر به مطب می روید؟',
            icon: <ClockIcon color="#000" />,
            onclick: () => {
                sendEventForSetting({
                    action: 'click',
                    type: 'delay'
                });
                router.push('/setting/delay');
            }
        }
    ];

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md space-y-5"
        >
            <List className="space-y-3">
                {listItems.map((item, index) => (
                    <ListItemButton
                        key={index}
                        className="!bg-white !rounded-md !p-3 !items-stretch !shadow-sm"
                        onClick={item.onclick}
                    >
                        <ListItemAvatar className="bg-gray-500 bg-opacity-10 flex justify-center items-center rounded-md ml-3">
                            {item.icon}
                        </ListItemAvatar>
                        <ListItemText primary={item.primary} secondary={item.secondary} />
                    </ListItemButton>
                ))}
            </List>
        </Container>
    );
};

export default Setting;
