import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import Button from '@paziresh24/shared/ui/button';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { useEffect, useState } from 'react';
import { Expertises } from '@components/molecules/profile/expertises';
import { useCreateExpertise, useUpdateExpertise } from '@paziresh24/hooks/drapp/profile';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';
import SelectDate from '@paziresh24/apps/prescription/components/molecules/selectDate';
import { useConsult } from '@paziresh24/context/drapp/consult';
import moment from 'jalali-moment';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const ExpertisesPage = () => {
    const [info] = useDrApp();
    const [expertises, setExpertises] = useState([]);
    const createExpertise = useCreateExpertise();
    const updateExpertise = useUpdateExpertise();
    const [loading, setLoading] = useState(false);
    const promises = [];
    const [date, setDate] = useState();
    const [consult, setConsult] = useConsult();
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
        const formattedDateToTimeStamp =
            moment
                .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
                .format('x') / 1000;
        setConsult({
            ...consult,
            graduation_date: formattedDateToTimeStamp
        });
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
                                    group: 'create_expertise_consult',
                                    type: 'successful'
                                });
                            },
                            onError: error => {
                                getSplunkInstance().sendEvent({
                                    group: 'create_expertise_consult',
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
                                group: 'update_expertise_consult',
                                type: 'successful'
                            });
                        },
                        onError: error => {
                            getSplunkInstance().sendEvent({
                                group: 'update_expertise_consult',
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
                                        degree={expertiseObject.degree?.id}
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
                <label>تاریخ اخذ مدرک</label>
                <div className={styles.selectDate}>
                    <SelectDate today value={setDate} />
                </div>
                <FixedWrapBottom>
                    <Button onClick={updateCenter} loading={loading} block>
                        انتخاب ساعت کاری ویزیت انلاین
                    </Button>
                </FixedWrapBottom>
            </div>
        </Container>
    );
};

export { ExpertisesPage };
