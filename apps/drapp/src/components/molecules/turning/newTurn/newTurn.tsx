import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import axios from 'axios';
import { digitsFaToEn } from '@persian-tools/persian-tools';

import TextField from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Fab from '@mui/material/Fab';
import Modal from '@paziresh24/shared/ui/modal';
import Visit from '../visit';
import ReferenceModal from '@paziresh24/apps/prescription/components/molecules/referenceModal';
import { PlusLineIcon } from '@paziresh24/shared/icon';

import { useAddPrescription } from '@paziresh24/hooks/prescription';
import { useDrApp } from '@paziresh24/context/drapp';
import { Default, Mobile } from '@paziresh24/hooks/device';
import { useUpdatePrescription } from '@paziresh24/hooks/prescription/types';

const NewTurn = () => {
    const [info] = useDrApp();
    const router = useHistory();
    const [openNewTurn, setOpenNewTurn] = useState(false);
    const [confirmCellPhone, setConfirmCellPhone] = useState(false);
    const [referenceModal, setReferenceModal] = useState(false);
    const [visitModal, setVisitModal] = useState(false);
    const patientData = useRef<{
        insuranceType: string;
        id: string;
    }>();
    const [typeAction, setTypeAction] = useState<'create' | 'visit' | null>();
    const [nationalCode, setNationalCode] = useState('');
    const [patientCell, setPatientCell] = useState('');
    const nationalCodeInput = useRef<HTMLInputElement>(null);
    const patientCellInput = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const addPrescription = useAddPrescription();
    const updatePrescription = useUpdatePrescription();

    const openNewTurnAction = useCallback(() => {
        setOpenNewTurn(true);
    }, [openNewTurn]);

    useEffect(() => {
        if (openNewTurn) {
            nationalCodeInput.current?.focus();
            setNationalCode('');
            setPatientCell('');
            setTypeAction(null);
            setConfirmCellPhone(false);
        }
    }, [openNewTurn]);

    useEffect(() => {
        if (confirmCellPhone) patientCellInput.current?.focus();
    }, [confirmCellPhone]);

    const checkPatient = useCallback(({ nationalCode }) => {
        const identifier = uuid();
        const tags = [];
        tags.push({
            type: 'center_id',
            value: info.center.id
        });
        if (info.center.referral_id) {
            tags.push({
                type: 'siam',
                value: info.center.referral_id
            });
        }
        return addPrescription.mutateAsync({
            baseURL: info.center.local_base_url,
            patientNationalCode: digitsFaToEn(nationalCode),
            identifier,
            tags: tags
        });
    }, []);

    const updatePatient = useCallback(({ patientCell, prescriptionId }) => {
        return updatePrescription.mutateAsync({
            baseURL: info.center.local_base_url,
            prescriptionId,
            patientCell: digitsFaToEn(patientCell)
        });
    }, []);

    const handleCreatePrescription = useCallback(async () => {
        try {
            const { result } = (await checkPatient({
                nationalCode
            })) as any;
            patientData.current = result;
            setTypeAction('create');
            if (result.insuranceType === 'tamin' && !result.patientCell) {
                return setConfirmCellPhone(true);
            }
            createAction();
        } catch (error) {
            showError(error);
        }
    }, [nationalCode]);

    const handleCreatePrescriptionAndSubmitVisit = useCallback(async () => {
        try {
            const { result } = (await checkPatient({
                nationalCode
            })) as any;
            patientData.current = result;
            setTypeAction('visit');
            if (result.insuranceType === 'tamin' && !result.patientCell) {
                return setConfirmCellPhone(true);
            }
            visitAction();
        } catch (error) {
            showError(error);
        }
    }, [nationalCode]);

    const handleInsertCellPhone = useCallback(async () => {
        if (!patientCell) return toast.error('لطفا شماره موبایل را وارد کنید.');
        try {
            await updatePatient({
                patientCell,
                prescriptionId: patientData.current?.id
            });
            typeAction === 'create' ? createAction() : visitAction();
        } catch (error) {
            showError(error);
        }
    }, [patientCell]);

    const visitAction = () => {
        setVisitModal(true);
        setOpenNewTurn(false);
    };

    const createAction = () => {
        router.push(`/prescription/patient/${patientData.current?.id}`);
    };

    const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode == 13) {
            handleCreatePrescription();
        }
    };

    const showError = useCallback(error => {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message);
            if (
                error.response?.data?.message ===
                'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
            ) {
                router.push('/providers');
            }
            if (
                error.response?.data?.message ===
                'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
            ) {
                router.push('/providers');
            }
        }
    }, []);

    return (
        <>
            <Default>
                <Button onClick={openNewTurnAction} variant="contained" size="large">
                    افزودن بیمار
                </Button>
            </Default>
            <Mobile>
                <Fab
                    color="primary"
                    variant="extended"
                    onClick={openNewTurnAction}
                    className="!fixed bottom-28 space-s-1 !px-7"
                >
                    <PlusLineIcon color="#fff" onClick={undefined} />
                    <span className="text-white">افزودن بیمار</span>
                </Fab>
            </Mobile>

            <Modal title="افزودن بیمار" isOpen={openNewTurn} onClose={setOpenNewTurn}>
                <div className="flex flex-col space-y-4">
                    <TextField
                        label="کدملی/کداتباع"
                        inputMode="numeric"
                        inputRef={nationalCodeInput}
                        onChange={e => setNationalCode(e.target.value)}
                        onKeyDown={keyPress}
                        disabled={confirmCellPhone}
                    />
                    {confirmCellPhone && (
                        <TextField
                            label="شماره موبایل"
                            onChange={e => setPatientCell(e.target.value)}
                            inputMode="tel"
                            inputRef={patientCellInput}
                            error={patientCell.length !== 11}
                        />
                    )}
                    <Link
                        component="button"
                        textAlign="left"
                        variant="body2"
                        onClick={() => setReferenceModal(true)}
                    >
                        پذیرش از مسیر ارجاع
                    </Link>
                    <div className="flex space-s-3">
                        {confirmCellPhone && (
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleInsertCellPhone}
                                loading={updatePrescription.isLoading}
                            >
                                تایید
                            </Button>
                        )}
                        {!confirmCellPhone && (
                            <>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleCreatePrescription}
                                    loading={addPrescription.isLoading}
                                >
                                    تجویز نسخه
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleCreatePrescriptionAndSubmitVisit}
                                    loading={addPrescription.isLoading}
                                >
                                    ثبت ویزیت
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
            <ReferenceModal
                isOpen={referenceModal}
                onClose={setReferenceModal}
                nationalCodeDefaultValue={nationalCode}
            />
            <Visit
                isOpen={visitModal}
                onClose={setVisitModal}
                provider={patientData.current?.insuranceType as 'tamin' | 'salamat'}
                prescriptionId={patientData.current?.id}
                refetchData={() => queryClient.refetchQueries('turns')}
            />
        </>
    );
};

export default NewTurn;
