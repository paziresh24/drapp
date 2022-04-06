/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/feedbacks.module.scss';
import { FeedbackCards } from '@paziresh24/components/doctorApp/profile/feedbackCards';
import { useDrApp } from '@paziresh24/context/drapp';
import { useGetFeedbacks } from '@paziresh24/hooks/drapp/profile';
import { EmptyState } from '@paziresh24/components/core/emptyState';
import { Overlay } from '@paziresh24/components/core/overlay';

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

    return (
        <div className={styles['wrapper']}>
            {!getFeedbacks.isLoading && (
                <>
                    <h3 className="text-lg font-bold">نظرات بیماران</h3>
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
                            <a href="#howToIncreaseComments" className={styles['goto']}>
                                چطور نظرات بیشتری دریافت کنم؟
                            </a>
                        </div>
                    )}
                    <div className={styles['inner']}>
                        {getFeedbacks.data && (
                            <FeedbackCards feedbacks={getFeedbacks.data.result} />
                        )}
                        {!getFeedbacks.data && <EmptyState full text="نظری وجود ندارد" />}
                    </div>
                    <div className={styles['get-more-feedback']}>
                        <h3>چرا نظرات و رتبه بیماران مهم است؟</h3>
                        <p>
                            دریافت نظرات با کیفیت و واقعی، علاوه بر افزایش اعتبار صفحه اختصاصی شما
                            در پذیرش24، به بیماران در جهت انتخاب آگاهانه تر، کمک خواهد کرد. علاوه بر
                            آن، این نظرات در رتبه بندی شما در نتایج توصیه پذیرش24 به بیماران نیز
                            موثر است. با روش های زیر میتوانید نظرات بیشتر و با کیفیت تری برای صفحه
                            خود دریافت کنید.
                        </p>
                        <h3 id="howToIncreaseComments">چطور نظرات بیشتری دریافت کنم؟</h3>
                        <p>
                            دریافت نظرات با کیفیت و واقعی، علاوه بر افزایش اعتبار صفحه اختصاصی شما
                            در پذیرش24، به بیماران در جهت انتخاب آگاهانه تر، کمک خواهد کرد. علاوه بر
                            آن، این نظرات در رتبه بندی شما در نتایج توصیه پذیرش24 به بیماران نیز
                            موثر است. با روش های زیر میتوانید نظرات بیشتر و با کیفیت تری برای صفحه
                            خود دریافت کنید.
                        </p>
                        <ul>
                            <li>
                                ثبت نوبت های مراجعین خارج از پذیرش24
                                <span>
                                    اگر بیمار، از طریق روش هایی بجز وبسایت یا اپلیکیشن پذیرش24 به
                                    شما مراجعه کرد، نوبت وی را در پذیرش24 ثبت کنید. پذیرش24 به این
                                    بیماران نیز برای شرکت در نظرسنجی ویزیت ، پیامک ارسال میکند.
                                </span>
                            </li>
                            <li>
                                دعوت بیمار به شرکت در نظرسنجی بعد از ویزیت
                                <span>
                                    پس از پایان ویزیت بیمارتان، از مراجعه کننده بخواهید تا با ثبت
                                    تجربه درمان خود، به انتخاب دیگر بیماران کمک کند. همچنین میتوانید
                                    با نصب یک اعلان در محیط مرکز، بیماران را به ثبت نظر در صفحه
                                    اختصاصی پزشک دعوت کنید.
                                </span>
                            </li>
                            <li>
                                اشتراک گذاری پروفایل
                                <span>
                                    آدرس صفحه اختصاصی پذیرش24 خود را در شبکه های اجتماعی ثبت کنید و
                                    کسانی که توسط شما درمان شده اند را ترغیب به ثبت نظر کنید.
                                </span>
                            </li>
                            <li>
                                پاسخ به نظرات بیماران
                                <span>
                                    زمانی که در بخش نظرات به بیماران خود پاسخ می دهید، پیامک اطلاع
                                    رسانی برایشان ارسال شده و کاربر ترغیب می شود تا نظر جدیدی ثبت
                                    کند .
                                </span>
                            </li>
                        </ul>
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
