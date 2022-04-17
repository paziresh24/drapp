import { useLayoutEffect, useState } from 'react';
import styles from './AddService.module.scss';

import { CirclePlusIcon } from '@paziresh24/shared/icon/public/duotone/';
import { useServices } from '@paziresh24/context/prescription/services-context';

import { utils } from '@hassanmojab/react-modern-calendar-datepicker';
import moment from 'jalali-moment';
import { useLearnTour } from '../../../../hooks/learn';
import isEmpty from 'lodash/isEmpty';

const AddService = ({ type }) => {
    const [services, setServices] = useServices();
    const [typeName, setTypeName] = useState();
    const { tourState, setSteps } = useLearnTour();

    useLayoutEffect(() => {
        if (type === 'drugs') return setTypeName('داروی');
        if (type === 'bulkDrugs') return setTypeName('دسته');
        if (type === 'lab') return setTypeName('آزمایش');
        if (type === 'others') return setTypeName('تصویربرداری، فیزیوتراپی، خدمات پزشکی');
    }, [type]);

    const addService = () => {
        if (type === 'lab') setSteps(20);
        if (type === 'others') setSteps(23);

        if (type === 'drugs') {
            return setServices(service => [
                ...service,
                {
                    id: service[service.length - 1].id + 1,
                    item_id: null,
                    use_instruction: null,
                    use_time: null,
                    count: 1,
                    description: null,
                    service_type: 79
                }
            ]);
        }

        if (type === 'bulkDrugs') {
            return setServices(service => [
                ...service,
                {
                    id: service[service.length - 1].id + 1,
                    bulk_id: !isEmpty(services.filter(service => service.service_type === 'bulk'))
                        ? services.filter(service => service.service_type === 'bulk')[
                              services.filter(service => service.service_type === 'bulk').length - 1
                          ].bulk_id + 1
                        : 1,
                    item_id: null,
                    use_instruction: null,
                    use_time: null,
                    count: 1,
                    description: null,
                    service_type: 'bulk'
                }
            ]);
        }
        if (type === 'lab') {
            return setServices(service => [
                ...service,
                {
                    id: service[service.length - 1].id + 1,
                    item_id: null,
                    use_instruction: null,
                    use_time: null,
                    count: 1,
                    date_do: moment
                        .from(
                            `${utils('fa').getToday().year}/${utils('fa').getToday().month}/${
                                utils('fa').getToday().day
                            }`,
                            'fa',
                            'YYYY/MM/DD'
                        )
                        .format('YYYY-MM-DD'),
                    description: null,
                    service_type: 80
                }
            ]);
        }
        if (type === 'others') {
            return setServices(service => [
                ...service,
                {
                    id: service[service.length - 1].id + 1,
                    item_id: null,
                    use_instruction: null,
                    use_time: null,
                    count: 1,
                    date_do: moment
                        .from(
                            `${utils('fa').getToday().year}/${utils('fa').getToday().month}/${
                                utils('fa').getToday().day
                            }`,
                            'fa',
                            'YYYY/MM/DD'
                        )
                        .format('YYYY-MM-DD'),
                    description: null,
                    service_type: 'others'
                }
            ]);
        }
    };

    return (
        <div
            className={styles.wrapper}
            onClick={addService}
            aria-hidden
            id={type === 'lab' ? 'add_lab_step' : 'add_other_step'}
        >
            <CirclePlusIcon />
            <span>افزودن {typeName} جدید</span>
        </div>
    );
};

export default AddService;
