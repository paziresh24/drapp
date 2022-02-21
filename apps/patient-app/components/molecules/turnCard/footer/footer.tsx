import Modal from '@paziresh24/components/core/modal';
import { Button } from './../../../atoms/button/button';
import { useState } from 'react';
import MegaphoneIcon from '@paziresh24/components/icons/public/megaphone';
import ChatIcon from '@paziresh24/components/icons/public/chat';

import Queue from '../../queue';

interface TurnFooterProps {
    slug: string;
    status: 'expired' | 'deleted' | 'not_visited' | 'visited';
    pdfLink: string;
    centerType: 'clinic' | 'hospital' | 'consult';
}

export const TurnFooter: React.FC<TurnFooterProps> = props => {
    const { slug, status, pdfLink, centerType } = props;
    const [queueModal, setQueueModal] = useState(false);

    const prescriptionAction = () => {
        window.open(`${process.env.NEXT_PUBLIC_PRESCRIPTION_API}/pdfs/${pdfLink}`);
    };

    const getTurnAgainAction = () => {
        window.open(`${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/dr/${slug}`);
    };

    const ClinicPrimaryButton = (
        <></>
        // <Button
        //     variant="secondary"
        //     size="sm"
        //     block={true}
        //     onClick={() => setQueueModal(true)}
        //     icon={<MegaphoneIcon color="#0077DB" />}
        // >
        //     دریافت شماره نوبت
        // </Button>
    );

    const CunsultPrimaryButton = (
        <Button
            variant="secondary"
            size="sm"
            block={true}
            onClick={() =>
                window.open(`${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/panel/user/#consult`)
            }
            icon={<ChatIcon color="#0077DB" />}
        >
            گفتگو با پزشک
        </Button>
    );

    if (status === 'deleted') return null;
    return (
        <>
            {status === 'not_visited' &&
                (centerType === 'consult' ? CunsultPrimaryButton : ClinicPrimaryButton)}

            {(status === 'expired' || status === 'visited') && (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" block={true} onClick={getTurnAgainAction}>
                        دریافت نوبت مجدد
                    </Button>
                    {pdfLink && (
                        <Button
                            variant="secondary"
                            size="sm"
                            block={true}
                            onClick={prescriptionAction}
                        >
                            مشاهده نسخه
                        </Button>
                    )}
                </div>
            )}

            <Modal
                title="شماره نوبت شما"
                onClose={setQueueModal}
                isOpen={queueModal}
                noBodyPad
                noHeader
            >
                <Queue />
            </Modal>
        </>
    );
};

export default TurnFooter;
