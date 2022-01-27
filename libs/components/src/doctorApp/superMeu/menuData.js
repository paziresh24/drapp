import { TurningIcon, ConsultIcon, CardIcon, CommentIcon, ComplaintIcon, LearnIcon } from './icons';
import { useGetFeedbacks } from '@paziresh24/hooks/drapp/profile';
import { useDrApp } from '@paziresh24/context/drapp';

export const MenuData = () => {
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
        // {
        //     title: 'بیماران',
        //     path: '/',
        //     icon: <TurningIcon color="#fff" />
        // },
        {
            title: 'مشاوره',
            path: '/consult',
            icon: <ConsultIcon color="#fff" />
        },
        {
            title: 'تسویه حساب',
            path: '/financial',
            icon: <CardIcon />
        },
        // {
        //     title: 'آموزش',
        //     path: '/learn',
        //     icon: <LearnIcon color="#fff" />
        // },
        {
            title: 'نظرات بیماران',
            path: '/feedbacks',
            icon: <CommentIcon color="#fff" />,
            badge: getFeedbacks.isSuccess && calculateNoReplyComments()
        },
        // {
        //     title: 'شکایات',
        //     path: '/complaints',
        //     icon: <ComplaintIcon color="#fff" />
        // },
        // {
        //     title: 'بیمه های من',
        //     path: '/prescription/providers',
        //     icon: (
        //         <svg
        //             width="24"
        //             height="24"
        //             viewBox="0 0 24 24"
        //             fill="none"
        //             xmlns="http://www.w3.org/2000/svg"
        //         >
        //             <path
        //                 d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19ZM12.48 15.7C11.96 17.37 10.13 18.27 9.5 18.27C8.86 18.27 7.07 17.4 6.52 15.7C6.16 14.59 6.57 13.14 7.84 12.73C8.42 12.54 9.04 12.65 9.49 13C9.94 12.65 10.56 12.54 11.15 12.73C12.43 13.14 12.83 14.59 12.48 15.7Z"
        //                 fill="#fff"
        //             />
        //             <path
        //                 d="M17.4297 8.81048C18.3797 8.82048 19.6997 8.82048 20.8297 8.82048C21.3997 8.82048 21.6997 8.15048 21.2997 7.75048C19.8597 6.30048 17.2797 3.69048 15.7997 2.21048C15.3897 1.80048 14.6797 2.08048 14.6797 2.65048V6.14048C14.6797 7.60048 15.9197 8.81048 17.4297 8.81048Z"
        //                 fill="#fff"
        //             />
        //         </svg>
        //     )
        // },
        {
            title: 'نسخه های ثبت شده',
            path: '/prescription',
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.96 4.96 21.59 6.73 19.69L6.74 19.68C7.56 18.81 8.81 18.88 9.52 19.83L10.53 21.18C11.34 22.25 12.65 22.25 13.46 21.18L14.47 19.83C15.19 18.87 16.44 18.8 17.26 19.68C19.04 21.58 20.49 20.95 20.49 18.29V7.04C20.5 3.01 19.56 2 15.78 2ZM15 11.75H9C8.59 11.75 8.25 11.41 8.25 11C8.25 10.59 8.59 10.25 9 10.25H15C15.41 10.25 15.75 10.59 15.75 11C15.75 11.41 15.41 11.75 15 11.75ZM16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z"
                        fill="#fff"
                    />
                </svg>
            )
        },
        {
            title: 'پراستفاده ها',
            path: '/prescription',
            icon: (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.96 4.96 21.59 6.73 19.69L6.74 19.68C7.56 18.81 8.81 18.88 9.52 19.83L10.53 21.18C11.34 22.25 12.65 22.25 13.46 21.18L14.47 19.83C15.19 18.87 16.44 18.8 17.26 19.68C19.04 21.58 20.49 20.95 20.49 18.29V7.04C20.5 3.01 19.56 2 15.78 2ZM15 11.75H9C8.59 11.75 8.25 11.41 8.25 11C8.25 10.59 8.59 10.25 9 10.25H15C15.41 10.25 15.75 10.59 15.75 11C15.75 11.41 15.41 11.75 15 11.75ZM16 7.75H8C7.59 7.75 7.25 7.41 7.25 7C7.25 6.59 7.59 6.25 8 6.25H16C16.41 6.25 16.75 6.59 16.75 7C16.75 7.41 16.41 7.75 16 7.75Z"
                        fill="#fff"
                    />
                </svg>
            )
        }
    ];
};
