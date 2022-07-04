import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { useRef, useState } from 'react';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { useCenterInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { HelpIcon } from '@paziresh24/shared/icon/public/help';
import Select from '@paziresh24/shared/ui/select';
import PriceField from '@paziresh24/shared/ui/priceField';
import { useConsult } from '@paziresh24/context/drapp/consult';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';
import { InfoIcon } from '@paziresh24/shared/icon';
import Container from '@mui/material/Container';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { removeCommas } from '@persian-tools/persian-tools';

const CenterInfo = () => {
    const [info] = useDrApp();
    const centerInfoUpdate = useCenterInfoUpdate();
    const [countVisitDaily, setCountVisitDaily] = useState();
    const [costVisit, setCostVisit] = useState();
    const [whatsAppCell, setWhatsAppCell] = useState();
    const [consult, setConsult] = useConsult();

    const history = useHistory();
    var days = useRef([
        { value: '1', name: 'تا 1 روز' },
        { value: '2', name: 'تا 2 روز' },
        { value: '3', name: 'تا 3 روز' }
    ]);
    const updateCenter = () => {
        if (!whatsAppCell) {
            return toast.error('شماره whatsapp business الزامی می باشد');
        }
        if (!costVisit) {
            return toast.error('مبلغ هر ویزیت الزامی میباشد');
        }
        if (costVisit <= 1000) {
            return toast.error('مبلغ باید بیشتر از 1000 تومان باشد.');
        }
        getSplunkInstance().sendEvent({
            group: 'center_info_consult',
            type: 'successful'
        });
        getSplunkInstance().sendEvent({
            group: 'center_info_consult',
            type: 'days',
            event: {
                days: countVisitDaily ?? '2'
            }
        });
        getSplunkInstance().sendEvent({
            group: 'center_info_consult',
            type: 'pricing',
            event: {
                price: costVisit
            }
        });

        setConsult({
            ...consult,
            whatsapp: digitsFaToEn(whatsAppCell.replace(/^0+/, '')),
            price: costVisit * 10,
            service_length: countVisitDaily ?? '2'
        });

        history.push('/consult/fill-info/expertises');
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md"
        >
            {' '}
            <div className={styles['register-form']}>
                <div className={styles['form-control']}>
                    <div className="flex space-s-2 w-full">
                        <div className="flex flex-col w-full space-y-3">
                            <span className="text-sm">مدت زمان پاسخگویی پزشک</span>

                            <Select
                                placeholder="تا 2 روز"
                                onChange={value => {
                                    if (value) {
                                        setCountVisitDaily(value.id);
                                    }
                                }}
                                items={days.current}
                            />
                        </div>

                        <PriceField
                            label="مبلغ هر ویزیت (تومان)"
                            onChange={value => setCostVisit(removeCommas(value))}
                            value={costVisit}
                            limit={7}
                        />
                    </div>

                    <TextField
                        label="شماره whatsapp business"
                        type="tel"
                        onChange={e => setWhatsAppCell(e.target.value)}
                    />
                </div>
                <div className="bg-gray-100 rounded-lg p-5 flex flex-col space-y-3 text-sm">
                    <span className="text-gray-500">
                        <InfoIcon color="#586a79" className="inline-block ml-2" />
                        لازم به ذکر است که این شماره در دسترس بیماران قرار خواهد گرفت.
                    </span>
                    <span className="font-medium text-gray-500">
                        این شماره می تواند شماره مطب شما، شماره موبایل و یا هر شماره ای که قادر به
                        نصب واتس اپ بیزینس روی آن هستید، باشد.
                    </span>
                    <span className="font-medium text-gray-500">
                        هفتاد درصد از مبلغ هر ویزیت به پزشک تعلق دارد.
                    </span>
                </div>
                <FixedWrapBottom>
                    <Button onClick={updateCenter} loading={centerInfoUpdate.isLoading} block>
                        مرحله بعدی
                    </Button>
                </FixedWrapBottom>
            </div>
        </Container>
    );
};

export { CenterInfo };
