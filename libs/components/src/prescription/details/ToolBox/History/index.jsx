import styles from './History.module.scss';
import Button from '@paziresh24/components/core/button';
import { useEffect, useState } from 'react';
import Item from './item';
import { useParams } from 'react-router-dom';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import FixedWrapBottom from '@paziresh24/components/prescription/fixedWrapBottom';
import {
    useGetItemServices,
    useDeletePrescription,
    useGetPrescriptions
} from '@paziresh24/hooks/prescription';
import isEmpty from 'lodash/isEmpty';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { Overlay } from '@paziresh24/components/core/overlay';
import { useLearnTour } from '@paziresh24/hooks/learn';
import { Mobile } from '@paziresh24/hooks/device';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { sendEvent } from '@paziresh24/utils';

const History = ({ isOpen, onClose }) => {
    const { prescriptionId } = useParams();
    const [, setIsOpenToolBox] = useToolBox();
    const [prescriptionInfo] = useSelectPrescription();
    const [prescriptionIds, setPrescriptionIds] = useState([]);
    const getPrescriptions = useGetPrescriptions({
        patientNationalCode: prescriptionInfo.patientNationalCode
    });
    const getItemServices = useGetItemServices({
        prescriptionId: getPrescriptions.isSuccess && getPrescriptions.data.map(item => item.id)
    });
    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);
    const deletePrescription = useDeletePrescription();
    const [dropDownShow, setDropDownShow] = useState(false);

    const [itemsSelect, setItemsSelect] = useState([]);
    const [items, setItems] = useState([]);
    const { tourState, setSteps } = useLearnTour();

    const [isMe, setIsMe] = useState(false);

    useEffect(() => {
        getPrescriptions.refetch();
        sendEvent('clickhistory', 'prescription', 'clickhistory');
    }, []);

    useEffect(() => {
        if (getPrescriptions.isSuccess) {
            getItemServices.refetch();
        }
    }, [getPrescriptions.status]);

    const deletePrescriptionAction = async () => {
        deletePrescription.mutate(deletePrescriptionModal);
    };

    document.querySelector('body').addEventListener('click', () => {
        if (dropDownShow) {
            setDropDownShow(false);
        }
    });
    const [services, setServices] = useServices();

    const addItemService = () => {
        setServices(service => [...service, ...itemsSelect]);
        setIsOpenToolBox(false);

        setItemsSelect([]);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.setting}>
                <span>فقط نسخه های خودم</span>
                <div className={styles.toggle}>
                    <input type="checkbox" id="switch" onChange={() => setIsMe(prev => !prev)} />
                    <label htmlFor="switch">Toggle</label>
                </div>
            </div>
            {getPrescriptions.isSuccess &&
                getItemServices.isSuccess &&
                Array.isArray(getItemServices.data[0]) && (
                    <div className={styles['itemsWrapper']}>
                        {getPrescriptions.data.map(
                            item =>
                                item.insuranceType === prescriptionInfo.insuranceType &&
                                (!isMe
                                    ? getItemServices.data.map(
                                          prescriptions =>
                                              prescriptions.find(
                                                  service => service.prescription_id === item.id
                                              ) && (
                                                  <div key={item.id} className={styles.item}>
                                                      <span className={styles.itemInfo}>
                                                          تجویز شده در{' '}
                                                          {new Date(
                                                              item.created_at
                                                          ).toLocaleDateString('fa')}{' '}
                                                          توسط دکتر{' '}
                                                          {item.doctor_additional_data?.fullName}
                                                      </span>
                                                      {prescriptions.map(
                                                          service =>
                                                              service.prescription_id ===
                                                                  item.id && (
                                                                  <Item
                                                                      itemsSelect={itemsSelect}
                                                                      key={service.id}
                                                                      id={service.id}
                                                                      setItemsSelect={
                                                                          setItemsSelect
                                                                      }
                                                                      service={service}
                                                                      prescription={item}
                                                                  />
                                                              )
                                                      )}
                                                  </div>
                                              )
                                      )
                                    : item.doctor_additional_data?.fullName ===
                                          prescriptionInfo.doctor?.doctor_additional_data
                                              ?.fullName &&
                                      getItemServices.data.map(
                                          prescriptions =>
                                              prescriptions.find(
                                                  service => service.prescription_id === item.id
                                              ) && (
                                                  <div key={item.id} className={styles.item}>
                                                      <div className={styles.itemInfo}>
                                                          <span>
                                                              تجویز شده در{' '}
                                                              {new Date(
                                                                  item.created_at
                                                              ).toLocaleDateString('fa')}
                                                          </span>
                                                      </div>
                                                      {prescriptions.map(
                                                          service =>
                                                              service.prescription_id ===
                                                                  item.id && (
                                                                  <Item
                                                                      key={service.id}
                                                                      id={service.id}
                                                                      itemsSelect={itemsSelect}
                                                                      setItemsSelect={
                                                                          setItemsSelect
                                                                      }
                                                                      service={service}
                                                                      prescription={item}
                                                                  />
                                                              )
                                                      )}
                                                  </div>
                                              )
                                      ))
                        )}

                        {isEmpty(getItemServices.data) && (
                            <div className={styles.emptyState}>
                                <svg
                                    width="72"
                                    height="72"
                                    viewBox="0 0 72 72"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect
                                        x="9"
                                        y="9"
                                        width="54"
                                        height="54"
                                        rx="27"
                                        fill="#27BDA0"
                                        fillOpacity="0.16"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M36 6.25C26.1839 6.25 18.8324 10.3516 13.9895 14.3874C13.1744 15.0667 12.428 15.7458 11.75 16.4059V12C11.75 10.4812 10.5188 9.25 9 9.25C7.48122 9.25 6.25 10.4812 6.25 12V24C6.25 25.5188 7.48122 26.75 9 26.75H19.5C21.0188 26.75 22.25 25.5188 22.25 24C22.25 22.4812 21.0188 21.25 19.5 21.25H14.6931C15.4918 20.4117 16.4312 19.512 17.5105 18.6126C21.6676 15.1484 27.8161 11.75 36 11.75C49.4754 11.75 60.25 22.6012 60.25 36C60.25 49.3929 49.3929 60.25 36 60.25C22.6071 60.25 11.75 49.3929 11.75 36C11.75 34.4812 10.5188 33.25 9 33.25C7.48122 33.25 6.25 34.4812 6.25 36C6.25 52.4305 19.5695 65.75 36 65.75C52.4305 65.75 65.75 52.4305 65.75 36C65.75 19.5754 52.5246 6.25 36 6.25ZM36.75 26C36.75 25.0335 35.9665 24.25 35 24.25C34.0335 24.25 33.25 25.0335 33.25 26V38C33.25 38.5851 33.5424 39.1315 34.0293 39.4561L43.0293 45.4561C43.8335 45.9922 44.92 45.7749 45.4561 44.9707C45.9922 44.1665 45.7749 43.08 44.9707 42.5439L36.75 37.0634V26Z"
                                        fill="#27BDA0"
                                    />
                                </svg>

                                <span>سابقه‌ای برای بیمار در پذیرش24 یافت نشد</span>
                            </div>
                        )}
                    </div>
                )}
            {getPrescriptions.isSuccess &&
                getItemServices.isSuccess &&
                !Array.isArray(getItemServices.data[0]) && (
                    <div className={styles['itemsWrapper']}>
                        <div className={styles.item}>
                            <span className={styles.itemInfo}>
                                تجویز شده در{' '}
                                {new Date(getPrescriptions.data[0].created_at).toLocaleDateString(
                                    'fa'
                                )}{' '}
                                توسط دکتر{' '}
                                {getPrescriptions.data[0]?.doctor_additional_data?.fullName}
                            </span>
                            {getItemServices.data.map(service => (
                                <Item
                                    key={service.id}
                                    id={service.id}
                                    itemsSelect={itemsSelect}
                                    setItemsSelect={setItemsSelect}
                                    service={service}
                                    prescription={getPrescriptions.data[0]}
                                />
                            ))}
                        </div>
                    </div>
                )}

            <Mobile>
                <FixedWrapBottom>
                    <Button block onClick={addItemService}>
                        افزودن اقلام انتخاب شده ({itemsSelect.length})
                    </Button>
                </FixedWrapBottom>
            </Mobile>

            {(getPrescriptions.isError ||
                getPrescriptions.isLoading ||
                getItemServices.isLoading) && (
                <div className={styles['itemsWrapper']}>
                    <Overlay />
                </div>
            )}
        </div>
    );
};

export default History;
