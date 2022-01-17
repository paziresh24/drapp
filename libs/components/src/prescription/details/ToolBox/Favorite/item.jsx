import styles from './Favorite.module.scss';

import { RemoveIcon } from '../../../../icons';
import { useDeleteFavoriteServices } from '@paziresh24/hooks/prescription';
import { useFavoriteItem } from '@paziresh24/context/prescription/favoriteItem.context';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import consumptionData from '@paziresh24/constants/drugData/consumption.json';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { sendEvent } from '@paziresh24/utils';

const Item = ({ service, setFavoriteListSelect, favoriteListSelect }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services, setServices] = useServices();
    const [favoriteItem, setFavoriteItem] = useFavoriteItem();
    const deleteFavoriteServices = useDeleteFavoriteServices();
    const [, setIsOpenToolBox] = useToolBox();
    const [type] = useSelectType();

    const deleteItemServiceAction = id => {
        setFavoriteItem(favoriteItem.filter(item => item.id !== id));

        deleteFavoriteServices.mutate({ id });
    };

    const addItemService = item => {
        if (services.some(service => service.service.id === item.service.id)) {
            return toast.warn('این آیتم قبلا اضافه شده است.');
        }

        const id = services[services.length - 1]?.id ?? 0;

        setServices(service => [
            ...service,
            {
                ...item,
                id: id + 1,
                service_type: item.service_type,
                item_id: item.service.id,
                favorite_item: item,
                date_do: null
            }
        ]);
        sendEvent('clickfavorite', 'prescription', 'clickfavorite');

        isMobile && setIsOpenToolBox(false);
    };

    const addItemTolist = e => {
        const id =
            favoriteListSelect.length > 0
                ? favoriteListSelect[favoriteListSelect.length - 1].id
                : services[services.length - 1]?.id ?? 0;
        if (e.target.checked) {
            sendEvent('clickfavorite', 'prescription', 'clickfavorite');

            if (!favoriteListSelect.some(item => item.service.id === service.service.id)) {
                setFavoriteListSelect(prev => [
                    ...prev,
                    {
                        ...service,
                        id: +id + 1,
                        service_type: service.service_type,
                        item_id: service.service.id,
                        date_do: null
                    }
                ]);
            } else {
                e.target.checked = false;
                return toast.warn('این آیتم قبلا انتخاب شده است.');
            }
        } else {
            setFavoriteListSelect(
                favoriteListSelect.filter(item => item.service.id !== service.service.id)
            );
        }
    };

    return (
        <>
            <div
                className={`${styles['item']} ${
                    services.some(item => item.service.id === service.service.id)
                        ? styles.disabled
                        : ''
                }`}
                onClick={() => !isMobile && addItemService(service)}
                aria-hidden
            >
                <div
                    className={styles['remove']}
                    onClick={e => {
                        e.stopPropagation();
                        deleteItemServiceAction(service.id);
                    }}
                    aria-hidden
                >
                    <RemoveIcon />
                </div>
                <div
                    className="flex w-full cursor-pointer"
                    style={{ display: 'flex', width: '100%', cursor: 'pointer' }}
                >
                    <label htmlFor={service.id} className="w-full" style={{ width: '100%' }}>
                        <span
                            className={styles.serviceName}
                            data-tip
                            data-for={`serviceFavoriteName-${service.id}`}
                        >
                            {service.service.name}
                        </span>
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

                <div className={styles.itemAmount}>
                    <div>{service.count}عدد</div>
                    {type === 'drugs' && (
                        <div>
                            {
                                consumptionData[prescriptionInfo.insuranceType].find(
                                    consumption => consumption.id === service.use_time
                                )?.name
                            }
                        </div>
                    )}
                </div>
            </div>
            <ReactTooltip
                id={`serviceFavoriteName-${service.id}`}
                place="top"
                type="dark"
                effect="solid"
            >
                {service.service.name}
            </ReactTooltip>
        </>
    );
};

export default Item;
