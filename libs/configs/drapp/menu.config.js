import {
    ConsultIcon,
    CardIcon,
    MessageIcon,
    LearnIcon,
    ComplaintsIcon,
    PrescriptionMenuIcon,
    SettingIcon
} from '@paziresh24/shared/icon';

import { StarIcon } from '@paziresh24/shared/icon/public/duotone';
import { useGetFeedbacks } from '@paziresh24/hooks/drapp/profile';
import { useDrApp } from '@paziresh24/context/drapp';
import { useSupport } from '@paziresh24/context/core/supportChat';
import { useSettingTurns } from 'apps/drapp/src/components/molecules/turning/statusBar/settingTurns.context.js';

export const MainMenuData = () => {
    const [info] = useDrApp();
    const getFeedbacks = useGetFeedbacks({ center_id: info.center.id });
    const [, setIsOpen] = useSettingTurns();

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
            icon: <PrescriptionMenuIcon color="#3F3F79" />
        },
        {
            title: 'پراستفاده ها',
            path: '/favorite/templates',
            icon: <StarIcon color="#3F3F79" />
        },
        {
            title: 'مشاوره',
            path: '/consult',
            icon: <ConsultIcon color="#3F3F79" />
        },
        {
            title: 'تسویه حساب',
            path: '/financial',
            icon: <CardIcon color="#3F3F79" />
        },
        {
            title: 'تنظیمات نوبت دهی',
            onClick: () => setIsOpen(true),
            icon: <SettingIcon color="#3F3F79" />
        },
        {
            title: 'آموزش',
            path: '/learn',
            icon: <LearnIcon color="#3F3F79" />
        },
        {
            title: 'نظرات بیماران',
            path: '/feedbacks',
            icon: <MessageIcon color="#3F3F79" />,
            badge: getFeedbacks.isSuccess && calculateNoReplyComments()
        },
        {
            title: 'شکایات',
            path: '/complaints',
            icon: <ComplaintsIcon color="#3F3F79" />
        }
    ];
};

export const SubMenuData = () => {
    const [supportModal, setSupportModal] = useSupport();

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
