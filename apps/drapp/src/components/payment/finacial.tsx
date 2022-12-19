import { useDrApp } from '@paziresh24/context/drapp';
import { addCommas } from '@persian-tools/persian-tools';
import { Fragment } from 'react';
import { useGetBalance } from '../../apis/payment/getBalance';
import { useGetCheckouts } from '../../apis/payment/getCheckouts';
import { useGetIncomes } from '../../apis/payment/getIncomes';
import Transaction from './transaction';

const Financial = () => {
    const [{ center }] = useDrApp();
    const getBalance = useGetBalance({ centerId: center.id });
    const getIncomes = useGetIncomes({ centerId: center.id });
    const getCheckouts = useGetCheckouts({ centerId: center.id });

    if (
        getBalance.isLoading ||
        getIncomes.isLoading ||
        getCheckouts.isLoading ||
        getBalance.isError ||
        getIncomes.isError ||
        getCheckouts.isError
    )
        return (
            <div className="flex flex-col space-y-4">
                <div className="h-32 rounded-xl bg-slate-300 animate-pulse" />
                <div className="h-5 w-36 rounded-full bg-slate-300 animate-pulse" />
                <div className="h-96 rounded-lg bg-slate-300 animate-pulse" />
            </div>
        );

    return (
        <div className="flex flex-col space-y-4">
            <div className="p-3 bg-slate-100 text-slate-500 font-medium text-xs rounded-lg">
                مبالغ به صورت اتوماتیک؛ روزانه به شماره کارت درج شده واریز میگردد.
            </div>
            <div className="p-5 space-s-4 bg-gradient-to-br from-[#4f4f8f] to-[#1A1D4E] h-32 flex justify-evenly items-stretch rounded-xl shadow-lg">
                <div className="space-y-2 h-full flex flex-col justify-center items-center">
                    <span className="text-sm text-white opacity-80">کل درآمد</span>
                    <span className="text-lg font-bold text-white">
                        {addCommas(getIncomes.data?.data?.incomes?.sum / 10 ?? '')}
                    </span>
                    <span className="text-xs text-white">تومان</span>
                </div>
                <div className="bg-white w-[0.15rem] rounded-full opacity-20 h-30" />
                <div className="space-y-2 h-full flex flex-col justify-center items-center">
                    <span className="text-sm text-white opacity-80">پرداخت شده</span>
                    <span className="text-lg font-bold text-white">
                        {addCommas(getCheckouts.data?.data?.checkouts?.sum / 10 ?? '')}
                    </span>
                    <span className="text-xs text-white">تومان</span>
                </div>
                <div className="bg-white w-[0.15rem] rounded-full opacity-20 h-30" />
                <div className="space-y-2 h-full flex flex-col justify-center items-center">
                    <span className="text-sm text-white opacity-80">موجودی</span>
                    <span className="text-lg font-bold text-white">
                        {addCommas(getBalance.data?.data?.balance / 10 ?? '')}
                    </span>
                    <span className="text-xs text-white">تومان</span>
                </div>
            </div>
            <span className="text-sm font-bold">گزارش مالی</span>
            <div className="rounded-lg bg-slate-200 px-4">
                {getCheckouts.data?.data?.checkouts?.transactions?.map(
                    (transaction: any, index: number, array: any[]) => (
                        <Fragment key={index}>
                            <Transaction
                                amount={transaction.amount}
                                date={transaction.jalali_date_time}
                                rowNumber={index + 1}
                                status={transaction.status}
                                statusText={transaction.pretty_status}
                                description={transaction.description}
                            />
                            {array.length !== index + 1 && <hr className="border-slate-300" />}
                        </Fragment>
                    )
                )}
            </div>
        </div>
    );
};

export default Financial;
