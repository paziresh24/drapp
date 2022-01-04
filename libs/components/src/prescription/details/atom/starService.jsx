import { StarIcon } from '@paziresh24/components/icons/public/duotone';
import { useFavoriteItem } from '@paziresh24/context/prescription/favoriteItem.context';
import { useAddFavoriteServices, useDeleteFavoriteServices } from '@paziresh24/hooks/prescription';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const StarService = ({ service }) => {
    const [prescriptionInfo] = useSelectPrescription();

    const [favoriteItem, setFavoriteItem] = useFavoriteItem();
    const addFavoriteServices = useAddFavoriteServices();
    const deleteFavoriteServices = useDeleteFavoriteServices();
    const [stared, setStared] = useState(false);

    useEffect(() => {
        if (!service.service) setStared(false);
    }, [service.service]);

    const starHandler = () => {
        if (!stared) {
            if (!service.service?.id) {
                return toast.warn('لطفا یک آیتم انتخاب کنید.');
            }
            if (!service.count) {
                return toast.warn('لطفا تعداد را وارد نمایید.');
            }

            setStared(true);
            return addFavoriteServices.mutate(
                {
                    use_instruction: service.use_instruction,
                    use_time: service.use_time,
                    how_to_use: service.how_to_use,
                    service: service.service.id,
                    count: service.count,
                    description: service.description,
                    ...(service.number_of_period && { number_of_period: service.number_of_period }),
                    provider: prescriptionInfo.insuranceType,
                    type: undefined
                },
                {
                    onSuccess: data => {
                        setFavoriteItem(prev => [...prev, data]);
                    }
                }
            );
        }
        if (stared && addFavoriteServices?.data?.id) {
            setStared(false);
            return deleteFavoriteServices.mutate(
                {
                    id: addFavoriteServices.data.id
                },
                {
                    onSuccess: data => {
                        const services = favoriteItem.filter(item => item.id !== data.id);
                        setFavoriteItem(services);
                    }
                }
            );
        }
    };

    return (
        <div className="cursor-pointer" onClick={starHandler} aria-hidden id="star_step">
            <StarIcon color="#27bda0" fill={stared ? '#27bda0' : ''} />
        </div>
    );
};

export default StarService;
