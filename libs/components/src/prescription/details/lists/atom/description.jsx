import styles from '../lists.module.scss';
import { useState, useEffect } from 'react';
import { useServices } from '@paziresh24/context/prescription/services-context';
import TextArea from '@paziresh24/components/core/textArea';
import { CirclePlusIcon } from './../../../../icons/public/duotone';

const Description = ({ description, serviceId, field }) => {
    const [services, setServices] = useServices();
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if (description) return setShowDescription(true);
        setShowDescription(false);
    }, [description]);

    const editDescriptionByValue = value => {
        services[services.findIndex(item => item.id === serviceId)][field] = value;
        setServices(services);
    };

    return (
        <>
            {showDescription && (
                <TextArea
                    onChange={value => editDescriptionByValue(value)}
                    default-value={description}
                />
            )}

            {!showDescription && (
                <div
                    className={styles.addPrescriptionButton}
                    onClick={() => setShowDescription(true)}
                    aria-hidden
                >
                    <CirclePlusIcon />
                    <span>افزودن توضیحات</span>
                </div>
            )}
        </>
    );
};

export default Description;
