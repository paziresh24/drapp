import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import TextField from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { useState } from 'react';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom';
import { useCenterInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { HelpIcon } from '@paziresh24/components/icons/public/help';
import { useConsult } from '@paziresh24/context/drapp/consult';

const CenterInfo = () => {
    const [info] = useDrApp();
    const centerInfoUpdate = useCenterInfoUpdate();
    const [countVisitDaily, setCountVisitDaily] = useState();
    const [costVisit, setCostVisit] = useState();
    const [whatsAppCell, setWhatsAppCell] = useState();
    const [, setConsult] = useConsult();

    const history = useHistory();

    const updateCenter = () => {
        if (!whatsAppCell) {
            return toast.error('شماره whatsapp business الزامی می باشد');
        }
        if (!costVisit) {
            return toast.error('مبلغ هر ویزیت الزامی میباشد');
        }

        setConsult({
            whatsapp: whatsAppCell,
            price: costVisit,
            turn_num: countVisitDaily
        });
        history.push('/consult/fill-info/expertises');
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['register-form']}>
                <div className={styles['form-control']}>
                    <div className="flex space-s-2 w-full">
                        <div className="flex flex-col w-full space-y-3">
                            <span>حداکثر تعداد ویزیت روزانه</span>

                            <TextField
                                placeHolder="12 تا"
                                type="Number"
                                onChange={e => setCountVisitDaily(e.target.value)}
                            />
                        </div>

                        <ReactTooltip id="centerSelect" place="top" type="dark" effect="solid">
                            هفتاد درصد از این مبلغ به پزشک تعلق دارد
                        </ReactTooltip>
                        <div className="flex flex-col w-full space-y-3">
                            <div className="flex space-s-2">
                                <span className="inline">مبلغ هر ویزیت</span>
                                <HelpIcon color="#3f4079" data-tip data-for="centerSelect" />
                            </div>

                            <TextField
                                placeHolder="50000 تومان"
                                type="Number"
                                onChange={e => setCostVisit(e.target.value)}
                            />
                        </div>
                    </div>

                    <TextField
                        label="شماره whatsapp business"
                        type="tel"
                        onChange={e => setWhatsAppCell(e.target.value)}
                    />
                </div>
                <span className="!mb-5 opacity-70">
                    این شماره می تواند شماره مطب شما، شماره موبایل و یا هر شماره ای که قادر به نصب
                    واتس اپ بیزینس روی آن هستید، باشد.
                </span>
                <FixedWrapBottom>
                    <Button onClick={updateCenter} loading={centerInfoUpdate.isLoading} block>
                        مرحله بعدی
                    </Button>
                </FixedWrapBottom>
            </div>
        </div>
    );
};

export { CenterInfo };