import { bankIcon } from '@paziresh24/shared/ui/bankNumberField/bankIcon';
import { getBankNameFromCardNumber } from '@persian-tools/persian-tools';

interface CartInfoProps {
    info: any;
}

export const CartInfo = ({ info }: CartInfoProps) => {
    return (
        <div className="flex flex-col p-4 space-y-3 font-medium border border-dashed rounded-lg border-disabled">
            <span>صاحب کارت: {info?.deposit_owners?.join('-')}</span>
            {info?.amount_payable && <span>مبلغ قابل پرداخت : {info?.amount_payable}</span>}
            {info?.card_number && (
                <span>
                    شماره کارت:{' '}
                    {info?.card_number
                        .match(/.{1,4}/g)
                        .reverse()
                        .join(' ')}
                </span>
            )}
            {info?.shaba && <span>شماره شبا: {info?.shaba}</span>}
            {info?.account_number && <span>شماره حساب: {info?.account_number}</span>}
            <div>
                <span>نام بانک: </span>
                <span>
                    {info?.card_number && (
                        <i
                            className={`align-middle ibl32 ibl-${
                                bankIcon.find(bank =>
                                    getBankNameFromCardNumber(
                                        info?.card_number as string
                                    )?.includes(bank.name)
                                )?.icon
                            }`}
                        />
                    )}
                    {info?.bank_name}{' '}
                </span>
            </div>
            {info?.account_status && <span>وضعیت حساب: {info?.account_status}</span>}
        </div>
    );
};

export default CartInfo;
