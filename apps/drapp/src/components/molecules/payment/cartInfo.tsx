import { bankIcon } from '@paziresh24/shared/ui/bankNumberField/bankIcon';
import { getBankNameFromCardNumber } from '@persian-tools/persian-tools';

interface CartInfoProps {
    info: any;
}

export const CartInfo = ({ info }: CartInfoProps) => {
    return (
        <div className="flex flex-col space-y-3 font-medium border border-dashed border-disabled p-4 rounded-lg">
            <span>صاحب کارت: {info?.deposit_owners?.join('-')}</span>
            <span>
                شماره کارت:{' '}
                {info?.card_number
                    .match(/.{1,4}/g)
                    .reverse()
                    .join(' ')}
            </span>
            <div>
                <span>نام بانک: </span>
                <span>
                    <i
                        className={`align-middle ibl32 ibl-${
                            bankIcon.find(bank =>
                                getBankNameFromCardNumber(info?.card_number as string)?.includes(
                                    bank.name
                                )
                            )?.icon
                        }`}
                    />
                    {info?.bank_name}{' '}
                </span>
            </div>
        </div>
    );
};

export default CartInfo;
