import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { CalendarIcon, ClockIcon } from '@paziresh24/shared/icon';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { sendEventForSetting } from './sendEventForSetting';
import moment from 'jalali-moment';
import { useDrApp } from '@paziresh24/context/drapp';
import { getCenterType } from 'apps/drapp/src/functions/getCenterType';
import { useFeatureValue } from '@growthbook/growthbook-react';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';

const Setting = () => {
    const [{ center, doctor }] = useDrApp();
    const router = useHistory();

    useEffect(() => {
        sendEventForSetting({
            action: 'load',
            type: 'page'
        });
    }, []);

    const listItems = [
        {
            primary: 'اعلام تاخیر',
            secondary: 'دیر به مطب می روید؟',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.53033 2.53033C5.82322 2.23744 5.82322 1.76256 5.53033 1.46967C5.23744 1.17678 4.76256 1.17678 4.46967 1.46967L1.46967 4.46967C1.17678 4.76256 1.17678 5.23744 1.46967 5.53033C1.76256 5.82322 2.23744 5.82322 2.53033 5.53033L5.53033 2.53033ZM3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12ZM12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM18.4697 1.46967C18.1768 1.76256 18.1768 2.23744 18.4697 2.53033L21.4697 5.53033C21.7626 5.82322 22.2374 5.82322 22.5303 5.53033C22.8232 5.23744 22.8232 4.76256 22.5303 4.46967L19.5303 1.46967C19.2374 1.17678 18.7626 1.17678 18.4697 1.46967ZM10 8.25C9.58579 8.25 9.25 8.58579 9.25 9C9.25 9.41421 9.58579 9.75 10 9.75H12.5986L9.37596 14.584C9.22253 14.8141 9.20823 15.11 9.33874 15.3539C9.46926 15.5978 9.7234 15.75 10 15.75H14C14.4142 15.75 14.75 15.4142 14.75 15C14.75 14.5858 14.4142 14.25 14 14.25H11.4014L14.624 9.41603C14.7775 9.18588 14.7918 8.88997 14.6613 8.64611C14.5307 8.40224 14.2766 8.25 14 8.25H10Z"
                        fill="#000"
                    />
                </svg>
            ),
            onclick: () => {
                sendEventForSetting({
                    action: 'click',
                    type: 'delay'
                });
                router.push('/setting/delay');
            },
            shouldShow: ['office'].includes(getCenterType(center))
        },
        {
            primary: 'ساعت کاری',
            secondary: 'ساعت کاری خود را همیشه بروز نگه دارید',
            icon: (
                <div className="relative flex items-center justify-center">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.00005 0.25C8.41427 0.25 8.75005 0.585786 8.75005 1V2.25H13L13.0565 2.25C13.8586 2.24999 14.588 2.24999 15.2501 2.26272V1C15.2501 0.585786 15.5858 0.25 16.0001 0.25C16.4143 0.25 16.7501 0.585786 16.7501 1V2.32709C17.01 2.34691 17.2561 2.37182 17.4891 2.40313C18.6615 2.56076 19.6104 2.89288 20.3588 3.64124C21.1072 4.38961 21.4393 5.33856 21.5969 6.51098C21.7501 7.65018 21.7501 9.1058 21.75 10.9435V10.9436V11V13V13.0564V13.0565C21.7501 14.8942 21.7501 16.3498 21.5969 17.489C21.4393 18.6614 21.1072 19.6104 20.3588 20.3588C19.6104 21.1071 18.6615 21.4392 17.4891 21.5969C16.3499 21.75 14.8943 21.75 13.0566 21.75H13.0565H13H11H10.9436H10.9435C9.10582 21.75 7.65022 21.75 6.51103 21.5969C5.3386 21.4392 4.38966 21.1071 3.64129 20.3588C2.89293 19.6104 2.56081 18.6614 2.40318 17.489C2.25002 16.3498 2.25003 14.8942 2.25005 13.0565L2.25005 13.0565L2.25005 13.0564L2.25005 13V8.64706L2.25002 8.48999C2.24969 7.10812 2.24947 6.22688 2.49629 5.49049C2.96966 4.07812 4.07817 2.96962 5.49054 2.49624C5.97879 2.33259 6.53073 2.27754 7.25005 2.25912V1C7.25005 0.585786 7.58584 0.25 8.00005 0.25ZM15.2501 3.76309V4C15.2501 4.41421 15.5858 4.75 16.0001 4.75C16.4143 4.75 16.7501 4.41421 16.7501 4V3.83168C16.9394 3.8477 17.1188 3.86685 17.2892 3.88976C18.2953 4.02502 18.8749 4.27869 19.2981 4.7019C19.7214 5.12511 19.975 5.70476 20.1103 6.71085C20.2485 7.73851 20.25 9.09318 20.25 11V13C20.25 14.9068 20.2485 16.2615 20.1103 17.2892C19.975 18.2952 19.7214 18.8749 19.2981 19.2981C18.8749 19.7213 18.2953 19.975 17.2892 20.1102C16.2615 20.2484 14.9069 20.25 13 20.25H11C9.09323 20.25 7.73856 20.2484 6.7109 20.1102C5.70481 19.975 5.12516 19.7213 4.70195 19.2981C4.27874 18.8749 4.02507 18.2952 3.88981 17.2892C3.75164 16.2615 3.75005 14.9068 3.75005 13V8.64706C3.75005 7.05384 3.75985 6.44061 3.91853 5.96718C4.24242 5.00082 5.00087 4.24237 5.96723 3.91848C6.26733 3.81789 6.6236 3.77713 7.25005 3.76077V4C7.25005 4.41421 7.58584 4.75 8.00005 4.75C8.41427 4.75 8.75005 4.41421 8.75005 4V3.75H13C13.8541 3.75 14.5973 3.75032 15.2501 3.76309Z"
                            fill="#22282F"
                        />
                    </svg>
                    <span className="absolute text-sm font-semibold">
                        {moment().locale('fa').date()}
                    </span>
                </div>
            ),
            onclick: () => {
                sendEventForSetting({
                    action: 'click',
                    type: 'workHoues'
                });
                router.push('/setting/workhours');
            },
            shouldShow: ['office', 'consult'].includes(getCenterType(center))
        },
        {
            primary: 'اعلام مرخصی',
            secondary: `اعلام روز تعطیل ${
                getCenterType(center) === 'office' ? 'مطب' : 'مشاوره آنلاین'
            }`,
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9.03023 21.69L11.3602 19.73C11.7102 19.43 12.2902 19.43 12.6402 19.73L14.9702 21.69C15.5102 21.96 16.1702 21.69 16.3702 21.11L16.8102 19.78C16.9202 19.46 16.8102 18.99 16.5702 18.75L14.3002 16.47C14.1302 16.31 14.0002 15.99 14.0002 15.76V12.91C14.0002 12.49 14.3102 12.29 14.7002 12.45L19.6102 14.57C20.3802 14.9 21.0102 14.49 21.0102 13.65V12.36C21.0102 11.69 20.5102 10.92 19.8902 10.66L14.3002 8.25001C14.1402 8.18001 14.0002 7.97001 14.0002 7.79001V4.79001C14.0002 3.85001 13.3102 2.74001 12.4702 2.31001C12.1702 2.16001 11.8202 2.16001 11.5202 2.31001C10.6802 2.74001 9.99023 3.86001 9.99023 4.80001V7.80001C9.99023 7.98001 9.85023 8.19001 9.69023 8.26001L4.11023 10.67C3.49023 10.92 2.99023 11.69 2.99023 12.36V13.65C2.99023 14.49 3.62023 14.9 4.39023 14.57L9.30023 12.45C9.68023 12.28 10.0002 12.49 10.0002 12.91V15.76C10.0002 15.99 9.87023 16.31 9.71023 16.47L7.44023 18.75C7.20023 18.99 7.09023 19.45 7.20023 19.78L7.64023 21.11C7.82023 21.69 8.48023 21.97 9.03023 21.69Z"
                        stroke="#000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            onclick: () => {
                sendEventForSetting({
                    action: 'click',
                    type: 'vacation'
                });
                router.push('/setting/vacation');
            },
            shouldShow: ['office', 'consult'].includes(getCenterType(center))
        }
    ];

    return (
        <Container
            maxWidth="sm"
            className="h-full pt-4 space-y-5 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-md"
        >
            <List className="space-y-3">
                {listItems.map(
                    (item, index) =>
                        item.shouldShow && (
                            <ListItemButton
                                key={index}
                                className="!bg-white !rounded-md !p-3 !items-stretch !shadow-sm"
                                onClick={item.onclick}
                            >
                                <ListItemAvatar className="flex items-center justify-center ml-3 bg-gray-500 rounded-md bg-opacity-10">
                                    {item.icon}
                                </ListItemAvatar>
                                <ListItemText primary={item.primary} secondary={item.secondary} />
                            </ListItemButton>
                        )
                )}
            </List>
        </Container>
    );
};

export default Setting;
