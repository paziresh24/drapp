import { useParams, useHistory } from 'react-router-dom';

import styles from './addTemplates.module.scss';
import Button from '@paziresh24/components/core/button';
import TextField from '@paziresh24/components/core/textField';
import { useRef, useState } from 'react';
import { Tab, Tabs } from '@paziresh24/components/core/tab';
import LabsList from '@paziresh24/components/prescription/details/lists/lab.list';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';

import DrugDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Drugs';
import ImagingDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Imaging';
import LabsDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Labs';
import OthersDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Others';
import { Overlay } from '@paziresh24/components/core/overlay';
import {
    useDeleteFavoritePrescriptions,
    usePostFavoritePrescriptions
} from '@paziresh24/hooks/prescription';
import emptyState from '@paziresh24/components/prescription/templates/assets/empty_state.png';
import { isMobile } from 'react-device-detect';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom/index';
import { toast } from 'react-toastify';

const EditTemplates = () => {
    const history = useHistory();
    const [salamatItems, setSalamatItems] = useState([]);
    const [taminItems, setTaminItems] = useState([]);
    const [type, setType] = useState('drugs');
    const [insuranceType, setInsuranceType] = useState('tamin');
    const postFavoritePrescriptions = usePostFavoritePrescriptions();
    const prescriptionNameRef = useRef();
    const [prescriptionNameError, setPrescriptionNameError] = useState(false);

    const edit = () => {
        if (!prescriptionNameRef.current.value) {
            setPrescriptionNameError(true);
            return toast.warn('لطفا یک نام برای نسخه وارد کنید.');
        }
        if (!salamatItems.length && !taminItems.length) {
            return toast.warn(
                'حداقل یک خدمت یا دارو از بیمه سلامت یا تامین اجتماعی باید اضافه شود.'
            );
        }
        postFavoritePrescriptions.mutate(
            {
                name: prescriptionNameRef.current.value,
                salamatItems: salamatItems.filter(item => item.item_id !== null),
                taminItems: taminItems.filter(item => item.item_id !== null)
            },
            {
                onSuccess: data => {
                    history.push(`/favorite/templates`);
                }
            }
        );
    };

    const getNumberBadge = type => {
        if (insuranceType === 'salamat') {
            return salamatItems.filter(service =>
                serviceTypeList[type][insuranceType].includes(+service.service_type)
            ).length;
        } else {
            return taminItems.filter(service =>
                serviceTypeList[type][insuranceType].includes(+service.service_type)
            ).length;
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.templatesWrapper}>
                <div
                    className="w-full flex justify-between items-center"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '1.5rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            error={prescriptionNameError}
                            onFocus={() => setPrescriptionNameError(false)}
                            label="نام نسخه"
                            ref={prescriptionNameRef}
                        />
                        <div className={styles.providerWrapper}>
                            <button
                                className={`${styles.providerButton} ${
                                    insuranceType === 'tamin' ? styles.selected : ''
                                }`}
                                onClick={() => setInsuranceType('tamin')}
                            >
                                تامین اجتماعی
                            </button>
                            <button
                                className={`${styles.providerButton} ${
                                    insuranceType === 'salamat' ? styles.selected : ''
                                }`}
                                onClick={() => setInsuranceType('salamat')}
                            >
                                سلامت
                            </button>
                        </div>
                    </div>
                    {!isMobile && (
                        <Button
                            size="medium"
                            onClick={edit}
                            loading={postFavoritePrescriptions.isLoading}
                        >
                            ذخیره نسخه پراستفاده
                        </Button>
                    )}
                    {isMobile && (
                        <FixedWrapBottom>
                            <Button
                                block
                                size="medium"
                                onClick={edit}
                                loading={postFavoritePrescriptions.isLoading}
                            >
                                ذخیره نسخه پراستفاده
                            </Button>
                        </FixedWrapBottom>
                    )}
                </div>
                <Tabs onChange={tab => setType(tab)}>
                    <Tab keyTab="drugs" title="تجویز دارو" numberBadge={getNumberBadge('drugs')}>
                        <DrugDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            insuranceType={insuranceType}
                            noDate={true}
                        />
                    </Tab>
                    <Tab
                        keyTab="lab"
                        title="آزمایشگاه"
                        id="lab_tab_step"
                        numberBadge={getNumberBadge('lab')}
                    >
                        <LabsDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            noDate={true}
                            insuranceType={insuranceType}
                        />
                    </Tab>
                    <Tab
                        keyTab="imaging"
                        title="تصویربرداری"
                        numberBadge={getNumberBadge('imaging')}
                    >
                        <ImagingDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            insuranceType={insuranceType}
                            noDate={true}
                        />
                    </Tab>
                    <Tab
                        keyTab="others"
                        title="پاراکلینیک"
                        id="other_tab_step"
                        numberBadge={getNumberBadge('others')}
                    >
                        <OthersDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            insuranceType={insuranceType}
                            noDate={true}
                        />
                    </Tab>
                </Tabs>
            </div>
            <div
                className={styles.templatesWrapper}
                style={{ padding: '0.8rem', paddingTop: '0.2rem' }}
            >
                <LabsList
                    noDate={true}
                    services={insuranceType === 'salamat' ? salamatItems : taminItems}
                    setServices={insuranceType === 'salamat' ? setSalamatItems : setTaminItems}
                    type={type}
                    insuranceType={insuranceType}
                    noFavorite={true}
                />
                {insuranceType === 'tamin'
                    ? !taminItems.some(service =>
                          serviceTypeList[type][insuranceType].includes(service.service_type)
                      ) && (
                          <div
                              style={{
                                  margin: '0 auto',
                                  padding: '10rem',
                                  display: 'flex',
                                  gap: '2rem',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                              }}
                          >
                              <img src={emptyState} alt="" style={{ width: '6rem' }} />
                              <span
                                  style={{
                                      fontSize: '1.4rem',
                                      fontWeight: '500',
                                      opacity: '0.7'
                                  }}
                              >
                                  خدمتی در این دسته بندی وجود ندارد.
                              </span>
                          </div>
                      )
                    : !salamatItems.some(service =>
                          serviceTypeList[type][insuranceType].includes(service.service_type)
                      ) && (
                          <div
                              style={{
                                  margin: '0 auto',
                                  padding: '10rem',
                                  display: 'flex',
                                  gap: '2rem',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                              }}
                          >
                              <img src={emptyState} alt="" style={{ width: '6rem' }} />
                              <span
                                  style={{
                                      fontSize: '1.4rem',
                                      fontWeight: '500',
                                      opacity: '0.7'
                                  }}
                              >
                                  خدمتی در این دسته بندی وجود ندارد.
                              </span>
                          </div>
                      )}
            </div>
        </div>
    );
};

export default EditTemplates;
