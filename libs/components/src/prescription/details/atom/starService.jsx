import { StarIcon } from '@paziresh24/components/icons/public/duotone';
import { useFavoriteItem } from '@paziresh24/context/prescription/favoriteItem.context';
import { useAddFavoriteServices, useDeleteFavoriteServices } from '@paziresh24/hooks/prescription';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useServices } from '@paziresh24/context/prescription/services-context';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';

const StarService = ({ service, insuranceType }) => {
    const [services, setServices] = useServices();
    const [favoriteItem, setFavoriteItem] = useFavoriteItem();
    const addFavoriteServices = useAddFavoriteServices();
    const deleteFavoriteServices = useDeleteFavoriteServices();
    const [stared, setStared] = useState(false);

    useEffect(() => {
        if (
            serviceTypeList['drugs'][insuranceType].includes(+service.service_type) &&
            favoriteItem.some(
                item =>
                    item.service.id === service.service.id &&
                    +item.count === +service.count &&
                    +item.use_time === +service.use_time &&
                    +item.use_instruction === +service.use_instruction &&
                    +item.how_to_use === +service.how_to_use
            )
        ) {
            services[services.findIndex(item => item.id === service.id)].favorite_item =
                favoriteItem.find(
                    item =>
                        item.service.id === service.service.id &&
                        +item.count === +service.count &&
                        item.use_time === service.use_time &&
                        item.use_instruction === service.use_instruction &&
                        item.how_to_use === service.how_to_use
                );
            setServices(services);
            setStared(true);
        } else if (
            !serviceTypeList['drugs'][insuranceType].includes(+service.service_type) &&
            favoriteItem.some(
                item => item.service.id === service.service.id && +item.count === +service.count
            )
        ) {
            services[services.findIndex(item => item.id === service.id)].favorite_item =
                favoriteItem.find(
                    item => item.service.id === service.service.id && +item.count === +service.count
                );
            setServices(services);
            setStared(true);
        } else {
            return setStared(false);
        }
    }, [service, favoriteItem]);

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
                    provider: insuranceType,
                    type: undefined
                },
                {
                    onSuccess: data => {
                        const newServices = services.map(item =>
                            item.id === service.id ? { ...item, favorite_item: data } : item
                        );
                        setServices(newServices);
                        setFavoriteItem(prev => [...prev, data]);
                    }
                }
            );
        }
        if (stared && (addFavoriteServices?.data?.id || service?.favorite_item)) {
            setStared(false);
            return deleteFavoriteServices.mutate(
                {
                    id: addFavoriteServices?.data?.id ?? service?.favorite_item?.id
                },
                {
                    onSuccess: data => {
                        const newServices = services.map(item =>
                            item.id === service.id ? { ...item, favorite_item: undefined } : item
                        );
                        setServices(newServices);
                        const FavoriteServices = favoriteItem.filter(item => item.id !== data.id);
                        setFavoriteItem(FavoriteServices);
                    }
                }
            );
        }
    };

    return (
        <div style={{ cursor: 'pointer' }} onClick={starHandler} aria-hidden id="star_step">
            <StarIcon color="#27bda0" fill={stared ? '#27bda0' : ''} />
        </div>
    );
};

export default StarService;
