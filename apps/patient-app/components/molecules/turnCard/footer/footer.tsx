import Modal from '@paziresh24/shared/ui/modal';
import { Button } from './../../../atoms/button/button';
import { useState } from 'react';
import ChatIcon from '@paziresh24/shared/icon/public/chat';
import Queue from '../../queue';
import { BookStatus } from 'apps/patient-app/types/bookStatus';
import { CenterType } from 'apps/patient-app/types/centerType';
import { MegaphoneIcon } from '@paziresh24/shared/icon';
import { isToday } from '@paziresh24/shared/utils/isToday';

interface TurnFooterProps {
    id: string;
    slug: string;
    status: BookStatus;
    pdfLink: string;
    centerType: CenterType;
    hasPaging: boolean;
    bookTime: number;
}

export const TurnFooter: React.FC<TurnFooterProps> = props => {
    const { id, slug, status, pdfLink, centerType, hasPaging, bookTime } = props;
    const [queueModal, setQueueModal] = useState(false);

    const isBookForToday = isToday(new Date(bookTime));

    const showPrescription = () => {
        window.open(`${process.env.NEXT_PUBLIC_PRESCRIPTION_API}/pdfs/${pdfLink}`);
    };

    const reBook = () => {
        window.open(`${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/dr/${slug}`);
    };

    const ClinicPrimaryButton = hasPaging && (
        <Button
            variant="secondary"
            size="sm"
            block={true}
            onClick={() => setQueueModal(true)}
            icon={<MegaphoneIcon color="#0077DB" />}
            data-testId="footer__queue_button"
        >
            دریافت شماره نوبت
        </Button>
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
            {status === BookStatus.notVisited &&
                (centerType === CenterType.consult ? CunsultPrimaryButton : ClinicPrimaryButton)}

            {(status === BookStatus.expired ||
                status === BookStatus.visited ||
                status === BookStatus.rejected) && (
                <div className="flex gap-2">
                    {isBookForToday && ClinicPrimaryButton}
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
                noBodyPadding
                noHeader
            >
                <Queue bookId={id} />
            </Modal>
        </>
    );
};

export default TurnFooter;
