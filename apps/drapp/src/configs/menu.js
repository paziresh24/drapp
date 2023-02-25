import {
    ConsultIcon,
    CardIcon,
    MessageIcon,
    PrescriptionMenuIcon,
    PrescriptionIcon
} from '@paziresh24/shared/icon';

import { StarIcon } from '@paziresh24/shared/icon/public/duotone';
import { useGetFeedbacks } from '@paziresh24/hooks/drapp/profile';
import { useDrApp } from '@paziresh24/context/drapp';
import { useSupport } from '@paziresh24/context/core/supportChat';

export const MainMenuData = () => {
    const [info] = useDrApp();
    const getFeedbacks = useGetFeedbacks({ center_id: info.center.id });

    const calculateNoReplyComments = () => {
        if (!getFeedbacks.data.result) return 0;
        const noReplyComment = getFeedbacks.data.result?.filter(feedback => {
            return !feedback.replies.length;
        });
        return noReplyComment.length;
    };
    return [
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
        },
        {
            title: 'پرداخت',
            path: '/setting/payment',
            icon: <CardIcon color="#000" />,
            shouldShow: true
        },
        {
            title: 'تسویه حساب',
            path: '/financial',
            icon: <CardIcon color="#000" />,
            shouldShow: true
        },
        {
            title: 'نظرات بیماران',
            path: '/feedbacks',
            icon: <MessageIcon color="#000" />,
            badge: getFeedbacks.isSuccess && calculateNoReplyComments(),
            shouldShow: true
        }
    ].filter(item => item.shouldShow);
};

export const SubMenuData = () => {
    const [, setSupportModal] = useSupport();

    return [
        {
            title: 'پشتیبانی',
            onClick: () => setSupportModal(true)
        },
        {
            title: 'خروج',
            path: '/logout'
        }
    ];
};
