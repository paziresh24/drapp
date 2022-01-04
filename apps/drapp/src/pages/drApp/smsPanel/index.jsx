/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from 'assets/styles/pages/drApp/smsPanel.module.scss';
import Button from '@paziresh24/components/core/button';
import Chevron from '@paziresh24/components/icons/public/chevron';
import classNames from 'classnames';
import { useState } from 'react';

const SmsPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    const moreItem = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['info-box']}>
                <div className={styles['head']}>
                    <span className={styles['title']}>
                        اعتبار پنل پیامکی
                        <span>(تومان)</span>
                    </span>
                    <span className={styles['value']}>12000</span>
                </div>
                <Button block variant="primary">
                    افزایش موجودی
                </Button>
            </div>
            <div className={styles['section-title']}>تاریخچه تراکنش ها</div>
            <div className={styles['atable']}>
                <div className={styles['head']}>
                    <span>ردیف</span>
                    <span>تاریخ</span>
                    <span>
                        مبلغ
                        <span>(تومان)</span>
                    </span>
                </div>
                <div className={styles['item-wrapper']} onClick={moreItem} aria-hidden>
                    <div className={classNames(styles['item'], { [styles['open']]: isOpen })}>
                        <span>1</span>
                        <span>1398/12/12</span>
                        <span>50,000</span>
                        <Chevron dir={isOpen ? 'top' : 'bottom'} />
                    </div>
                    <div
                        className={classNames(styles['item-content'], { [styles['open']]: isOpen })}
                    >
                        شماره رسید: 12151424
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmsPanel;
