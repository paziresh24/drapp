/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/complaints.module.scss';
import { useDrApp } from '@paziresh24/context/drapp';
import { useComplaintsSummary, useComplaintsDetail } from '@paziresh24/hooks/drapp/profile';
import { EmptyState } from '@paziresh24/components/core/emptyState';
import { Overlay } from '@paziresh24/components/core/overlay';
import ScrollContainer from 'react-indiana-drag-scroll';

const Complaints = () => {
    const reasons = {
        closed_office: 'بسته بودن مطب',
        doctor_absence: 'عدم حضور پزشک در مطب',
        left_crowded_office: 'ترک مطب به علت شلوغ بودن آن',
        left_long_delay: 'ترک مطب به علت معطلی زیاد',
        personal_reasons: 'دلایل شخصی',
        secretary_behavior: 'رفتار بد منشی',
        total_non_personal: 'منصرف شدن به دلایل شخصی',
        other: 'سایر'
    };
    const [info] = useDrApp();
    const { isLoading, data } = useComplaintsSummary();
    const complaintsDetail = useComplaintsDetail();

    const detail = () => {
        return complaintsDetail.data.result.filter(detail => detail.description);
    };

    return (
        <div className={styles['wrapper']}>
            <p>
                لطفا با جابجایی به موقع نوبت ها و ثبت مرخصی با استفاده از قابلیت اطلاع رسانی
                اتوماتیک جابجایی یا لغو نوبت به مراجعین پذیرش24، از بروز نارضایتی و شکایت در ایشان
                جلوگیری کرده و بازخوردهای مثبتی دریافت کنید.
            </p>
            {!isLoading && !complaintsDetail.isLoading && (
                <>
                    <h3>شکایات بیماران</h3>
                    {data[0] && (
                        <ScrollContainer>
                            <div className={styles['badge-wrap']}>
                                {Object.entries(data[0]).map(
                                    ([key, value]) =>
                                        reasons[key] && (
                                            <div key={key} className={styles['badge']}>
                                                {reasons[key]}
                                                <span className={styles['red']}>{value}</span>
                                            </div>
                                        )
                                )}
                            </div>
                        </ScrollContainer>
                    )}
                    <div className={styles['inner']}>
                        {detail().map(d => (
                            <div className={styles['complaint-card']} key={d.id}>
                                <p className={styles['description']}>{d.description}</p>
                                {Object.entries(d).map(
                                    ([key, value]) =>
                                        value === 1 && (
                                            <span key={key}>
                                                علت شکایت:
                                                <span>{reasons[key]}</span>
                                            </span>
                                        )
                                )}
                                <span className={styles['date-time-wrap']}>
                                    <span>زمان نوبت:</span>
                                    <span className={styles['date']}>
                                        {new Date(d.book_info.book_time * 1000).toLocaleDateString(
                                            'fa-IR'
                                        )}
                                    </span>
                                    <span className={styles['time']}>
                                        {new Date(d.book_info.book_time * 1000).toLocaleTimeString(
                                            'fa-IR'
                                        )}
                                    </span>
                                </span>
                            </div>
                        ))}
                        {!detail().length && <EmptyState full text="شکایتی وجود ندارد" />}
                    </div>
                </>
            )}
            {isLoading && complaintsDetail.isLoading && <Overlay />}
        </div>
    );
};

export default Complaints;
