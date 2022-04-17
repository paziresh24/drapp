import styles from './ItemAction.module.scss';
import { StarIcon } from '@paziresh24/shared/icon/public/duotone';
import { TrashIcon } from '@paziresh24/shared/icon';
import {
    useAddFavoriteServices,
    useDeleteFavoriteServices,
    useDeleteItemService
} from '@paziresh24/hooks/prescription';
import { useServices } from '@paziresh24/context/prescription/services-context';

import { toast } from 'react-toastify';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { sendEvent } from '@paziresh24/shared/utils/sendEvent';
import { useLearnTour } from '@paziresh24/hooks/learn';

const ItemAction = ({ id }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services, setServices] = useServices();
    const addFavoriteServices = useAddFavoriteServices();
    const deleteFavoriteServices = useDeleteFavoriteServices();
    const deleteItem = useDeleteItemService();
    const service = services[services.findIndex(service => service.id === id)];
    const { tourState, setSteps } = useLearnTour();

    const starHandler = () => {
        sendEvent('clickstar', 'prescription', 'clickstar');

        if (!service.item_id) {
            return toast.warn('لطفا یک آیتم انتخاب کنید.');
        }
        if (!service.count) {
            return toast.warn('لطفا تعداد را وارد نمایید.');
        }
        deleteFavoriteServices.reset();
        if (!addFavoriteServices.isSuccess) {
            setSteps(8);

            return addFavoriteServices.mutate({
                ...service,
                provider: prescriptionInfo.insuranceType,
                service: service.item_id,
                type: undefined
            });
        }
        addFavoriteServices.reset();
        deleteFavoriteServices.mutate({
            id: addFavoriteServices.data.id
        });
    };

    const removeService = () => {
        if (prescriptionInfo.finalized) {
            deleteItem.mutate(
                {
                    prescriptionId: prescriptionInfo.id,
                    itemId: +id
                },
                {
                    onSuccess: () => {
                        setServices(services.filter(service => service.id !== id));
                    },
                    onError: () => {
                        setServices(services.filter(service => service.id !== id));
                    }
                }
            );
        } else {
            setServices(services.filter(service => service.id !== id));
        }
    };

    return (
        <div className={styles.actions}>
            <div className={styles.action} onClick={starHandler} aria-hidden id="star_step">
                {!addFavoriteServices.isSuccess && <StarIcon color="#3F3F79" />}
                {addFavoriteServices.isSuccess && <StarIcon color="#e38e0e" fill="#e38e0e" />}
            </div>
            {services.length !== 1 && (
                <div className={styles.action} onClick={removeService} aria-hidden>
                    <TrashIcon color="#3F3F79" />
                </div>
            )}
        </div>
    );
};

export default ItemAction;
