import styles from './details.module.scss';
import Instructions from '../../atom/Instructions';
import Amounts from '../../atom/Amounts';
import SearchFiled from '../../atom/SearchFiled';
import Consumption from '../../atom/Consumption';
import Button from '@paziresh24/components/core/button';
import { useState, useEffect, useRef } from 'react';
import { useServices } from '@paziresh24/context/prescription/services-context';
import TextArea from '@paziresh24/components/core/textArea';
import { useAddFavoriteServices } from '@paziresh24/hooks/prescription';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';

import { toast } from 'react-toastify';
import { MinusLineIcon, PlusLineIcon } from '@paziresh24/components/icons';
import Count from '../../atom/Count';
import { useGetBrands } from '@paziresh24/hooks/prescription/types';
import Brands from '../../atom/Brands';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { isMobile } from 'react-device-detect';
import StarService from './../../atom/starService';
import SelectDate from '../../../selectDate';
import moment from 'jalali-moment';
import { utils } from '@hassanmojab/react-modern-calendar-datepicker';
import isEmpty from 'lodash/isEmpty';

const DrugsDetails = ({ services, setServices, insuranceType, noDate = false }) => {
    const [isOpen, setIsOpen] = useToolBox();
    const detailsRef = useRef();

    const [item, selectItem] = useState();
    const [count, setCount] = useState(item?.defaultValue?.count);
    const [consumption, setConsumption] = useState();
    const [instructions, setInstructions] = useState();
    const [amounts, setAmounts] = useState();
    const [description, setDescription] = useState();
    const [brand, setBrand] = useState();
    const [repeat, setRepeat] = useState(1);
    const [date, setDate] = useState();
    const getBrands = useGetBrands({
        service: item?.id
    });

    const addFavoriteServices = useAddFavoriteServices();

    const [brands, setBrands] = useState([]);
    const [showBrands, setShowBrands] = useState(false);

    const [showDescription, setShowDescription] = useState(false);

    // validation error
    const [searchFiledError, setSearchFiledError] = useState(false);
    const [consumptionFiledError, setConsumptionFiledError] = useState(false);

    // focus field
    const [countFieldFocus, setCountFieldFocus] = useState(false);
    const [instructionsFiledFocus, setInstructionsFiledFocus] = useState(false);
    const [amountsFiledFocus, setAmountsFiledFocus] = useState(false);

    // const [consumptionFieldFocus, setConsumptionFieldFocus] = useState(false);
    const [instructionsFiledError, setInstructionsFiledError] = useState(false);
    const [amountsFiledError, setAmountsFiledError] = useState(false);
    const [countFiledError, setCountFiledError] = useState(false);

    useEffect(() => {
        getBrands.remove();
        if (item?.id) {
            setBrand(null);
            getBrands.refetch();
            setCount(item?.defaultValue?.count);
        }
    }, [item]);

    useEffect(() => {
        if (getBrands.isSuccess) {
            setBrand(null);
            setBrands(getBrands.data ?? []);
        }
    }, [getBrands.status]);

    const addServiceWithEnterKey = event => {
        if (event.keyCode === 13) {
            var e = event || window.event,
                target = e.target || e.srcElement;

            if (target.tagName.toUpperCase() == 'INPUT') return;
            addServiceAction();
        }
        document.body.removeEventListener('keydown', addServiceWithEnterKey);
    };
    useEffect(() => {
        if (item?.id && count && consumption?.id && instructions?.id && amounts?.id)
            document.body.addEventListener('keydown', addServiceWithEnterKey);
    }, [item, count, consumption?.id, instructions?.id, amounts?.id]);

    const addServiceAction = () => {
        if (!item?.id) {
            setSearchFiledError(true);
            return toast.warn('لطفا یک آیتم انتخاب کنید.');
        }

        if (!count) {
            setCountFiledError(true);
            return toast.warn('لطفا تعداد را وارد نمایید.');
        }

        if (!consumption?.id) {
            setConsumptionFiledError(true);
            return toast.warn('زمان مصرف دارو را انتخاب نمایید.');
        }

        if (!instructions.id) {
            setInstructionsFiledError(true);
            return toast.warn('طریقه مصرف دارو را انتخاب نمایید.');
        }

        if (!amounts.id) {
            setAmountsFiledError(true);
            return toast.warn('مقادیر مصرف دارو را انتخاب نمایید.');
        }
        const dateFormat = date
            ? moment
                  .from(`${date.year}/${date.month}/${date.day}`, 'fa', 'YYYY/MM/DD')
                  .format('YYYY-MM-DD')
            : null;

        if (
            services.find(
                service => service?.service?.id === item?.id && service?.date_do === dateFormat
            )
        ) {
            return toast.warn('این دارو قبلا اضافه شده است.');
        }

        if (item) {
            setServices(service => [
                ...service,
                {
                    id: services.length + 1,
                    item_id: item.id,
                    use_instruction:
                        insuranceType === 'salamat'
                            ? +item?.shape?.id === 9
                                ? amounts?.id
                                : undefined
                            : amounts.id,
                    use_time: consumption?.id,
                    how_to_use: instructions?.id,
                    service: item,
                    count: count,
                    brand: brand?.id,
                    description: description,
                    number_of_period:
                        insuranceType === 'salamat'
                            ? +item?.shape?.id !== 9
                                ? amounts?.id
                                : undefined
                            : +repeat,
                    date_do: dateFormat,
                    service_type: item.serviceType.id
                }
            ]);
            resetForm();
        }
    };

    const resetForm = () => {
        setCount(null);
        setRepeat(1);
        setDescription('');
        selectItem(null);
        setAmounts(null);
        setConsumption(null);
        setInstructions(null);
        setBrand(null);
        setBrands([]);
        setShowBrands(false);
        setShowDescription(false);
        insuranceType === 'salamat' && setDate(utils('fa').getToday());
        addFavoriteServices.reset();
    };

    return (
        <div className={styles.wrapper} ref={detailsRef}>
            <div className={styles.base}>
                <div className="row">
                    <SearchFiled
                        error={searchFiledError}
                        type="drugs"
                        label="... نام یا کد دارو"
                        voiceLabel="دارو"
                        onChange={value => {
                            setSearchFiledError(false);
                            selectItem(value);
                            setCountFieldFocus(true);
                        }}
                        defaultValue={item}
                        insuranceType={insuranceType}
                    />
                    {isMobile && (
                        <div
                            className={styles.toolBoxButton}
                            onClick={() => setIsOpen(true)}
                            aria-hidden
                        >
                            <svg
                                width="27"
                                height="27"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 7V7C2 6.07003 2 5.60504 2.10222 5.22354C2.37962 4.18827 3.18827 3.37962 4.22354 3.10222C4.60504 3 5.07003 3 6 3H7.87868C8.74394 3 9.17658 3 9.57973 3.11492C9.80121 3.17805 10.0147 3.26647 10.2159 3.37843C10.5822 3.58225 10.8882 3.88817 11.5 4.5V4.5C12.1118 5.11183 12.4178 5.41775 12.7841 5.62157C12.9853 5.73353 13.1988 5.82195 13.4203 5.88508C13.8234 6 14.2561 6 15.1213 6H16C18.8284 6 20.2426 6 21.1213 6.87868C22 7.75736 22 9.17157 22 12V14C22 16.8284 22 18.2426 21.1213 19.1213C20.2426 20 18.8284 20 16 20H8C5.17157 20 3.75736 20 2.87868 19.1213C2 18.2426 2 16.8284 2 14V7Z"
                                    fill="#27BDA0"
                                    fillOpacity="0.09"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.00005 2.25005L5.88425 2.25002C5.06629 2.24975 4.50814 2.24957 4.02948 2.37783C2.73538 2.72458 1.72458 3.73538 1.37783 5.02948C1.24957 5.50814 1.24975 6.06629 1.25002 6.88425L1.25005 7.00005V14L1.25005 14.0549C1.25003 15.4225 1.25001 16.5248 1.36657 17.3918C1.48759 18.2919 1.74648 19.0498 2.3484 19.6517C2.95032 20.2536 3.70819 20.5125 4.6083 20.6335C5.47527 20.7501 6.57759 20.7501 7.94518 20.75H8.00005H15H16H16.0549C17.4225 20.7501 18.5248 20.7501 19.3918 20.6335C20.2919 20.5125 21.0498 20.2536 21.6517 19.6517C22.2536 19.0498 22.5125 18.2919 22.6335 17.3918C22.7501 16.5248 22.7501 15.4225 22.75 14.0549V14V12V11.9452C22.7501 10.5776 22.7501 9.47527 22.6335 8.6083C22.5125 7.70819 22.2536 6.95032 21.6517 6.3484C21.0498 5.74648 20.2919 5.48759 19.3918 5.36657C18.5248 5.25001 17.4225 5.25003 16.0549 5.25005L16 5.25005H15.1214C14.2138 5.25005 13.9048 5.24337 13.6259 5.16386C13.4598 5.11651 13.2997 5.0502 13.1488 4.96623C12.8953 4.82521 12.6721 4.61149 12.0304 3.96972L11.9592 3.89847L11.9592 3.89847C11.4162 3.35512 11.04 2.97869 10.5806 2.72309C10.329 2.58313 10.0622 2.47261 9.78538 2.3937C9.2798 2.24958 8.74763 2.24977 7.97947 2.25003L7.87873 2.25005H6.00005ZM4.41771 3.82672C4.67979 3.75649 5.02179 3.75005 6.00005 3.75005H7.87873C8.78633 3.75005 9.09526 3.75673 9.37419 3.83624C9.54029 3.88358 9.70039 3.9499 9.85132 4.03387C10.1048 4.17488 10.328 4.38861 10.9697 5.03038L11.0409 5.10162L11.0409 5.10164C11.5839 5.64498 11.9601 6.02141 12.4195 6.27701C12.6711 6.41697 12.9379 6.52749 13.2147 6.6064C13.7203 6.75051 14.2525 6.75033 15.0206 6.75007L15.1214 6.75005H16C17.4355 6.75005 18.4366 6.75164 19.1919 6.8532C19.9257 6.95185 20.3143 7.1323 20.591 7.40906C20.8678 7.68582 21.0482 8.07439 21.1469 8.80817C21.2485 9.56352 21.25 10.5646 21.25 12V14C21.25 15.4355 21.2485 16.4366 21.1469 17.1919C21.0482 17.9257 20.8678 18.3143 20.591 18.591C20.3143 18.8678 19.9257 19.0482 19.1919 19.1469C18.4366 19.2485 17.4355 19.25 16 19.25H15H8.00005C6.56463 19.25 5.56352 19.2485 4.80817 19.1469C4.07439 19.0482 3.68582 18.8678 3.40906 18.591C3.1323 18.3143 2.95185 17.9257 2.8532 17.1919C2.75164 16.4366 2.75005 15.4355 2.75005 14V7.00005C2.75005 6.02179 2.75649 5.67979 2.82672 5.41771C3.03477 4.64125 3.64125 4.03477 4.41771 3.82672ZM12.3578 8.65448C12.29 8.51897 12.1515 8.43336 12 8.43336C11.8485 8.43336 11.71 8.51897 11.6422 8.65448L10.4833 10.9723L8.18424 11.3555C8.03644 11.3801 7.91481 11.4853 7.86908 11.628C7.82336 11.7706 7.86121 11.9269 7.96716 12.0329L9.68539 13.7511L9.11024 16.2434C9.07541 16.3944 9.13085 16.5518 9.25256 16.6476C9.37426 16.7435 9.54034 16.7604 9.67889 16.6911L12 15.5306L14.3211 16.6911C14.4597 16.7604 14.6257 16.7435 14.7474 16.6476C14.8691 16.5518 14.9246 16.3944 14.8898 16.2434L14.3146 13.7511L16.0328 12.0329C16.1388 11.9269 16.1766 11.7706 16.1309 11.628C16.0852 11.4853 15.9636 11.3801 15.8158 11.3555L13.5167 10.9723L12.3578 8.65448ZM11.1078 11.5122L12 9.72779L12.8922 11.5122C12.9495 11.6267 13.058 11.7069 13.1842 11.7279L14.9175 12.0168L13.5922 13.3422C13.4946 13.4397 13.4542 13.5806 13.4852 13.715L13.9193 15.5958L12.1789 14.7256C12.0663 14.6693 11.9337 14.6693 11.8211 14.7256L10.0807 15.5958L10.5148 13.715C10.5458 13.5806 10.5054 13.4397 10.4078 13.3422L9.08246 12.0168L10.8158 11.7279C10.942 11.7069 11.0505 11.6267 11.1078 11.5122Z"
                                    fill="#27BDA0"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <div className={styles['amount-bar']}>
                    {insuranceType === 'tamin' && (
                        <Count
                            label="دوره تکرار"
                            onChange={value => setRepeat(value)}
                            defaultValue={repeat ?? 1}
                            insuranceType={insuranceType}
                        />
                    )}
                    <Count
                        error={countFiledError}
                        onChange={value => {
                            setCountFiledError(false);
                            setCount(value);
                        }}
                        defaultValue={count}
                        focus={countFieldFocus}
                        setFocus={setCountFieldFocus}
                    />
                    <Consumption
                        error={consumptionFiledError}
                        onChange={value => {
                            setConsumptionFiledError(false);
                            setConsumption(value);
                            value.id && setInstructionsFiledFocus(true);
                        }}
                        defaultValue={item?.defaultValue?.use_time}
                        reset={!consumption}
                        insuranceType={insuranceType}
                    />
                    <Instructions
                        error={instructionsFiledError}
                        onChange={value => {
                            setInstructionsFiledError(false);
                            setInstructions(value);
                            value.id && setAmountsFiledFocus(true);
                        }}
                        defaultValue={item?.defaultValue?.how_to_use}
                        focus={instructionsFiledFocus}
                        setFocus={setInstructionsFiledFocus}
                        insuranceType={insuranceType}
                    />
                    <Amounts
                        error={amountsFiledError}
                        onChange={value => {
                            setAmountsFiledError(false);
                            setAmounts(value);
                        }}
                        defaultValue={item?.defaultValue?.use_instruction}
                        shape={item?.shape?.id}
                        focus={amountsFiledFocus}
                        setFocus={setAmountsFiledFocus}
                        insuranceType={insuranceType}
                    />
                    {insuranceType === 'salamat' && !noDate && (
                        <SelectDate
                            label="تاریخ موثر"
                            onChange={value => setDate(value)}
                            minimumDate={utils('fa').getToday()}
                            today
                            default-value={
                                date
                                    ? moment
                                          .from(
                                              `${date.year}/${date.month}/${date.day}`,
                                              'fa',
                                              'YYYY/MM/DD'
                                          )
                                          .format('YYYY-MM-DD')
                                    : null
                            }
                        />
                    )}
                </div>
            </div>
            {showDescription && (
                <TextArea
                    onChange={value => setDescription(value)}
                    default-value={item?.defaultValue?.description}
                    label="توضیحات"
                />
            )}
            {showBrands && !isEmpty(brands) && (
                <Brands
                    onChange={value => setBrand(value)}
                    items={brands}
                    defaultValue={item?.defaultValue?.brand}
                />
            )}
            <div className={styles.action}>
                <div className={styles.right}>
                    <div
                        className={styles.showDescription}
                        onClick={() => setShowDescription(state => !state)}
                        aria-hidden
                    >
                        {showDescription ? (
                            <MinusLineIcon color="#3F3F79" />
                        ) : (
                            <PlusLineIcon color="#3F3F79" />
                        )}
                        {showDescription ? <span>حذف توضیحات</span> : <span>افزودن توضیحات</span>}
                    </div>
                    {!isEmpty(brands) && (
                        <div
                            className={styles.showDescription}
                            onClick={() => setShowBrands(state => !state)}
                            aria-hidden
                        >
                            {showBrands ? (
                                <MinusLineIcon color="#3F3F79" />
                            ) : (
                                <PlusLineIcon color="#3F3F79" />
                            )}
                            {showBrands ? <span>حذف برند</span> : <span>انتخاب برند</span>}
                        </div>
                    )}
                </div>

                <div className={styles.left}>
                    {/* <StarService
                        service={{
                            use_instruction: amounts?.id,
                            use_time: consumption?.id,
                            how_to_use: instructions?.id,
                            service: item,
                            count: count,
                            description: description,
                            number_of_period: +repeat
                        }}
                    /> */}
                    <Button size="small" onClick={addServiceAction}>
                        افزودن
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DrugsDetails;
