import styles from './expertises.module.scss';
import Select from '@paziresh24/shared/ui/select';
import degreeData from '@paziresh24/constants/degree.json';
import expertisesData from '@paziresh24/constants/expertises.json';
import { useEffect, useState } from 'react';
import Modal from '@paziresh24/shared/ui/modal';
import Button from '@paziresh24/shared/ui/button';
import { PlusLineIcon, CloseIcon } from '@paziresh24/shared/icon';
import isEmpty from 'lodash/isEmpty';
import { useRemoveSpecialities } from 'apps/drapp/src/apis/specialities/removeSpecialities';
import { toast } from 'react-toastify';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import DateInput from '@paziresh24/shared/ui/dateInput';
import TextField from '@paziresh24/shared/ui/textField';
import moment from 'jalali-moment';

export const Expertises = props => {
    const [degree, setDegree] = useState(props.degree);
    const [expertise, setExpertise] = useState(props.expertise);
    const [aliasTitle, setAliasTitle] = useState(props.aliasTitle);
    const [achievedAt, setAchievedAt] = useState(props.achievedAt);
    const removeSpecialities = useRemoveSpecialities();
    const [deleteExpertisesModal, setDeleteExpertisesModal] = useState(false);

    useEffect(() => {
        if (props.degree) setDegree(props.degree);
        if (props.expertise) setExpertise(props.expertise);
    }, [props.degree, props.expertise]);

    useEffect(() => {
        if (degree !== props.degree) {
            setExpertise(null);
        }
        if (degree) {
            setTimeout(() => {
                let visitesList = [...props.expertises];
                visitesList[props.index] = {
                    id: props.id,
                    degree: {
                        id: degree
                    },
                    expertise: {
                        id: expertise
                    },
                    alias_title: aliasTitle,
                    achieved_at: achievedAt
                };
                setTimeout(() => {
                    props.setExpertise(visitesList);
                });
            });
        }

        if (expertise) {
            setTimeout(() => {
                let visitesList = [...props.expertises];
                visitesList[props.index] = {
                    id: props.id,
                    degree: {
                        id: degree
                    },
                    expertise: {
                        id: expertise
                    },
                    alias_title: aliasTitle,
                    achieved_at: achievedAt
                };
                setTimeout(() => {
                    props.setExpertise(visitesList);
                });
            });
        }
    }, [degree, expertise, aliasTitle, achievedAt]);

    const deleteAction = () => {
        if (props.id) {
            return removeSpecialities.mutate(
                { id: props.id },
                {
                    onSuccess: async () => {
                        getSplunkInstance().sendEvent({
                            group: 'profile-expertise',
                            type: 'remove-expertise',
                            event: {
                                id: props.id,
                                academic_degree_id: degree.id,
                                speciality_id: expertise.id,
                                alias: aliasTitle,
                                achieved_at: achievedAt
                            }
                        });
                        setDeleteExpertisesModal(false);
                        let visitesList = [...props.expertises];
                        visitesList.splice(props.index, 1);
                        if (isEmpty(visitesList)) {
                            visitesList.push({
                                alias_title: '',
                                achieved_at: '',
                                degree: { id: 0, name: '' },
                                expertise: { id: 0, name: '' },
                                id: ''
                            });
                        }
                        props.setExpertise(visitesList);
                    }
                }
            );
        }
    };

    return (
        <>
            <div className={styles['expertises_row']}>
                <CloseIcon onClick={() => setDeleteExpertisesModal(true)} />
                {props.isLastItem && (
                    <PlusLineIcon
                        color="#22282F"
                        onClick={() =>
                            props.setExpertise(prev => [
                                ...prev,
                                {
                                    alias_title: '',
                                    degree: { id: 0, name: '' },
                                    expertise: { id: 0, name: '' },
                                    id: ''
                                }
                            ])
                        }
                    />
                )}
            </div>
            <div className={styles['expertises_row']}>
                <Select
                    label="درجه علمی"
                    searchble
                    onChange={value => value && setDegree(value.id)}
                    defaultValue={degree}
                    items={degreeData.map(item => ({
                        name: item.name,
                        value: item.id
                    }))}
                />
                <Select
                    label="تخصص"
                    searchble
                    onChange={value => value && setExpertise(value.id)}
                    defaultValue={expertise}
                    items={expertisesData
                        .filter(expertise => +expertise.degree_id === +degree)
                        .map(item => ({
                            name: item.name,
                            value: item.expertise_id
                        }))}
                />
            </div>
            <TextField
                onChange={e => setAliasTitle(e.target.value)}
                label="عنوان تخصص"
                defaultValue={aliasTitle}
                error={aliasTitle && aliasTitle?.length > 65}
                errorText={'به ازای هر تخصص، حداکثر میتوانید 65 حرف را برای عنوان تخصص ثبت کنید.'}
            />
            <DateInput
                label="تاریخ اخذ مدرک"
                defaultValue={achievedAt}
                onCahnge={value => {
                    setAchievedAt(value);
                }}
            />

            <Modal
                title="آیا از حذف تخصص مطمئن هستید؟"
                onClose={setDeleteExpertisesModal}
                isOpen={deleteExpertisesModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        theme="error"
                        onClick={deleteAction}
                        loading={removeSpecialities.isLoading}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        theme="error"
                        onClick={() => setDeleteExpertisesModal(false)}
                    >
                        لغو عملیات
                    </Button>
                </div>
            </Modal>
        </>
    );
};
