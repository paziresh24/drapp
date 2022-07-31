import {
    ConsultIcon,
    CardIcon,
    MessageIcon,
    ComplaintsIcon,
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
            icon: <PrescriptionMenuIcon color="#000" />
        },
        {
            title: 'بیمه های من',
            path: '/providers',
            icon: <PrescriptionIcon color="#000" />
        },
        {
            title: 'پراستفاده ها',
            path: '/favorite/templates',
            icon: <StarIcon color="#000" />
        },
        {
            title: 'مشاوره',
            path: '/consult',
            icon: <ConsultIcon color="#000" />
        },
        {
            title: 'تسویه حساب',
            path: '/financial',
            icon: <CardIcon color="#000" />
        },
        {
            title: 'نظرات بیماران',
            path: '/feedbacks',
            icon: <MessageIcon color="#000" />,
            badge: getFeedbacks.isSuccess && calculateNoReplyComments()
        },
        {
            title: 'شکایات',
            path: '/complaints',
            icon: <ComplaintsIcon color="#000" />
        }
    ];
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
