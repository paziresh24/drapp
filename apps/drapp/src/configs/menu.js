import {
    ConsultIcon,
    CardIcon,
    MessageIcon,
    PrescriptionMenuIcon,
    PrescriptionIcon,
    Statistics,
    UserIcon,
    InfoIcon
} from '@paziresh24/shared/icon';

import { StarIcon } from '@paziresh24/shared/icon/public/duotone';
import { useGetFeedbacks } from '@paziresh24/hooks/drapp/profile';
import { useDrApp } from '@paziresh24/context/drapp';
import { useHistory } from 'react-router-dom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

export const MainMenuData = () => {
    const [info] = useDrApp();
    const router = useHistory();
    const getFeedbacks = useGetFeedbacks({ center_id: info.center.id });

    const calculateNoReplyComments = () => {
        if (!getFeedbacks.data.result) return 0;
        const noReplyComment = getFeedbacks.data.result?.filter(feedback => {
            return !feedback.replies.length;
        });
        return noReplyComment.length;
    };
    const list = [
        {
            title: 'ویرایش پروفایل',
            path: '/profile',
            icon: <UserIcon color="#000" width={24} height={24} />,
            shouldShow: true
        },
        {
            title: 'رتبه من در پذیرش24',
            onClick: () =>
                window.location.assign(
                    `https://www.paziresh24.com/dashboard/apps/sanje/my-performance/`
                ),
            icon: <Statistics color="#000" />,
            badge: 'جدید',
            shouldShow: true
        },
        {
            title: info.center.id === '5532' ? 'تنظیمات پرداخت' : 'تنظیمات بیعانه',
            path: '/setting/payment',
            icon: <CardIcon color="#000" />,
            shouldShow: true
        },
        {
            title: 'نظرات بیماران',
            onClick: () =>
                window.location.assign(`https://www.paziresh24.com/dr/${info.doctor.slug}#reviews`),
            icon: <MessageIcon color="#000" />,
            badge: getFeedbacks.isSuccess && calculateNoReplyComments(),
            shouldShow: true
        },
        {
            title: 'قوانین مشاوره',
            path: '/consult-term',
            icon: <InfoIcon color="#000" />,
            shouldShow: info.center.id === '5532'
        },
        {
            title: 'نسخه های ثبت شده',
            path: '/prescription',
            icon: <PrescriptionMenuIcon color="#000" />,
            shouldShow: true
        },
        {
            title: 'بیمه های من',
            path: '/providers',
            icon: <PrescriptionIcon color="#000" />,
            shouldShow: true
        },
        {
            title: 'پراستفاده ها',
            path: '/favorite/templates',
            icon: <StarIcon color="#000" />,
            shouldShow: true
        }
    ];

    return list.filter(item => item.shouldShow);
};

export const SubMenuData = () => {
    return [
        {
            title: 'پشتیبانی',
            onClick: () => {
                window.open(
                    'https://support.paziresh24.com/?utm_source=drpanel&utm_medium=p24&utm_campaign=telblock'
                );
            }
        },
        {
            title: 'خروج',
            path: '/logout'
        }
    ];
};
