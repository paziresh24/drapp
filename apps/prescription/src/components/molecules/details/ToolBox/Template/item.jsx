import styles from './Template.module.scss';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import { RemoveIcon, ChevronIcon } from '@paziresh24/shared/icon';
import { useDeleteFavoritePrescriptions } from '@paziresh24/hooks/prescription';
import { useTemplateItem } from '@paziresh24/context/prescription/templateItem.context';
import { sendEvent } from '@paziresh24/utils';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const Item = ({ prescription, isOpen, setIsOpen }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services, setServices] = useServices();
    const deleteFavoritePrescriptions = useDeleteFavoritePrescriptions();
    const [templateItem, setTemplateItem] = useTemplateItem();
    const [type, setType] = useSelectType();

    const [, setIsOpenToolBox] = useToolBox();

    const countItem = prescription => {
        let counts = {
            drugs: 0,
            labs: 0,
            imaging: 0,
            paraclinics: 0
        };
        prescription[prescriptionInfo.insuranceType + 'Items'].forEach(item => {
            counts.drugs += serviceTypeList['drugs'][prescriptionInfo.insuranceType].includes(
                +item.service_type
            )
                ? 1
                : 0;
            counts.labs += serviceTypeList['lab'][prescriptionInfo.insuranceType].includes(
                +item.service_type
            )
                ? 1
                : 0;
            counts.imaging += serviceTypeList['imaging'][prescriptionInfo.insuranceType].includes(
                +item.service_type
            )
                ? 1
                : 0;
            counts.paraclinics += serviceTypeList['others'][
                prescriptionInfo.insuranceType
            ].includes(+item.service_type)
                ? 1
                : 0;
        });
        return counts;
    };

    const addPrescriptionAction = prescription => {
        let id = services.length > 0 ? +services[services.length - 1].id : 0;
        const items = [];
        prescription[prescriptionInfo.insuranceType + 'Items'].forEach(item => {
            if (item.service?.deleted === true) {
                return toast.warn(
                    `${item.service.name} به دلیل حذف از دیتابیس ${
                        prescriptionInfo.insuranceType === 'tamin' ? 'تامین اجتماعی' : 'سلامت'
                    }، از لیست تجویز شما حذف شده. درصورت نیاز دارو/خدمت جایگزین را وارد کنید.`,
                    {
                        autoClose: false
                    }
                );
            }

            if (!services.some(service => service.service.id === item.service.id)) {
                id += 1;
                items.push({
                    ...item,
                    id: id,
                    date_do: null
                });
            }
        });
        setServices(prev => [...prev, ...items]);

        setType(
            Object.entries(serviceTypeList).filter(item =>
                item[1][prescriptionInfo.insuranceType].includes(items[0]?.service_type)
            )[0][0]
        );

        sendEvent('clickcollection', 'prescription', 'clickcollection');
        getSplunkInstance().sendEvent({
            group: 'prescription-tool-box',
            type: 'add-service-with-template'
        });

        if (!items.every(item => item.service?.deleted === true))
            toast.success(
                `نسخه ${prescription.name.substr(0, 10)}${
                    prescription.name.length > 10 ? '...' : ''
                } اضافه شد.`
            );
        isMobile && setIsOpenToolBox(false);
    };

    const addItemAction = service => {
        setType(
            Object.entries(serviceTypeList).filter(item =>
                item[1][prescriptionInfo.insuranceType].includes(service?.service_type)
            )[0][0]
        );
        if (services.some(item => item.service.id === service.service.id)) {
            return toast.warn('این آیتم قبلا اضافه شده است.');
        }
        if (service.service?.deleted === true) {
            return toast.warn(
                `${service.service.name} به دلیل حذف از دیتابیس ${
                    prescriptionInfo.insuranceType === 'tamin' ? 'تامین اجتماعی' : 'سلامت'
                }، از لیست تجویز شما حذف شده. درصورت نیاز دارو/خدمت جایگزین را وارد کنید.`,
                {
                    autoClose: false
                }
            );
        }
        setServices(item => [
            ...item,
            {
                ...service,
                item_id: service.service.id,
                id: services.length > 0 ? +services[services.length - 1].id + 1 : 0,
                service_type: service.service_type,
                date_do: null
            }
        ]);

        isMobile && setIsOpenToolBox(false);
    };

    const onClose = () => {
        if (isOpen === prescription.id) {
            setIsOpen(null);
        } else {
            setIsOpen(prescription.id);
        }
    };

    const deleteItemAction = id => {
        setTemplateItem(prev => prev.filter(item => item.id !== id));

        deleteFavoritePrescriptions.mutate(id);
    };

    return (
        <div
            className={`${styles['item']} ${isOpen === prescription.id ? styles.show : ''}`}
            key={prescription.id}
        >
            <div className={styles.prescriptionHeader}>
                <span
                    className={styles['item-text']}
                    onClick={() => addPrescriptionAction(prescription)}
                    aria-hidden
                >
                    {prescription.name}

                    <span className={styles.itemCount}>
                        (
                        {countItem(prescription).drugs > 0 && (
                            <span>{countItem(prescription).drugs}عدد دارو</span>
                        )}
                        {countItem(prescription).labs > 0 && (
                            <span>{countItem(prescription).labs}عدد آزمایش</span>
                        )}
                        {countItem(prescription).imaging > 0 && (
                            <span>{countItem(prescription).imaging}عدد تصویربرداری</span>
                        )}
                        {countItem(prescription).paraclinics > 0 && (
                            <span>{countItem(prescription).paraclinics}عدد پاراکلینیک</span>
                        )}
                        )
                    </span>
                </span>

                <div onClick={onClose} aria-hidden className={styles.toggleButton}>
                    <ChevronIcon
                        dir={isOpen === prescription.id ? 'top' : 'bottom'}
                        color="#3f3f79"
                    />
                </div>
            </div>

            <div
                className={styles['remove']}
                onClick={() => deleteItemAction(prescription.id)}
                aria-hidden
            >
                <RemoveIcon />
            </div>

            <div
                className={`${styles.prescriptionItems} ${
                    isOpen === prescription.id ? styles.show : ''
                }`}
            >
                {prescription[prescriptionInfo.insuranceType + 'Items'].map(item => (
                    <div
                        className={`${styles['item-details']} ${
                            services.some(service => service.service.id === item.service.id)
                                ? styles.disabled
                                : ''
                        }`}
                        key={item.service.id + Math.floor(Math.random() * 100)}
                        onClick={() => addItemAction(item)}
                        aria-hidden
                    >
                        <span className={styles['item-details-text']}>{item.service?.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Item;
