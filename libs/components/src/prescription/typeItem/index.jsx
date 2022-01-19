import styles from './typeItem.module.scss';

import Button from '../../core/button';
import { useHistory, useParams } from 'react-router-dom';
import Modal from '../../core/modal';
import TextArea from '../../core/textArea';
import { Overlay } from '../../core/overlay';
import { createRef, useEffect, useState } from 'react';
import {
    useGetTaminParTarefs,
    useAddItemService,
    useDeleteItemService,
    useGetItemServices
} from '../../../hooks/prescription';
import { useMe } from '../../../context/prescription/me-context';
import { providers, excludes } from '../../../constants/prescription.json';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { ChevronIcon } from '../../icons';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useSelectType } from '../../../context/prescription/selectType-context';
import { isDesktop } from 'react-device-detect';

const TypeItem = props => {
    const [me] = useMe();
    const [prescriptionInfo] = useSelectPrescription();

    const params = useParams();
    const history = useHistory();
    const addItemService = useAddItemService();
    const getTaminParTarefs = useGetTaminParTarefs();
    const [descriptionModal, setDescriptionModal] = useState(false);
    const [groupModal, setGroupModal] = useState(false);
    const [comments, setComments] = useState(props.items['16']?.comments);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectItem, setSelectItem] = useState();
    const descriptionRef = createRef();
    const deleteItem = useDeleteItemService();
    const getItemServices = useGetItemServices({
        prescriptionId: params.prescriptionId ?? prescriptionInfo?.id
    });
    const [showItems, setShowItems] = useState(false);
    const [selectType, setSelectType] = useSelectType();

    useEffect(() => {
        if (deleteItem.isSuccess) {
            setConfirmDelete(false);
            getItemServices.refetch();
        }
        if (deleteItem.isError) {
            console.clear();
            !toast.isActive('deleteItem') &&
                toast.error(deleteItem.error.response.data.message, {
                    toastId: 'deleteItem'
                });
        }
    }, [deleteItem.status]);

    useEffect(() => {
        if (addItemService.isSuccess) {
            setDescriptionModal(false);
            setComments(descriptionRef.current.value);
        }
    }, [addItemService.isSuccess]);

    const visitSubmit = async () => {
        addItemService.mutate({
            prescriptionId: params.prescriptionId,
            comments: descriptionRef.current.value
        });
    };

    const deleteItemAction = () => {
        deleteItem.mutate({
            prescriptionId: params.prescriptionId,
            itemId: +selectItem.item.id,
            bulkId: selectItem.bulkId && selectItem.bulkId
        });
    };

    const itemClickHandler = async (typeId, item, buckId) => {
        if (prescriptionInfo.insuranceType === providers.salamat) {
            if (!item.isReference) {
                await setSelectItem({ item: item, buckId });
                return setConfirmDelete(true);
            }
            return true;
        }
        history.push(
            `/${params.prescriptionId ?? prescriptionInfo?.id}/${typeId}}/${item.id}/${
                buckId ? `?bulkId=${buckId}` : ``
            }`
        );
    };

    const descriptionButtonAction = () => {
        setDescriptionModal(true);
    };

    const goLab = async group => {
        await setGroupModal(false);
        setSelectType('80');
        history.push(`/${params.prescriptionId ?? prescriptionInfo?.id}/80?group=${group}`);
    };

    const selectTypeItem = id => {
        if (prescriptionInfo.insuranceType === providers.tamin && id === 80) {
            getTaminParTarefs.refetch();
            return setGroupModal(true);
        }
        if (prescriptionInfo.insuranceType === providers.salamat && id == 7) {
            setSelectType(id);
            return history.push(
                `/${params.prescriptionId ?? prescriptionInfo?.id}/${id}?bulkId=${
                    props.items['7'] && last(Object.keys(props.items['7']))
                        ? +last(Object.keys(props.items['7'])) + 1
                        : 1
                }`
            );
        }
        setSelectType(id);
        return history.push(`/${params.prescriptionId ?? prescriptionInfo?.id}/${id}/`);
    };

    const showItemToggle = e => {
        e.stopPropagation();
        if (showItems) {
            return setShowItems(false);
        }
        setShowItems(true);
    };

    return (
        <>
            {!excludes.addButton[prescriptionInfo.insuranceType].includes(props.itemId) && (
                <div
                    className={classNames({
                        [styles['wrapper']]: true,
                        [styles['search']]: props.search
                        // [styles['selected']]: selectType === props.id
                    })}
                >
                    {!props.search && (
                        <div
                            className={styles['row']}
                            onClick={() =>
                                !props.descriptionButton
                                    ? isDesktop && selectTypeItem(props.id)
                                    : descriptionButtonAction()
                            }
                            aria-hidden
                        >
                            <span>{props.title}</span>

                            <div className={styles['action']}>
                                {props.descriptionButton && (
                                    <Button
                                        size="small"
                                        onClick={descriptionButtonAction}
                                        className={styles['actionButton']}
                                        variant="secondary"
                                    >
                                        توضیحات
                                    </Button>
                                )}
                                {!isEmpty(props.items) &&
                                    !props.search &&
                                    !excludes.drugs[prescriptionInfo.insuranceType].includes(
                                        props.itemId
                                    ) &&
                                    props.items[props.itemId]?.length && (
                                        <div
                                            className={styles['showItems']}
                                            onClick={showItemToggle}
                                            aria-hidden
                                        >
                                            <span>{props.items[props.itemId]?.length} قلم</span>
                                            <ChevronIcon dir={showItems ? 'top' : 'bottom'} />
                                        </div>
                                    )}
                                {!isEmpty(props.items[props.itemId]) &&
                                    !props.search &&
                                    excludes.drugs[prescriptionInfo.insuranceType].includes(
                                        props.itemId
                                    ) && (
                                        <div
                                            className={styles['showItems']}
                                            onClick={showItemToggle}
                                            aria-hidden
                                        >
                                            <span>
                                                {Object.keys(props.items[+props.itemId])?.length}{' '}
                                                دسته
                                            </span>
                                            <ChevronIcon dir={showItems ? 'top' : 'bottom'} />
                                        </div>
                                    )}
                                {props.addButton && (
                                    <Button
                                        size="small"
                                        className={styles['actionButton']}
                                        variant="primary"
                                        onClick={() => selectTypeItem(props.id)}
                                    >
                                        افزودن
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {props.items[props.itemId] &&
                        !excludes.drugs[prescriptionInfo.insuranceType].includes(props.itemId) &&
                        !excludes.visitItem[prescriptionInfo.insuranceType].includes(
                            props.itemId
                        ) && (
                            <div
                                className={classNames({
                                    [styles['items']]: true,
                                    [styles['show']]: showItems || props.search,
                                    [styles['search']]: props.search
                                })}
                            >
                                {props.items[props.itemId].map(
                                    item =>
                                        item && (
                                            <div
                                                className={styles['item']}
                                                key={item.id}
                                                onClick={() =>
                                                    itemClickHandler(
                                                        prescriptionInfo.insuranceType ===
                                                            providers.tamin
                                                            ? item.srvId.serviceType.id
                                                            : item.type.id,
                                                        item
                                                    )
                                                }
                                                aria-hidden
                                            >
                                                <span className={styles['item-text']}>
                                                    {prescriptionInfo.insuranceType ===
                                                    providers.tamin
                                                        ? item.srvId.srvName
                                                        : item.service.fullName}
                                                </span>
                                            </div>
                                        )
                                )}
                            </div>
                        )}

                    {props.items[props.itemId] &&
                        excludes.drugs[prescriptionInfo.insuranceType].includes(props.itemId) && (
                            <div
                                className={classNames({
                                    [styles['items']]: true,
                                    [styles['show']]: showItems || props.search,
                                    [styles['search']]: props.search
                                })}
                            >
                                {Object.keys(props.items[+props.itemId]).map(key => (
                                    <div className={styles['groupItem']} key={key}>
                                        {props.items[+props.itemId][key].map(
                                            item =>
                                                item && (
                                                    <div
                                                        className={styles['item']}
                                                        key={item.id}
                                                        onClick={() =>
                                                            itemClickHandler(
                                                                prescriptionInfo.insuranceType ===
                                                                    providers.tamin
                                                                    ? item.srvId.serviceType.id
                                                                    : item.type.id,
                                                                item,
                                                                key
                                                            )
                                                        }
                                                        aria-hidden
                                                    >
                                                        <span className={styles['item-text']}>
                                                            {prescriptionInfo.insuranceType ===
                                                            providers.tamin
                                                                ? item.srvId.srvName
                                                                : item.service.fullName}
                                                        </span>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    {comments &&
                        excludes.visitItem[prescriptionInfo.insuranceType].includes(
                            props.itemId
                        ) && (
                            <div
                                className={classNames({
                                    [styles['items']]: true,
                                    [styles['show']]: true
                                })}
                            >
                                <div
                                    className={styles['item']}
                                    onClick={descriptionButtonAction}
                                    aria-hidden
                                >
                                    <span className={styles['item-text']}>{comments}</span>
                                </div>
                            </div>
                        )}
                </div>
            )}
            <Modal title="ویزیت" isOpen={descriptionModal} onClose={setDescriptionModal}>
                <TextArea
                    placeholder="توضیحات تکمیلی پزشک ..."
                    ref={descriptionRef}
                    default-value={comments}
                />
                <Button variant="primary" onClick={visitSubmit} loading={addItemService.isLoading}>
                    افزودن
                </Button>
            </Modal>

            <Modal title="گروه آزمایش" isOpen={groupModal} onClose={setGroupModal}>
                {(getTaminParTarefs.isLoading ||
                    getTaminParTarefs.isIdle ||
                    getTaminParTarefs.isError) && <Overlay />}
                {getTaminParTarefs.isSuccess && (
                    <ul className={styles['parTarefs-list']}>
                        {getTaminParTarefs.data.map(item => (
                            <li key={item.id} onClick={() => goLab(item.id)} aria-hidden>
                                <span>{item.parGrpDesc}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal>

            <Modal
                title="آیا از حذف قلم مطمئن می باشید؟"
                isOpen={confirmDelete}
                onClose={setConfirmDelete}
            >
                <div className={styles['item']}>
                    <span className={styles['item-text']}>{selectItem?.item.service.fullName}</span>
                </div>
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
        </>
    );
};

export default TypeItem;
