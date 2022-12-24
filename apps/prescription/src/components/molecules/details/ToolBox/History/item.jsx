import styles from './History.module.scss';

import { useServices } from '@paziresh24/context/prescription/services-context';
import { isMobile } from 'react-device-detect';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { toast } from 'react-toastify';
import { sendEvent } from '@paziresh24/shared/utils/sendEvent';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const Item = ({ service, setItemsSelect, itemsSelect, prescription }) => {
    const [services, setServices] = useServices();
    const [, setIsOpenToolBox] = useToolBox();
    const [type, setType] = useSelectType();
    const [prescriptionInfo] = useSelectPrescription();

    const addItemService = () => {
        if (prescription.insuranceType !== prescriptionInfo.insuranceType) {
            toast.error('امکان افزودن اقلام نیست، زیرا این نسخه با بیمه دیگری ثبت شده است.');
            return;
        }
        setType(
            Object.entries(serviceTypeList).filter(item =>
                item[1][prescriptionInfo.insuranceType].includes(service?.service_type?.id)
            )?.[0]?.[0] ?? 'drugs'
        );
        if (services.some(item => item.service.id === service.service.id)) {
            return toast.warn('این آیتم قبلا اضافه شده است.');
        }
        const id = services[services.length - 1]?.id ?? 0;
        sendEvent('clickhistory', 'prescription', 'clickhistory');
        getSplunkInstance().sendEvent({
            group: 'prescription-tool-box',
            type: 'add-service-with-history'
        });

        setServices(item => [
            ...item,
            {
                ...service,
                item_id: service.service.id,
                id: id + 1,
                service_type: service.service_type.id,
                date_do: null
            }
        ]);
        isMobile && setIsOpenToolBox(false);
    };

    const addItemTolist = e => {
        if (prescription.insuranceType === prescriptionInfo.insuranceType) {
            toast.error('امکان افزودن اقلام نیست، زیرا این نسخه با بیمه دیگری ثبت شده است.');
            return;
        }
        const id =
            itemsSelect.length > 0
                ? itemsSelect[itemsSelect.length - 1].id
                : services[services.length - 1]?.id ?? 0;
        if (e.target.checked) {
            if (!itemsSelect.some(item => item.service.id === service.service.id)) {
                sendEvent('clickhistory', 'prescription', 'clickhistory');
                getSplunkInstance().sendEvent({
                    group: 'prescription-tool-box',
                    type: 'add-service-with-history'
                });

                setItemsSelect(prev => [
                    ...prev,
                    {
                        ...service,
                        id: +id + 1,
                        service_type: service.service_type.id,
                        item_id: service.service.id,
                        date_do: null
                    }
                ]);
            } else {
                e.target.checked = false;
                return toast.warn('این آیتم قبلا انتخاب شده است.');
            }
        } else {
            setItemsSelect(itemsSelect.filter(item => item.service.id !== service.service.id));
        }
    };

    return (
        <div
            className={`${styles.service} ${
                services.some(item => item.service.id === service.service.id) ? styles.disabled : ''
            }`}
            onClick={() => !isMobile && addItemService()}
            aria-hidden
        >
            <label htmlFor={service.id} className="w-full" style={{ width: '100%' }}>
                {service.service.name}
            </label>
            {!services.some(item => item.service.id === service.service.id) && isMobile && (
                <input
                    className={styles.checkbox}
                    type="checkbox"
                    onChange={addItemTolist}
                    id={service.id}
                />
            )}
        </div>
    );
};

export default Item;
