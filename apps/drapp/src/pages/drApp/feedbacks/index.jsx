/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/feedbacks.module.scss';
import { FeedbackCards } from '@components/profile/feedbackCards';
import { useDrApp } from '@paziresh24/context/drapp';
import { useGetFeedbacks } from '@paziresh24/hooks/drapp/profile';
import { EmptyState } from '@paziresh24/shared/ui/emptyState';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { useEffect } from 'react';
import Button from '@paziresh24/shared/ui/button';
import { sendEventForFeedbacks } from '../../../functions/sendEventForFeedbacks';

const Feedbacks = () => {
    const [info] = useDrApp();
    const getFeedbacks = useGetFeedbacks({ center_id: info.center.id });

    const calculateNoReplyComments = () => {
        if (!getFeedbacks.data.result) return 0;
        const noReplyComment = getFeedbacks.data.result?.filter(feedback => {
            return !feedback.replies.length;
        });
        return noReplyComment.length;
    };

    useEffect(() => {
        sendEventForFeedbacks({
            action: 'load'
        });
    }, []);

    return (
        <div className={styles['wrapper']}>
            {!getFeedbacks.isLoading && (
                <>
                    {getFeedbacks.data && (
                        <div className={styles['head-wrap']}>
                            <div className={styles['badge-wrap']}>
                                <div className={styles['badge']}>
                                    تعداد نظرات
                                    <span className={styles['red']}>
                                        {getFeedbacks.data.result.length ?? 0}
                                    </span>
                                </div>
                                <div className={styles['badge']}>
                                    تعداد نظر بی پاسخ
                                    <span className={styles['red']}>
                                        {calculateNoReplyComments()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex w-full lg:w-fit justify-between bg-white items-center rounded-md p-2 space-s-5">
                                <span className="text-sm font-medium">
                                    در مورد سیستم رضایت سنجی سوالی دارید؟
                                </span>
                                <Button
                                    size="small"
                                    onClick={() =>
                                        window.open(
                                            'https://support.paziresh24.com/?utm_source=drpanel&utm_medium=p24&utm_campaign=telblock'
                                        )
                                    }
                                >
                                    ارتباط با پشتیبانی
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className={styles['inner']}>
                        {getFeedbacks.data && (
                            <FeedbackCards feedbacks={getFeedbacks.data.result} />
                        )}
                        {!getFeedbacks.data && <EmptyState full text="نظری وجود ندارد" />}
                    </div>
                    <div className={styles['get-more-feedback']}>
                        <p className={styles['description']}>
                            توجه داشته باشید که تجربیات واقعی و حقیقی بیماران، پس از بازبینی
                            اتوماتیک و دستی، تایید و منتشر خواهد شد و تلاش برای ثبت نظر غیر واقعی که
                            موجب گمراه شدن کاربران شود، ناقض قوانین پذیرش24 می باشد.
                        </p>
                    </div>
                </>
            )}
            {getFeedbacks.isLoading && <Overlay />}
        </div>
    );
};

export default Feedbacks;
