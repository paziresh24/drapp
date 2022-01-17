import styles from './History.module.scss';

import { useServices } from '@paziresh24/context/prescription/services-context';
import { isMobile } from 'react-device-detect';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { toast } from 'react-toastify';
import { sendEvent } from '@paziresh24/utils';

const Item = ({ service, setItemsSelect, itemsSelect }) => {
    const [services, setServices] = useServices();
    const [, setIsOpenToolBox] = useToolBox();

    const addItemService = () => {
        if (services.some(item => item.service.id === service.service.id)) {
            return toast.warn('این آیتم قبلا اضافه شده است.');
        }
        const id = services[services.length - 1]?.id ?? 0;
        sendEvent('clickhistory', 'prescription', 'clickhistory');

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
        const id =
            itemsSelect.length > 0
                ? itemsSelect[itemsSelect.length - 1].id
                : services[services.length - 1]?.id ?? 0;
        if (e.target.checked) {
            if (!itemsSelect.some(item => item.service.id === service.service.id)) {
                sendEvent('clickhistory', 'prescription', 'clickhistory');

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
