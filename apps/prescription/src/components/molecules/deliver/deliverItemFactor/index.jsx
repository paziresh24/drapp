import styles from './deliverItemFactor.module.scss';

import { addCommaPrice } from '@paziresh24/utils';
import Chips from '@paziresh24/shared/ui/chips';

const DeliverItemFactor = ({ name, count, total, orgAmount, insuredAmount }) => {
    return (
        <div className={styles['wrapper']}>
            <span className={styles['title']}>
                {name} <Chips theme="gray">{count} عدد</Chips>
            </span>
            <div className={styles['row']}>
                <span>مجموع: {addCommaPrice(total)} ریال</span>
                <span>سهم سازمان: {addCommaPrice(orgAmount)} ریال</span>
            </div>
            <div>
                <span>پرداختی بیمار: {addCommaPrice(insuredAmount)} ریال</span>
            </div>
        </div>
    );
};

export { DeliverItemFactor };
