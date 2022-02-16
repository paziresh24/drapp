import { useState } from 'react';
import Modal from '@paziresh24/components/core/modal';
import DoctorInfo from '../../doctorInfo';
import TagStatus from '../../tagStatus';
import DropDown from '../../../atoms/dropDown';
import Button from '../../../atoms/button';
import { useBookStore } from '../../../../store';
import { useRemoveBook } from '../../../../apis/removeBook/useRemoveBook.hook';
import ShareIcon from '@paziresh24/components/icons/public/share';
import TrashIcon from '@paziresh24/components/icons/public/trash';
import ThreeDotsIcon from '@paziresh24/components/icons/public/threeDots';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

interface TurnHeaderProps {
    id: string;
    doctorInfo: {
        avatar: string;
        firstName: string;
        lastName: string;
        expertise: string;
        slug: string;
    };
    centerId: string;
    nationalCode: string;
    trackingCode: string;
    status: 'expired' | 'deleted' | 'not_visited' | 'visited';
}

export const TurnHeader: React.FC<TurnHeaderProps> = props => {
    const { id, doctorInfo, centerId, trackingCode, nationalCode, status } = props;

    const [removeModal, setRemoveModal] = useState(false);
    const { removeBook } = useBookStore();
    const removeBookApi = useRemoveBook();

    const removeBookAction = () => {
        removeBookApi.mutate(
            {
                center_id: centerId,
                reference_code: trackingCode,
                national_code: nationalCode
            },
            {
                onSuccess: data => {
                    if (data.data.status === 1) {
                        setRemoveModal(false);
                        return removeBook({ bookId: id });
                    }
                    toast.error(data.data.message);
                }
            }
        );
    };

    const shareTurn = () => {
        if (navigator.share)
            navigator.share({
                text: `رسید نوبت ${doctorInfo.firstName} ${doctorInfo.lastName}`,
                url: `https://www.paziresh24.com/booking/${doctorInfo.slug}?id=${id}&center_id=${centerId}`
            });
    };

    return (
        <>
            <DoctorInfo
                avatar={doctorInfo.avatar}
                firstName={doctorInfo.firstName}
                lastName={doctorInfo.lastName}
                expertise={doctorInfo.expertise}
            />

            <TagStatus status={status} />

            {status === 'not_visited' && (
                <DropDown
                    element={
                        <div className="flex items-center justify-center w-8 h-8 absolute left-2 top-3 cursor-pointer">
                            <ThreeDotsIcon color="#000" />
                        </div>
                    }
                    items={[
                        {
                            id: 0,
                            name: 'اشتراک گذاری',
                            icon: <ShareIcon />,
                            action: shareTurn
                        },
                        {
                            id: 1,
                            name: 'حذف نوبت',
                            icon: <TrashIcon />,
                            action: () => setRemoveModal(true)
                        }
                    ]}
                />
            )}

            <Modal
                title="آیا از حدف نوبت مطمئن هستید؟"
                onClose={setRemoveModal}
                isOpen={removeModal}
                maxWidth={!isMobile && '25rem'}
            >
                <div className="flex space-s-2">
                    <Button
                        theme="error"
                        block
                        onClick={removeBookAction}
                        loading={removeBookApi.isLoading}
                    >
                        حذف
                    </Button>
                    <Button
                        theme="error"
                        variant="secondary"
                        block
                        onClick={() => setRemoveModal(false)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default TurnHeader;
