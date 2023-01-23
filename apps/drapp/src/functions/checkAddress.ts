import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { toast } from 'react-toastify';

export const checkAddress = (address: string) => {
    const checker = ['بیمارستان', 'درمانگاه', 'مرکز'];
    if (!checker.some(check => address.includes(check))) return;
    checker.forEach(check => {
        if (!address.includes(check)) return;
        toast.warning(
            `چنانچه نوبت دهی فوق برای ${check} می باشد، حتما با مسئول پذیرش ${check} بابت حضور بیماران هماهنگ کنید.`
        );
    });
    getSplunkInstance().sendEvent({
        group: 'doctor_information',
        type: `address_warning`,
        event: {
            new_address: address
        }
    });
};
