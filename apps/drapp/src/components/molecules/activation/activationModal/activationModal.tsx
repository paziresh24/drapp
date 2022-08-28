import Modal from '@paziresh24/shared/ui/modal';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useDrApp } from '@paziresh24/context/drapp';
import { useHistory } from 'react-router-dom';

interface ActivationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentType: ServicesType;
}
const servicesList = [
    { text: 'نوبت دهی مطب', type: 'office', url: '/activation/office/center' },
    { text: 'مشاوره آنلاین', type: 'consult', url: '/activation/consult/whatsapp' }
];

export const ActivationModal = ({ isOpen, onClose, currentType }: ActivationModalProps) => {
    const router = useHistory();

    const servicesText = servicesList
        .filter(service => service.type !== currentType)
        .map(service => service.text)
        .join(' یا ');

    const serviceLink =
        servicesList.find(service => service.type !== currentType)?.url ?? servicesList[0].url;

    return (
        <Modal title="" isOpen={isOpen} onClose={onClose}>
            <Typography lineHeight={2}>آیا تمایل به فعال سازی {servicesText} دارید؟</Typography>
            <Stack direction="row" spacing={1}>
                <Button fullWidth variant="contained" onClick={() => router.push(serviceLink)}>
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
