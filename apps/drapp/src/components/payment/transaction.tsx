import { Fragment, useEffect, useState } from 'react';
import TransactionCard from './transactionCard';
import { addCommas } from '@persian-tools/persian-tools';
import { convertTimeStampToPersianDate } from '@paziresh24/shared/utils';
import { useGetTransactions } from '../../apis/payment/getTransactions';
import { useDrApp } from '@paziresh24/context/drapp';
import classNames from 'classnames';
import Button from '@mui/lab/LoadingButton';

export const Transaction = () => {
    const [info] = useDrApp();
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const getTransaction = useGetTransactions({
        user_center_id: info.center.user_center_id,
        page
    });
    const [transactionData, setTransactionData] = useState<any>([]);

    useEffect(() => {
        if (getTransaction.data) {
            setTransactionData((prev: any) => [
                ...prev,
                ...(getTransaction.data as unknown as any[])
            ]);
            setIsLoading(false);
        }
    }, [getTransaction.data]);

    return (
        <div className="flex flex-col h-full md:pb-0">
            <div className="z-50 flex pb-3 text-xs font-medium bg-white px-9">
                <span className="w-full opacity-50">مبلغ</span>
                <span className="w-full text-center opacity-50">تاریخ</span>
                <span className="w-full text-left opacity-50">موجودی (تومان)</span>
            </div>
            {getTransaction.isLoading && (
                <div className="rounded-lg h-96 bg-slate-300 animate-pulse" />
            )}
            {getTransaction.isSuccess && (
                <div className="flex flex-col w-full h-full overflow-auto">
                    <div className="px-4 mb-4 h-[80%] overflow-auto rounded-lg bg-slate-100">
                        {transactionData.map?.((transaction: any, index: number, array: any[]) => (
                            <Fragment key={index}>
                                <TransactionCard
                                    amount={
                                        <>
                                            <div
                                                className={classNames(
                                                    'text-sm font-medium text-red-500',
                                                    {
                                                        'text-green-600': transaction.amount > 0
                                                    }
                                                )}
                                            >
                                                {addCommas(Math.abs(+transaction.amount ?? 0) / 10)}
                                                {transaction.amount > 0 ? '+' : '-'}
                                            </div>
                                        </>
                                    }
                                    date={convertTimeStampToPersianDate(transaction.insert_at)}
                                    balance={
                                        <>
                                            <div
                                                className={classNames(
                                                    'text-sm font-medium text-red-500',
                                                    {
                                                        'text-green-600': transaction.balance >= 0
                                                    }
                                                )}
                                            >
                                                {addCommas(
                                                    Math.abs(+transaction.balance ?? 0) / 10
                                                )}
                                                {transaction.balance >= 0 ? '' : '-'}
                                            </div>
                                        </>
                                    }
                                    rowNumber={index + 1}
                                    detailes={{
                                        '': transaction.description,
                                        'تاریخ نوبت': convertTimeStampToPersianDate(
                                            transaction.insert_at
                                        )
                                    }}
                                />
                                {array.length !== index + 1 && <hr className="border-slate-300" />}
                            </Fragment>
                        ))}
                    </div>
                    {(getTransaction.data as unknown as any[]).length > 0 && (
                        <Button
                            variant="outlined"
                            loading={isLoading}
                            onClick={() => {
                                setPage(prev => prev + 1);
                                setIsLoading(true);
                            }}
                        >
                            نمایش بیشتر
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Transaction;
