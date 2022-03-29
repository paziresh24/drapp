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
import Select from '@paziresh24/components/doctorApp/Select';
import { useConsult } from '@paziresh24/context/drapp/consult';
import { digitsFaToEn } from '@paziresh24/utils';
import { InfoIcon } from '@paziresh24/components/icons';
var first = 1;
function moneyCommaSep(ctrl) {
    if (first > 1) {
        ctrl = ctrl.replace(' تومان', '');
    }
    var separator = ',';
    var int = ctrl.replace(new RegExp(separator, 'g'), '');
    var regexp = new RegExp('\\B(\\d{3})(' + separator + '|$)');
    do {
        int = int.replace(regexp, separator + '$1');
    } while (int.search(regexp) >= 0);
    ctrl = int;
    first += 1;

    return ctrl + ' تومان';
}
function moneyBackSpace(ctrl) {
    ctrl = ctrl.replace(' توما', '');
    ctrl = ctrl.substr(0, ctrl.length - 1);
    return ctrl + ' تومان';
}

function normalPrice(ctrl) {
    ctrl = ctrl.replace(' تومان', '');
    ctrl = ctrl.replace(',', '');
    ctrl += '0';
    return ctrl;
}

const CenterInfo = () => {
    const [info] = useDrApp();
    const centerInfoUpdate = useCenterInfoUpdate();
    const [countVisitDaily, setCountVisitDaily] = useState();
    const [costVisit, setCostVisit] = useState();
    const [whatsAppCell, setWhatsAppCell] = useState();
    const [consult, setConsult] = useConsult();

    const history = useHistory();
    var days = [
        { id: '1', name: 'تا 1 روز' },
        { id: '2', name: 'تا 2 روز' },
        { id: '3', name: 'تا 3 روز' }
    ];
    const updateCenter = () => {
        if (!whatsAppCell) {
            return toast.error('شماره whatsapp business الزامی می باشد');
        }
        if (!costVisit) {
            return toast.error('مبلغ هر ویزیت الزامی میباشد');
        }

        setConsult({
            ...consult,
            whatsapp: digitsFaToEn(whatsAppCell.replace(/^0+/, '')),
            price: costVisit,
            service_length: countVisitDaily
        });

        history.push('/consult/fill-info/expertises');
    };

    return (
        <div className={styles['wrapper']}>
            <div className={styles['register-form']}>
                <div className={styles['form-control']}>
                    <div className="flex space-s-2 w-full">
                        <div className="flex flex-col w-full space-y-3">
                            <span>مدت زمان پاسخگویی پزشک</span>

                            <Select
                                placeholder="تا 2 روز"
                                onChange={value => {
                                    if (value) {
                                        setCountVisitDaily(value.id);
                                    }
                                }}
                                items={days.map(item => ({
                                    name: item.name,
                                    value: item.id
                                }))}
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
                                placeHolder="50,000 تومان"
                                unit="تومان"
                                type="Text"
                                onChange={e => {
                                    if (e.nativeEvent.inputType === 'insertText') {
                                        e.target.value = moneyCommaSep(e.target.value);
                                    } else if (
                                        e.nativeEvent.inputType === 'deleteContentBackward'
                                    ) {
                                        e.target.value = moneyBackSpace(e.target.value);
                                    }
                                    setCostVisit(normalPrice(e.target.value));
                                }}
                            />
                        </div>
                    </div>

                    <TextField
                        label="شماره whatsapp business"
                        type="tel"
                        onChange={e => setWhatsAppCell(e.target.value)}
                    />
                </div>
                <div className="bg-[#eaf0f4] rounded-lg p-5 flex flex-col space-y-3">
                    <span className="text-[#586a79] text-2xl leading-[3rem]">
                        <InfoIcon color="#586a79" className="inline-block ml-3" />
                        لازم به ذکر است که این شماره در دسترس بیماران قرار خواهد گرفت.
                    </span>
                    <span className="font-medium text-[#586a79] text-2xl">
                        این شماره می تواند شماره مطب شما، شماره موبایل و یا هر شماره ای که قادر به
                        نصب واتس اپ بیزینس روی آن هستید، باشد.
                    </span>
                </div>
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
