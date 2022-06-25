import Modal from '@paziresh24/shared/ui/modal';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';

interface ActivationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentType: ServicesType;
}
const servicesList = [
    { text: 'مشاوره آنلاین', type: 'consult' },
    { text: 'نسخه نویسی', type: 'prescription' },
    { text: 'نوبت دهی مطب', type: 'office' }
];

export const ActivationModal = ({ isOpen, onClose, currentType }: ActivationModalProps) => {
    const [{ centers }] = useDrApp();

    const isClinicActivated = centers.find(
        (center: { type_id: number }) => center.type_id === 1
    )?.is_active_booking;

    const servicesText = servicesList
        .filter(
            service =>
                service.type !== currentType && (!isClinicActivated || service.type !== 'office')
        )
        .map(service => service.text)
        .join(' یا ');

    return (
        <Modal title="یه سوال!" isOpen={isOpen} onClose={onClose}>
            <Typography lineHeight={2}>آیا تمایل به فعال سازی {servicesText} دارید؟</Typography>
            <Stack direction="row" spacing={1}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => window.location.assign('/activation')}
                >
                    بله
                </Button>
                <Button fullWidth variant="outlined" onClick={onClose}>
                    خیر
                </Button>
            </Stack>
        </Modal>
    );
};

export default ActivationModal;
