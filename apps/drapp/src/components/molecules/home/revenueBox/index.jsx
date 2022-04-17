import styles from './revenueBox.module.scss';
import { Revenue } from '../revenue';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { addCommaPrice } from '@paziresh24/utils';
import isEmpty from 'lodash/isEmpty';

const RevenueBox = ({ revenue, consultTurn }) => {
    return (
        <div className={styles['revenue-box']}>
            {revenue.isLoading && <Overlay />}
            {revenue.isSuccess && (
                <>
                    <Revenue
                        title="کل درآمد"
                        priceType="تومان"
                        priceNumber={
                            revenue.data.doctor_share
                                ? addCommaPrice(revenue.data.doctor_share / 10)
                                : 0
                        }
                    />
                    {isEmpty(consultTurn) ? (
                        <Revenue
                            title="برداشت نشده"
                            priceType="تومان"
                            priceNumber={
                                revenue.data.doctor_share
                                    ? addCommaPrice(
                                          (revenue.data.doctor_share - revenue.data.sum_paid) / 10
                                      )
                                    : 0
                            }
                            incom
                        />
                    ) : (
                        <Revenue
                            title="پیش بینی درآمد"
                            priceType="تومان (شهریور)"
                            priceNumber={addCommaPrice(
                                consultTurn.amount + revenue.data.doctor_share / 10
                            )}
                            incom
                        />
                    )}
                </>
            )}
        </div>
    );
};

export { RevenueBox };
