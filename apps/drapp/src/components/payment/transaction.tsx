import { ChevronIcon } from '@paziresh24/shared/icon';
import Chips from '@paziresh24/shared/ui/chips';
import { convertTimeStampToPersianDate } from '@paziresh24/shared/utils/convertTimeStampToPersianDate';
import { addCommas } from '@persian-tools/persian-tools';
import { useState } from 'react';

type Detailes = {
    shaba: string;
    trackerId: string;
    settlementDate: string;
};

interface TransactionProps {
    rowNumber: number;
    amount: string;
    status:
        | 'system_reject'
        | 'request'
        | 'reject'
        | 'in_progress'
        | 'paid'
        | 'doctor_confirmation'
        | 'doctor_confirmation_reject'
        | 'failed_request'
        | 'unknown';
    date: string;
    detailes: Detailes;
}

export const Transaction = (props: TransactionProps) => {
    const { amount, date, rowNumber, status, detailes } = props;
    const [isOpen, setIsOpen] = useState(false);
    const paymentStatus = {
        request: 'در انتظار پرداخت',
        reject: 'درخواست رد شده',
        in_progress: 'در صف پرداخت',
        paid: 'پرداخت شده',
        doctor_confirmation:
            'زمانی که درخواست اول رو میزنی ی رکورد با این استاتوس داریم (در انتظار تایید درخواست توسط پزشک)',
        doctor_confirmation_reject: 'رد شده توسط پزشک',
        failed_request: 'درخواست با خطا مواجه شده است',
        unknown: 'نا مشخص',
        system_reject: 'رد شده توسط سیستم'
    };

    const getTagStatusColor = () => {
        switch (status) {
            case 'paid':
                return 'sucsess';
            case 'request':
            case 'in_progress':
                return 'gray';
            default:
                return 'error';
        }
    };

    return (
        <div className="py-3 flex flex-col w-full" onClick={() => setIsOpen(prev => !prev)}>
            <div className="flex justify-between">
                <div className="flex items-center space-s-3">
                    <span className="text-sm opacity-70">{rowNumber}</span>
                    <div className="font-medium text-sm">{addCommas(+amount / 10)} هزار تومان</div>
                    <Chips theme={getTagStatusColor()} className="!p-0 !px-2">
                        {paymentStatus[status]}
                    </Chips>
                </div>
                <div className="flex space-s-4 items-center">
                    <div className="text-sm">{date}</div>
                    <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />
                </div>
            </div>

            {isOpen && (
                <div className="text-sm flex flex-col space-y-2 pt-3">
                    <span>وضعیت: {paymentStatus[status]}</span>
                    <div className="flex flex-col gap-2">
                        <span>توضیحات:</span>
                        <span>شماره شبا (کارت): {detailes.shaba}</span>
                        <span>کد پیگیری: {detailes.trackerId}</span>
                        <span>
                            تسویه شده تا تاریخ:{' '}
                            {convertTimeStampToPersianDate(+detailes.settlementDate)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transaction;
