import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import Button from '@paziresh24/components/core/button';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { useEffect, useState } from 'react';
import { Expertises } from '@paziresh24/components/doctorApp/profile/expertises';
import { useCreateExpertise, useUpdateExpertise } from '@paziresh24/hooks/drapp/profile';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

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
                            onError: err => {
                                toast.error(err.response.data.message);
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
                        onError: err => {
                            toast.error(err.response.data.message);
                        }
                    }
                )
            );
        });

        Promise.allSettled(promises)
            .then(() => {
                setLoading(false);
                history.push('/consult/fill-info/work-days');
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['register-form']}>
                <div className={styles['form-control']}>
                    {expertises.length > 0 &&
                        expertises.map(
                            (expertise, index) =>
                                !isEmpty(expertise.degree) && (
                                    <Expertises
                                        key={expertise.id}
                                        id={expertise.id}
                                        degree={expertise.degree.id.toString()}
                                        expertise={expertise?.expertise?.id.toString()}
                                        aliasTitle={expertise.alias_title}
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
                        انتخاب ساعت کاری ویزیت انلاین
                    </Button>
                </FixedWrapBottom>
            </div>
        </div>
    );
};

export { ExpertisesPage };
