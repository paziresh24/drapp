import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Forum from '@mui/icons-material/Forum';
import Analytics from '@mui/icons-material/Analytics';
import FolderOpen from '@mui/icons-material/FolderOpen';
import BorderColor from '@mui/icons-material/BorderColor';
import Search from '@mui/icons-material/Search';
import { useDrApp } from '@paziresh24/context/drapp';
import { useEffect } from 'react';
import {
    CardIcon,
    PrescriptionIcon,
    InfoIcon,
    ExitIcon,
    ChatIcon,
    MessageIcon,
    PrescriptionMenuIcon,
    HouseIcon,
    UserIcon,
    SettingIcon,
    Statistics
} from '@paziresh24/shared/icon';
import { StarIcon } from '@paziresh24/shared/icon/public/duotone';

const navbarList = () => {
    const [{ center }] = useDrApp();

    const isConsultCenter = center.id === '5532';
    const isClinicCenter = center.id !== '5533' && center.type_id === 1;

    return [
        {
            icon: HomeOutlinedIcon,
            desc: 'لیست بیماران',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: true,
            to: '/'
        },
        {
            icon: PrescriptionMenuIcon,
            desc: 'نسخه های ثبت شده',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: true,
            to: '/prescription'
        },
        {
            icon: StarIcon,
            desc: 'پراستفاده ها',
            secondDesc: 'Message from andi',
            badge: 0,
            subList: [
                {
                    desc: 'نسخه پراستفاده',
                    badge: 0
                },
                {
                    desc: 'اقلام پر استفاده',
                    badge: 0
                }
            ],
            isShow: true
        },
        {
            icon: ChatIcon,
            desc: 'چت',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: isConsultCenter
        },
        {
            icon: InfoIcon,
            desc: 'قوانین مشاوره',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: isConsultCenter
        },
        {
            icon: PrescriptionIcon,
            desc: 'بیمه های من',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: true
        },
        {
            icon: SettingIcon,
            desc: 'تنظیمات نوبت دهی',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: true
        },
        {
            icon: MessageIcon,
            desc: 'نظرات بیماران',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: true
        },
        {
            icon: CardIcon,
            desc: 'تسویه حساب',
            secondDesc: '',
            badge: 0,
            subList: [],
            isShow: isClinicCenter
        }
    ];
};

export default navbarList;
