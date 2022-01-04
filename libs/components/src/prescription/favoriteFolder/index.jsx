/* eslint-disable jsx-a11y/label-has-associated-control */
import styles from './favoriteFolder.module.scss';
import { useState, useEffect } from 'react';
import Modal from '../../core/modal';
import { useServices } from '@paziresh24/prescription/services-context';
import { Overlay } from '../../core/overlay';
import Button from '../../core/button';
import {
    useDeleteFavoriteServices,
    useGetFavoritePrescriptions,
    useGetFavoriteServices,
    usePostFavoritePrescriptions
} from '@paziresh24/hooks/prescription/';
import FixedWrapBottom from '../fixedWrapBottom';
import SearchBar from '../search/searchBar';
import { EmptyState } from '../emptyState';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { isMobile } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import consumptionData from '@constants/drugData/consumption.json';
import { useLearnTour } from '../../../hooks/learn';
import isEmpty from 'lodash/isEmpty';

const FavoriteFolder = ({ isOpen, onClose, type }) => {
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    const [prescriptionInfo] = useSelectPrescription();
    const [itemsSelect, setItemsSelect] = useState([]);

    const [favoriteFolderModal, setFavoriteFolderModal] = useState(null);
    const getFavoritePrescriptions = useGetFavoritePrescriptions();
    const postFavoritePrescriptions = usePostFavoritePrescriptions();

    const getFavoriteServices = useGetFavoriteServices({
        provider: prescriptionInfo?.insuranceType,
        ...(type === 'drugs' && {
            service_type: prescriptionInfo?.insuranceType === 'tamin' ? 79 : 1
        }),
        ...(type === 'lab' && {
            service_type_in: prescriptionInfo?.insuranceType === 'tamin' ? 80 : 2
        }),
        ...(type === 'others' && {
            service_type_nin: prescriptionInfo?.insuranceType === 'tamin' ? [79, 80] : [1, 2]
        })
    });
    const deleteFavoriteServices = useDeleteFavoriteServices();

    const [searchServiceValue, setSearchServiceValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFavoriteFolderModal(true);
            getFavoriteServices.refetch();
        }
    }, [isOpen]);

    useEffect(() => {
        onClose(false);
    }, [favoriteFolderModal]);

    useEffect(() => {
        if (postFavoritePrescriptions.isSuccess) {
            getFavoritePrescriptions.refetch();
        }
    }, [postFavoritePrescriptions.status]);

    const [, setServices] = useServices();
    const addItemService = () => {
        itemsSelect.map(item =>
            setServices(service => [
                ...service,
                {
                    ...item,
                    id: [...service].length + 1,
                    service_type: item.service_type
                }
            ])
        );
        setFavoriteFolderModal(false);
        setItemsSelect([]);
    };

    const deleteItemServiceAction = id => {
        deleteFavoriteServices.mutate(
            { id },
            {
                onSuccess: () => {
                    getFavoriteServices.refetch();
                }
            }
        );
    };

    const { isTourOpen, setSteps } = useLearnTour();

    const closeModal = () => {
        setFavoriteFolderModal();
        if (isTourOpen) {
            setSteps(12);
        }
    };
    return (
        <Modal
            title="پراستفاده ها"
            isOpen={favoriteFolderModal}
            onClose={closeModal}
            fullPage={isMobile}
            maxWidth="60%"
            id="show_favorite_step"
        >
            <div className={styles['searchWrapper']}>
                <SearchBar label="جستجوی بین اقلام ..." value={setSearchServiceValue} />
            </div>

            <div className={styles['items']}>
                {getFavoriteServices.isLoading && <Overlay />}
                {getFavoriteServices.isSuccess &&
                    getFavoriteServices.data.map(
                        item =>
                            item.service.name.toLowerCase().includes(searchServiceValue) && (
                                <div className={styles['item']} key={item.id}>
                                    <div
                                        className={styles['item_icon']}
                                        onClick={() => deleteItemServiceAction(item.id)}
                                        aria-hidden
                                    >
                                        <RemoveIcon />
                                    </div>
                                    <input
                                        className={styles['inp-cbx']}
                                        id={item.id}
                                        type="checkbox"
                                        style={{ display: 'none' }}
                                        onChange={e =>
                                            e.target.checked
                                                ? setItemsSelect(prevState => [...prevState, item])
                                                : setItemsSelect(prevState =>
                                                      prevState.filter(
                                                          item2 => item2.id !== item.id
                                                      )
                                                  )
                                        }
                                    />
                                    <label className={styles['cbx']} htmlFor={item.id}>
                                        <div
                                            className={`${styles.itemName} w-full flex justify-end`}
                                        >
                                            <div>
                                                <span>
                                                    {
                                                        consumptionData[item.provider].find(
                                                            consumption =>
                                                                consumption.id === item.use_time
                                                        )?.name
                                                    }
                                                </span>
                                            </div>
                                            <div className="max-w-[10%] min-w-[10%] text-left mr-10">
                                                <span>{item.count} عدد</span>
                                            </div>
                                            <div className="max-w-[50%] min-w-[50%] text-left mr-10">
                                                <span>{item.service.name}</span>
                                            </div>
                                        </div>
                                        <span className={styles['checkbox']}>
                                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                                <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                        </span>
                                    </label>
                                </div>
                            )
                    )}
                {getFavoriteServices.isSuccess && isEmpty(getFavoriteServices.data) && (
                    <EmptyState text="اقلامی وجود ندارد" />
                )}
            </div>

            <FixedWrapBottom>
                <div className={styles.actionsWrapper}>
                    <Button size="small" onClick={addItemService}>
                        افزودن
                    </Button>
                </div>
            </FixedWrapBottom>
        </Modal>
    );
};

export default FavoriteFolder;
