import styles from './formDetails.module.scss';

import { Select, Option } from '../../../core/Selecte';
import Counter from '../../../core/counter';
import TextArea from '../../../core/textArea';

import { createRef, useEffect, useState } from 'react';
import {
    useAddItemService,
    useDeleteItemService,
    useEditItemService,
    useGeTDrugAmounts,
    useGetDrugInstructions
} from '@paziresh24/hooks/prescription';
import SelectDate from '../../selectDate';

import moment from 'jalali-moment';
import { useMe } from '../../../../context/prescription/me-context';
import FixedWrapBottom from '../../../prescription/fixedWrapBottom';
import Button from '../../../core/button';
import TextField from '../../../core/textField';
import Modal from '../../../core/modal';
import { Loading } from '../../../prescription/loading';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    providers,
    drugServices,
    toastType,
    excludes,
    drugTypes
} from '../../../../constants/prescription.json';
import queryString from 'query-string';
import { TrashIcon } from '../../../icons';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';

const FormDetails = props => {
    const [me] = useMe();
    const [prescriptionInfo] = useSelectPrescription();

    const params = useParams();
    const history = useHistory();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    const editItem = useEditItemService();
    const deleteItem = useDeleteItemService();
    const sendItem = useAddItemService();
    const sendOtherItem = useAddItemService();

    const drugInstructions = useGetDrugInstructions({ provider: prescriptionInfo?.insuranceType });
    const drugAmounts = useGeTDrugAmounts({ provider: prescriptionInfo?.insuranceType });

    const descriptionRef = createRef();

    const [instruction, setInstruction] = useState(null);
    const [amount, setAmount] = useState(null);
    const [count, setCount] = useState(1);
    const [period, setPeriod] = useState(1);
    const [dateDo, setDateDo] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [visitModal, setVisitModal] = useState(false);

    const [redirect, setRedirect] = useState(false);

    const countDrugs = createRef();

    useEffect(() => {
        if (prescriptionInfo?.insuranceType) {
            drugAmounts.refetch();
            drugInstructions.refetch();
        }
    }, [me]);

    useEffect(() => {
        if (sendItem.isSuccess) {
            sendItem.reset();
            sendItem.data?.messages.map(item => {
                toast[toastType[item.type]](item.text);
            });
        }
        if (deleteItem.isSuccess) {
            deleteItem.reset();

            sendItem.data?.messages.map(item => {
                toast[toastType[item.type]](item.text);
            });
        }
        if (editItem.isSuccess) {
            editItem.reset();

            sendItem.data?.messages.map(item => {
                toast[toastType[item.type]](item.text);
            });
        }
        if (sendItem.isSuccess || deleteItem.isSuccess || editItem.isSuccess) {
            setConfirmDelete(false);
            setVisitModal(false);
            if (redirect) history.goBack();
        }
        if (sendOtherItem.isSuccess) {
            sendOtherItem.reset();
            history.goBack();
        }
        if (sendOtherItem.isError) {
            sendOtherItem.reset();
            console.clear();

            if (sendOtherItem.error.response.data.messages) {
                sendOtherItem.error.response.data?.messages.map(item => {
                    toast[toastType[item.type]](item.text);
                });
            } else {
                !toast.isActive('sendOtherItem') &&
                    toast.error(sendOtherItem.error.response.data.message, {
                        toastId: 'sendOtherItem'
                    });
            }
        }

        if (sendItem.isError) {
            sendItem.reset();
            console.clear();
            if (sendItem.error.response.data.messages) {
                sendItem.error.response.data?.messages.map(item => {
                    toast[toastType[item.type]](item.text);
                });
            } else {
                !toast.isActive('sendItem') &&
                    toast.error(sendItem.error.response.data.message, {
                        toastId: 'sendItem'
                    });
            }
        }
        if (deleteItem.isError) {
            deleteItem.reset();
            !toast.isActive('deleteItem') &&
                toast.error(deleteItem.error.response.data.message, {
                    toastId: 'deleteItem'
                });
        }
        if (editItem.isError) {
            editItem.reset();
            !toast.isActive('editItem') &&
                toast.error(editItem.error.response.data.message, {
                    toastId: 'editItem'
                });
        }
    }, [sendItem.status, deleteItem.status, editItem.status, sendOtherItem]);

    const editItemAction = () => {
        if (props['service-type'] === 1 || props['service-type'] == 7) {
            editItem.mutate({
                prescriptionId: params.prescriptionId,
                useInstruction:
                    prescriptionInfo?.insuranceType === providers.tamin ? instruction : amount,
                useTime: prescriptionInfo?.insuranceType === providers.tamin ? amount : instruction,
                count: count,
                numberOfPeriod: period,
                description: descriptionRef.current.value,
                itemId: +params.serviceId,
                bulkId: urlParams.bulkId && urlParams.bulkId
            });
        } else {
            editItem.mutate({
                prescriptionId: params.prescriptionId,
                count: count,
                description: descriptionRef.current.value,
                dateDo:
                    dateDo &&
                    moment
                        .from(`${dateDo.year}/${dateDo.month}/${dateDo.day}`, 'fa', 'YYYY/MM/DD')
                        .format('YYYY-MM-DD'),
                itemId: +params.serviceId
            });
        }
        setRedirect(true);
    };

    const deleteItemAction = () => {
        deleteItem.mutate({
            prescriptionId: params.prescriptionId,
            itemId: +params.serviceId,
            bulkId: urlParams.bulkId && urlParams.bulkId
        });
        setRedirect(true);
    };

    const addItemAction = () => {
        if (prescriptionInfo?.insuranceType === providers.tamin && props['service-type'] == 17) {
            setRedirect(true);
            return setVisitModal(true);
        }

        if (prescriptionInfo?.insuranceType === providers.salamat && props['service-type'] == 7) {
            setRedirect(true);
            return sendItem.mutate({
                prescriptionId: params.prescriptionId,
                count: +countDrugs.current.value,
                description: descriptionRef.current.value,
                id: +params.serviceId,
                bulkId: urlParams.bulkId
            });
        }

        if (props['service-type'] === 1) {
            setRedirect(true);
            return sendItem.mutate({
                prescriptionId: params.prescriptionId,
                useInstruction:
                    prescriptionInfo?.insuranceType === providers.tamin ? instruction : amount,
                useTime: prescriptionInfo?.insuranceType === providers.tamin ? amount : instruction,
                count: count,
                numberOfPeriod: period,
                description: descriptionRef.current.value,
                id: +params.serviceId
            });
        }
        setRedirect(true);
        sendItem.mutate({
            prescriptionId: params.prescriptionId,
            count: count,
            description: descriptionRef.current.value,
            dateDo:
                dateDo &&
                moment
                    .from(`${dateDo.year}/${dateDo.month}/${dateDo.day}`, 'fa', 'YYYY/MM/DD')
                    .format('YYYY-MM-DD'),
            id: +params.serviceId
        });
    };

    const addOtherItemAction = () => {
        return sendOtherItem.mutate({
            prescriptionId: params.prescriptionId,
            count: +countDrugs.current.value,
            description: descriptionRef.current.value,
            id: +params.serviceId,
            bulkId: urlParams.bulkId
        });
    };

    const addItem17Action = isVisit => {
        if (props['service-type'] == 17) {
            sendItem.mutate({
                prescriptionId: params.prescriptionId,
                count: count,
                description: descriptionRef.current.value,
                dateDo:
                    dateDo &&
                    moment
                        .from(`${dateDo.year}/${dateDo.month}/${dateDo.day}`, 'fa', 'YYYY/MM/DD')
                        .format('YYYY-MM-DD'),
                isVisit: isVisit,
                id: +params.serviceId
            });
        }
    };

    return (
        <>
            <div className={styles['wrapper']}>
                <div className={styles['form']}>
                    {(drugInstructions.isLoading || drugAmounts.isLoading) && <Loading />}

                    {drugServices[prescriptionInfo.insuranceType].includes(props['service-type']) &&
                        drugInstructions.isSuccess &&
                        drugAmounts.isSuccess && (
                            <>
                                <div className={styles['form_row']}>
                                    {drugInstructions.isSuccess && (
                                        <Select
                                            label="زمان مصرف"
                                            searchble
                                            value={setInstruction}
                                            default-value={
                                                prescriptionInfo.insuranceType === providers.tamin
                                                    ? props['default-data']?.drugInstruction
                                                    : props['default-data']?.consumption?.id
                                            }
                                        >
                                            {drugInstructions.data.map(instruction => (
                                                <Option
                                                    key={instruction.id}
                                                    value={instruction.id}
                                                    title={
                                                        instruction.name.includes('ي')
                                                            ? instruction.name.replace('ي', 'ی')
                                                            : instruction.name
                                                    }
                                                >
                                                    {instruction.name.includes('ي')
                                                        ? instruction.name.replace('ي', 'ی')
                                                        : instruction.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}

                                    <Counter
                                        label="تعداد"
                                        value={setCount}
                                        defaultValue={
                                            prescriptionInfo.insuranceType === providers.tamin
                                                ? +props['default-data']?.srvQty
                                                : +props['default-data']?.count
                                        }
                                    />
                                </div>

                                <div className={styles['form_row']}>
                                    {prescriptionInfo?.insuranceType === providers.salamat &&
                                        drugAmounts.isSuccess &&
                                        (props.data.shape.title === 'S' ||
                                            props.data.shape.title === 'O') && (
                                            <Select
                                                label="مقادیر  مصرف"
                                                searchble
                                                value={setAmount}
                                                default-value={
                                                    prescriptionInfo.insuranceType ===
                                                    providers.tamin
                                                        ? props['default-data']?.timesADay
                                                        : props['default-data']
                                                              ?.consumptionInstruction?.id
                                                }
                                            >
                                                {drugAmounts.data.map(amount => (
                                                    <Option key={amount.id} value={amount.id}>
                                                        {amount.name.includes('ي')
                                                            ? amount.name.replace('ي', 'ی')
                                                            : amount.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    {prescriptionInfo?.insuranceType === providers.tamin &&
                                        drugAmounts.isSuccess && (
                                            <Select
                                                label="مقادیر  مصرف"
                                                searchble
                                                value={setAmount}
                                                default-value={
                                                    prescriptionInfo.insuranceType ===
                                                    providers.tamin
                                                        ? props['default-data']?.timesADay
                                                        : props['default-data']
                                                              ?.consumptionInstruction?.id
                                                }
                                            >
                                                {drugAmounts.data.map(amount => (
                                                    <Option key={amount.id} value={amount.id}>
                                                        {amount.name.includes('ي')
                                                            ? amount.name.replace('ي', 'ی')
                                                            : amount.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}

                                    {prescriptionInfo?.insuranceType === providers.salamat &&
                                        props.data.shape.title !== 'S' && (
                                            <Counter
                                                label="دوره مصرف"
                                                value={setPeriod}
                                                type={
                                                    prescriptionInfo?.insuranceType ===
                                                    providers.salamat
                                                        ? drugTypes[props.data.shape.title]
                                                        : ''
                                                }
                                                defaultValue={
                                                    prescriptionInfo.insuranceType ===
                                                    providers.tamin
                                                        ? +props['default-data']?.repeat
                                                        : +props['default-data']?.numberOfPeriod
                                                }
                                            />
                                        )}

                                    {prescriptionInfo?.insuranceType === providers.tamin && (
                                        <Counter
                                            label="دوره مصرف"
                                            value={setPeriod}
                                            type={
                                                prescriptionInfo?.insuranceType ===
                                                providers.salamat
                                                    ? drugTypes[props.data.shape.title]
                                                    : ''
                                            }
                                            defaultValue={
                                                prescriptionInfo.insuranceType === providers.tamin
                                                    ? +props['default-data']?.repeat
                                                    : +props['default-data']?.numberOfPeriod
                                            }
                                        />
                                    )}
                                </div>

                                <TextArea
                                    label="توضیحات"
                                    ref={descriptionRef}
                                    placeholder="توضیحات تکمیلی برای مثال طریقه مصرف ..."
                                    default-value={
                                        prescriptionInfo.insuranceType === providers.tamin
                                            ? props['default-data']?.dose
                                            : props['default-data']?.description
                                    }
                                />
                            </>
                        )}

                    {!drugServices[prescriptionInfo.insuranceType].includes(
                        props['service-type']
                    ) &&
                        !excludes.drugs[prescriptionInfo.insuranceType].includes(
                            props['service-type']
                        ) && (
                            <>
                                {prescriptionInfo?.insuranceType === providers.salamat &&
                                    props['service-type'] !== 6 && (
                                        <Counter
                                            label="تعداد"
                                            value={setCount}
                                            defaultValue={
                                                prescriptionInfo.insuranceType === providers.tamin
                                                    ? +props['default-data']?.srvQty
                                                    : +props['default-data']?.count
                                            }
                                        />
                                    )}
                                {prescriptionInfo?.insuranceType === providers.tamin && (
                                    <Counter
                                        label="تعداد"
                                        value={setCount}
                                        defaultValue={
                                            prescriptionInfo.insuranceType === providers.tamin
                                                ? +props['default-data']?.srvQty
                                                : +props['default-data']?.count
                                        }
                                    />
                                )}
                                <TextArea
                                    label="توضیحات"
                                    ref={descriptionRef}
                                    default-value={
                                        prescriptionInfo.insuranceType === providers.tamin
                                            ? props['default-data']?.dose
                                            : props['default-data']?.description
                                    }
                                />
                                {prescriptionInfo?.insuranceType === providers.salamat &&
                                    props['service-type'] !== 6 && (
                                        <SelectDate
                                            label="تاریخ موثر"
                                            value={setDateDo}
                                            default-value={props['default-data']?.dateDo}
                                        />
                                    )}

                                {prescriptionInfo?.insuranceType === providers.tamin && (
                                    <SelectDate
                                        label="تاریخ موثر"
                                        value={setDateDo}
                                        default-value={props['default-data']?.dateDo}
                                    />
                                )}
                            </>
                        )}

                    {excludes.drugs[prescriptionInfo.insuranceType].includes(
                        props['service-type']
                    ) && (
                        <>
                            <TextField type="number" label="مقدار" ref={countDrugs} />
                            <TextArea
                                label="توضیحات"
                                ref={descriptionRef}
                                default-value={
                                    prescriptionInfo.insuranceType === providers.tamin
                                        ? props['default-data']?.dose
                                        : props['default-data']?.description
                                }
                            />
                        </>
                    )}
                </div>

                {drugInstructions.isSuccess && drugAmounts.isSuccess && (
                    <FixedWrapBottom>
                        {props.action === 'add' ? (
                            prescriptionInfo?.insuranceType != providers.salamat ||
                            props['service-type'] != 7 ? (
                                <Button
                                    block
                                    icon="arrow"
                                    variant="primary"
                                    onClick={addItemAction}
                                    disabled={sendItem.isLoading}
                                    loading={sendItem.isLoading}
                                >
                                    ثبت
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        block
                                        variant="primary"
                                        onClick={addOtherItemAction}
                                        loading={sendOtherItem.isLoading}
                                    >
                                        انتخاب دیگر
                                    </Button>
                                    <Button
                                        block
                                        variant="secondary"
                                        onClick={addItemAction}
                                        loading={sendItem.isLoading}
                                    >
                                        ثبت
                                    </Button>
                                </>
                            )
                        ) : (
                            <>
                                <Button
                                    block
                                    variant="primary"
                                    onClick={editItemAction}
                                    loading={editItem.isLoading}
                                >
                                    اعمال ویرایش
                                </Button>

                                <Button
                                    onClick={() => setConfirmDelete(true)}
                                    variant="secondary"
                                    theme="error"
                                    square
                                    buttonIcon={<TrashIcon color="#f56262" />}
                                />
                            </>
                        )}
                    </FixedWrapBottom>
                )}
            </div>

            <Modal
                title="آیا از حذف مطمئن می باشید؟"
                isOpen={confirmDelete}
                onClose={setConfirmDelete}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        theme="error"
                        onClick={deleteItemAction}
                        disabled={deleteItem.isLoading}
                        loading={deleteItem.isLoading}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        theme="error"
                        onClick={() => setConfirmDelete(false)}
                    >
                        لغو عملیات
                    </Button>
                </div>
            </Modal>

            <Modal
                title="آیا خدمت همراه با ویزیت ثبت شود؟"
                isOpen={visitModal}
                onClose={setVisitModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        onClick={() => addItem17Action(true)}
                        disabled={sendItem.isLoading}
                        loading={sendItem.isLoading}
                    >
                        بله
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        onClick={() => addItem17Action(false)}
                        disabled={sendItem.isLoading}
                        loading={sendItem.isLoading}
                    >
                        خیر
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export { FormDetails };
