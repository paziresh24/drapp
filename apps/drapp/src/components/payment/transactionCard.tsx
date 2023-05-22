import { ChevronIcon } from '@paziresh24/shared/icon';
import Chips from '@paziresh24/shared/ui/chips';
import { convertTimeStampToPersianDate } from '@paziresh24/shared/utils/convertTimeStampToPersianDate';
import { addCommas } from '@persian-tools/persian-tools';
import { ReactNode, useState } from 'react';

type Detailes = Record<string, string>;

interface TransactionProps {
    rowNumber: number;
    amount: ReactNode | string;
    balance?: ReactNode | string;
    date?: string;
    detailes: Detailes;
}

export const TransactionCard = (props: TransactionProps) => {
    const { amount, balance, date, rowNumber, detailes } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col w-full py-3" onClick={() => setIsOpen(prev => !prev)}>
            <div className="flex justify-between">
                <div className="flex items-center space-s-3">
                    <span className="text-sm opacity-70">{rowNumber}</span>
                    <div className="flex text-sm font-medium space-s-2">{amount}</div>
                </div>
                <div className="flex items-center space-s-4">
                    <div className="text-sm">{date}</div>
                    {!balance && <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />}
                </div>
                {balance && (
                    <div className="flex items-center space-s-4">
                        <div className="flex text-sm font-medium space-s-2">{balance}</div>
                        <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="flex flex-col pt-3 space-y-2 text-sm">
                    {Object.entries(detailes).map(([lable, value]) => (
                        <span>
                            {lable ? `${lable}: ` : ''}
                            {value}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionCard;
