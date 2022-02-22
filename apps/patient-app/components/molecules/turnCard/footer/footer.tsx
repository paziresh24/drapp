import Modal from '@paziresh24/components/core/modal';
import { Button } from './../../../atoms/button/button';
import { useState } from 'react';
import ChatIcon from '@paziresh24/components/icons/public/chat';
import Queue from '../../queue';
import { BookStatus } from 'apps/patient-app/types/bookStatus';
import { CenterType } from 'apps/patient-app/types/centerType';

interface TurnFooterProps {
    slug: string;
    status: BookStatus;
    pdfLink: string;
    centerType: CenterType;
}

export const TurnFooter: React.FC<TurnFooterProps> = props => {
    const { slug, status, pdfLink, centerType } = props;
    const [queueModal, setQueueModal] = useState(false);

    const showPrescription = () => {
        window.open(`${process.env.NEXT_PUBLIC_PRESCRIPTION_API}/pdfs/${pdfLink}`);
    };

    const reBook = () => {
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

    if (status === BookStatus.deleted) return null;
    return (
        <>
            {status === BookStatus.not_visited &&
                (centerType === CenterType.consult ? CunsultPrimaryButton : ClinicPrimaryButton)}

            {(status === BookStatus.expired || status === BookStatus.visited) && (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" block={true} onClick={reBook}>
                        دریافت نوبت مجدد
                    </Button>
                    {pdfLink && (
                        <Button
                            variant="secondary"
                            size="sm"
                            block={true}
                            onClick={showPrescription}
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
