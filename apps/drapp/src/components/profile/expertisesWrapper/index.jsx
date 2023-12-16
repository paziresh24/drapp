import { useDrApp } from '@paziresh24/context/drapp';
import { useEffect, useRef, useState } from 'react';
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
import { useGetSpecialities } from 'apps/drapp/src/apis/specialities/getSpecialities';
import { useFeatureValue } from '@growthbook/growthbook-react';
import OFFICE_CENTER from '@paziresh24/constants/officeCenter';
import { useCreateSpecialities } from 'apps/drapp/src/apis/specialities/createSpecialities';
import { useUpdateSpecialities } from 'apps/drapp/src/apis/specialities/updateSpecialities';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

export const ExpertisesWrapper = props => {
    const [info] = useDrApp();
    const [specializations, setSpecializations] = useState([]);
    const [specialitiesListId, setSpecialitiesListId] = useState([]);
    const getExpertises = useGetExpertises({ center_id: info.center.id });
    const providersApiDoctorList = useFeatureValue('profile:patch-expertises-api|doctor-list', {
        ids: ['']
    });
    const providersApiDoctorCitiesList = useFeatureValue('profile:patch-expertises-api|cities', {
        cities: ['']
    });
    const getSpecialities = useGetSpecialities({ provider_id: info?.doctor?.provider_id });
    const createSpecialities = useCreateSpecialities();
    const updateSpecialities = useUpdateSpecialities();
    const createExpertise = useCreateExpertise();
    const updateExpertise = useUpdateExpertise();
    const expertisesPromises = [];
    const shouldUseProvider =
        providersApiDoctorList.ids?.includes(info.doctor?.user_id) ||
        providersApiDoctorList.ids?.includes('*') ||
        providersApiDoctorCitiesList.cities?.includes(
            info.center?.type_id === OFFICE_CENTER && info?.center?.city
        ) ||
        providersApiDoctorCitiesList.cities?.includes('*');

    useEffect(() => {
        shouldUseProvider && getSpecialities.refetch();
        getExpertises.refetch();
    }, [info.center]);

    useEffect(() => {
        if (shouldUseProvider && getSpecialities.isSuccess && !isEmpty(getSpecialities.data.data)) {
            shouldUseProvider &&
                setSpecializations(
                    getSpecialities.data.data?.providers_specialities?.map(items => ({
                        alias_title: items?.alias,
                        degree: items?.academic_degree,
                        expertise: items?.speciality,
                        id: items?.id
                    }))
                );
        }

        if (getExpertises.isSuccess) {
            if (isEmpty(getExpertises.data.data)) {
                return setSpecializations([
                    {
                        alias_title: '',
                        degree: { id: 0, name: '' },
                        expertise: { id: 0, name: '' },
                        id: ''
                    }
                ]);
            }
            !shouldUseProvider && setSpecializations(getExpertises.data.data);
        }
        shouldUseProvider &&
            setSpecialitiesListId(
                getExpertises?.data?.data.map(item => ({
                    expertise_id: item.id,
                    specialties_id: getSpecialities?.data?.data.providers_specialities.find(
                        spec => spec.speciality.title === item.expertise.name
                    )?.id
                }))
            );
    }, [getExpertises.status, getSpecialities.status]);

    const saveExpertises = () => {
        if (specializations.length > 3)
            return toast.error('حداکثر میتوانید 3 تخصص را انتخاب کنید.');
        if (specializations.find(item => item.alias_title.length > 65)) return;
        specializations.forEach(expertise => {
            if (!expertise.id) {
                return expertisesPromises.push(
                    createSpecialities.mutateAsync(
                        {
                            academic_degree_id: expertise.degree.id,
                            speciality_id: expertise.expertise.id,
                            alias: expertise.alias_title
                        },
                        {
                            onSuccess: () => {
                                getSplunkInstance().sendEvent({
                                    group: 'profile-expertise',
                                    type: 'add-expertise',
                                    event: {
                                        academic_degree_id: expertise.degree.id,
                                        speciality_id: expertise.expertise.id,
                                        alias: expertise.alias_title
                                    }
                                });
                                createExpertise.mutateAsync(
                                    {
                                        expertise_id: expertise.expertise.id,
                                        degree_id: expertise.degree.id,
                                        alias_title: expertise.alias_title
                                    },
                                    {
                                        onError: err => {
                                            toast.error(err.response.data.message);
                                            return;
                                        }
                                    }
                                );
                            },
                            onError: err => {
                                toast.error(err.response.data.message);
                            }
                        }
                    )
                );
            }

            return expertisesPromises.push(
                updateSpecialities.mutateAsync(
                    {
                        id: expertise.id,
                        academic_degree_id: expertise.degree.id,
                        speciality_id: expertise.expertise.id,
                        alias: expertise.alias_title
                    },
                    {
                        onSuccess: () => {
                            getSplunkInstance().sendEvent({
                                group: 'profile-expertise',
                                type: 'update-expertise',
                                event: {
                                    id: expertise.id,
                                    academic_degree_id: expertise.degree.id,
                                    speciality_id: expertise.expertise.id,
                                    alias: expertise.alias_title
                                }
                            });
                            updateExpertise.mutateAsync(
                                {
                                    id: specialitiesListId.find(
                                        item => item?.specialties_id === expertise.id
                                    )?.expertise_id,
                                    expertise_id: expertise.expertise.id,
                                    degree_id: expertise.degree.id,
                                    alias_title: expertise.alias_title
                                },
                                {
                                    onError: err => {
                                        toast.error(err.response.data.message);
                                        return;
                                    }
                                }
                            );
                        },
                        onError: err => {
                            toast.error(err.response.data.message);
                        }
                    }
                )
            );
        });

        Promise.allSettled(expertisesPromises).then(() => {
            getExpertises.remove();
            shouldUseProvider && getSpecialities.remove();
            setTimeout(() => {
                getExpertises.refetch();
                shouldUseProvider && getSpecialities.refetch();
            });
            props.setExpertiseAccordion(false);
            return toast.success('تخصص با موفقیت ذخیره شد.');
        });
    };

    return (
        <>
            {specializations.map(
                (expertise, index) =>
                    !isEmpty(expertise.degree) && (
                        <Expertises
                            key={expertise.id}
                            id={expertise.id}
                            degree={expertise?.degree?.id}
                            expertise={expertise?.expertise?.id}
                            aliasTitle={expertise?.alias_title}
                            setExpertise={setSpecializations}
                            expertises={specializations}
                            index={index}
                            isShouldUseProvider={shouldUseProvider}
                            specialitiesListId={specialitiesListId}
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
                        setSpecializations(prev => [
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
                    buttonIcon={<PlusLineIcon color="#0070f3" />}
                />
            </div>
        </>
    );
};
