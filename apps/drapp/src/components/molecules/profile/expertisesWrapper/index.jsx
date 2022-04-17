import { useDrApp } from '@paziresh24/context/drapp';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    useCreateExpertise,
    useGetExpertises,
    useUpdateExpertise
} from '@paziresh24/hooks/drapp/profile';
import Button from '@paziresh24/shared/ui/button';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { PlusLineIcon } from '@paziresh24/shared/icon';
import { Expertises } from '../expertises';
import styles from './expertisesWrapper.module.scss';
import isEmpty from 'lodash/isEmpty';

export const ExpertisesWrapper = props => {
    const [info] = useDrApp();
    const [expertises, setExpertises] = useState([]);
    const getExpertises = useGetExpertises({ center_id: info.center.id });
    const createExpertise = useCreateExpertise();
    const updateExpertise = useUpdateExpertise();
    const expertisesPromises = [];

    useEffect(() => {
        getExpertises.refetch();
    }, [info.center]);

    useEffect(() => {
        if (getExpertises.isSuccess) {
            if (isEmpty(getExpertises.data.data)) {
                return setExpertises([
                    {
                        alias_title: '',
                        degree: { id: 0, name: '' },
                        expertise: { id: 0, name: '' },
                        id: ''
                    }
                ]);
            }
            setExpertises(getExpertises.data.data);
        }
    }, [getExpertises.status]);

    const saveExpertises = () => {
        expertises.forEach(expertise => {
            if (!expertise.id) {
                return expertisesPromises.push(
                    createExpertise.mutateAsync(
                        {
                            expertise_id: expertise.expertise.id,
                            degree_id: expertise.degree.id,
                            alias_title: expertise.alias_title
                        },
                        {
                            onError: err => {
                                toast.error(err.response.data.message);
                            }
                        }
                    )
                );
            }
            return expertisesPromises.push(
                updateExpertise.mutateAsync(
                    {
                        id: expertise.id,
                        expertise_id: expertise.expertise.id,
                        degree_id: expertise.degree.id,
                        alias_title: expertise.alias_title
                    },
                    {
                        onError: err => {
                            toast.error(err.response.data.message);
                        }
                    }
                )
            );
        });

        Promise.allSettled(expertisesPromises).then(() => {
            getExpertises.remove();
            setTimeout(() => getExpertises.refetch());
            props.setExpertiseAccordion(false);
            return toast.success('تخصص با موفقیت ذخیره شد.');
        });
    };

    return (
        <>
            {expertises.length > 0 &&
                expertises.map(
                    (expertise, index) =>
                        !isEmpty(expertise.degree) && (
                            <Expertises
                                key={expertise.id}
                                id={expertise.id}
                                degree={expertise?.degree?.id}
                                expertise={expertise?.expertise?.id}
                                aliasTitle={expertise.alias_title}
                                setExpertise={setExpertises}
                                expertises={expertises}
                                index={index}
                            />
                        )
                )}

            {getExpertises.isLoading && <Overlay />}
            <div className={styles['expertises_row']}>
                <Button
                    block
                    onClick={saveExpertises}
                    loading={createExpertise.isLoading || updateExpertise.isLoading}
                >
                    ذخیره کردن تغییرات
                </Button>
                <Button
                    onClick={() =>
                        setExpertises(prev => [
                            ...prev,
                            {
                                alias_title: '',
                                degree: { id: 0, name: '' },
                                expertise: { id: 0, name: '' },
                                id: ''
                            }
                        ])
                    }
                    variant="secondary"
                    square
                    buttonIcon={<PlusLineIcon />}
                />
            </div>
        </>
    );
};
