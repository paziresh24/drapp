import { ChevronIcon } from '@paziresh24/shared/icon';
import Chips from '@paziresh24/shared/ui/chips';
import { addCommas } from '@persian-tools/persian-tools';
import { useState } from 'react';

interface TransactionProps {
    rowNumber: number;
    amount: string;
    status: number;
    statusText: string;
    date: string;
    description?: string;
}

export const Transaction = (props: TransactionProps) => {
    const { amount, date, rowNumber, status, statusText, description } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="py-3 flex flex-col w-full" onClick={() => setIsOpen(prev => !prev)}>
            <div className="flex justify-between">
                <div className="flex items-center space-s-3">
                    <span className="text-sm opacity-70">{rowNumber}</span>
                    <div className="font-medium text-sm">{addCommas(+amount / 10)} تومان</div>
                    {status !== 0 && (
                        <Chips theme="error" className="!p-0 !px-2">
                            ناموفق
                        </Chips>
                    )}
                </div>
                <div className="flex space-s-4 items-center">
                    <div className="text-sm">{date}</div>
                    <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />
                </div>
            </div>

            {isOpen && (
                <div className="text-sm flex flex-col space-y-2 pt-3">
                    <span>وضعیت: {statusText}</span>
                    <span>توضیحات: {description ?? '-'}</span>
                </div>
            )}
        </div>
    );
};

export default Transaction;
