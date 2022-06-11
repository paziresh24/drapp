import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import Button from '@paziresh24/shared/ui/button';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { useEffect, useState } from 'react';
import { Expertises } from '@components/molecules/profile/expertises';
import { useCreateExpertise, useUpdateExpertise } from '@paziresh24/hooks/drapp/profile';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import Container from '@mui/material/Container';

const ExpertisesPage = () => {
    const [info] = useDrApp();
    const [expertises, setExpertises] = useState([]);
    const createExpertise = useCreateExpertise();
    const updateExpertise = useUpdateExpertise();
    const [loading, setLoading] = useState(false);
    const promises = [];

    useEffect(() => {
        if (isEmpty(info.doctor.expertises)) {
            return setExpertises([
                {
                    alias_title: '',
                    degree: { id: 0, name: '' },
                    expertise: { id: 0, name: '' },
                    id: ''
                }
            ]);
        }
        setExpertises(info.doctor.expertises);
    }, []);

    const history = useHistory();

    const updateCenter = () => {
        setLoading(true);
        expertises.forEach(expertise => {
            if (!expertise.id) {
                return promises.push(
                    createExpertise.mutateAsync(
                        {
                            expertise_id: expertise?.expertise?.id,
                            degree_id: expertise?.degree?.id,
                            alias_title: expertise?.alias_title
                        },
                        {
                            onSuccess: () => {
                                getSplunkInstance().sendEvent({
                                    group: 'create_expertise_active_booking',
                                    type: 'successful'
                                });
                            },
                            onError: error => {
                                getSplunkInstance().sendEvent({
                                    group: 'create_expertise_active_booking',
                                    type: 'unsuccessful',
                                    event: {
                                        error: error.response?.data
                                    }
                                });
                                toast.error(error.response.data.message);
                            }
                        }
                    )
                );
            }
            return promises.push(
                updateExpertise.mutateAsync(
                    {
                        id: expertise.id,
                        expertise_id: expertise?.expertise?.id,
                        degree_id: expertise?.degree?.id,
                        alias_title: expertise?.alias_title
                    },
                    {
                        onSuccess: () => {
                            getSplunkInstance().sendEvent({
                                group: 'update_expertise_active_booking',
                                type: 'successful'
                            });
                        },
                        onError: error => {
                            getSplunkInstance().sendEvent({
                                group: 'update_expertise_active_booking',
                                type: 'unsuccessful',
                                event: {
                                    error: error.response?.data
                                }
                            });
                            toast.error(error.response.data.message);
                        }
                    }
                )
            );
        });

        if (expertises.some(expertise => expertise.alias_title)) {
            getSplunkInstance().sendEvent({
                group: 'update_expertise_active_booking',
                type: 'fill-in-expertise-title'
            });
        }

        Promise.allSettled(promises)
            .then(() => {
                setLoading(false);
                history.push('/setting/duration?action=enable-booking');
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md"
        >
            <div className={styles['register-form']}>
                <div className={styles['form-control']}>
                    {expertises.length > 0 &&
                        expertises.map(
                            (expertiseObject, index) =>
                                !isEmpty(expertiseObject.degree) && (
                                    <Expertises
                                        key={expertiseObject.id}
                                        id={expertiseObject.id}
                                        degree={expertiseObject?.degree?.id}
                                        expertise={expertiseObject?.expertise?.id}
                                        aliasTitle={expertiseObject.alias_title}
                                        setExpertise={setExpertises}
                                        expertises={expertises}
                                        index={index}
                                        isLastItem={expertises.length - 1 == index}
                                    />
                                )
                        )}
                </div>

                <FixedWrapBottom>
                    <Button onClick={updateCenter} loading={loading} block>
                        انتخاب ساعت کاری مطب
                    </Button>
                </FixedWrapBottom>
            </div>
        </Container>
    );
};

export { ExpertisesPage };
