import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useDrApp } from '@paziresh24/context/drapp';

const AlertForDuration = () => {
    const [{ doctor: docotorInfo }] = useDrApp();

    const expertiseString = `${docotorInfo.expertises?.[0]?.degree?.name} ${docotorInfo.expertises?.[0]?.expertise?.name}`;

    return (
        <Alert icon={false} className="!bg-[#F3F6F9]">
            <Typography fontSize="0.9rem" fontWeight="medium">
                پزشکان {expertiseString} بطور معمول هر ویزیتشان حدود 10 دقیقه طول می کشد.
            </Typography>
            <Typography fontSize="0.9rem" fontWeight="medium">
                اگر در مطب پروسیجر های درمانی انجام می دهید این زمان را طولانی تر کنید.
            </Typography>
        </Alert>
    );
};

export default AlertForDuration;
