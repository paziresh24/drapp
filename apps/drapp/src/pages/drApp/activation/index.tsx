import Service from '../../../components/molecules/activation/service';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import { useDrApp } from '@paziresh24/context/drapp';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useActivationStore } from './activation.store';

enum ActivationPaths {
    office = '/activation/office/center',
    consult = '/activation/consult/whatsapp'
}

const Activation = () => {
    const router = useHistory();
    const [{ doctor: docotorInfo, centers }] = useDrApp();
    const selectedService = useActivationStore(state => state.selectedService);
    const setSelectedService = useActivationStore(state => state.setSelectedService);

    const handleSelectService = (service: ServicesType) => {
        if (selectedService.includes(service))
            return setSelectedService(() => selectedService.filter(s => s !== service));
        setSelectedService(prev => [...prev, service]);
    };

    const handleSubmit = () => {
        const url = ActivationPaths[selectedService[0]];
        selectedService.forEach(service => {
            getSplunkInstance().sendEvent({
                group: 'register',
                type: `register-${service}`
            });
        });
        router.push(url);
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full !p-0 md:h-auto md:bg-white md:!p-5 rounded-md pt-4 md:mt-8 md:shadow-md"
        >
            <Stack
                justifyContent="center"
                alignItems="center"
                height="14rem"
                bgcolor="#fff"
                spacing={1}
            >
                <Avatar
                    src={docotorInfo?.image && baseURL('UPLOADER') + docotorInfo?.image}
                    sx={{ width: 90, height: 90 }}
                />
                <Typography fontWeight="500">
                    {docotorInfo.name} {docotorInfo.family}
                </Typography>
                {docotorInfo.expertises.length > 0 && (
                    <Typography fontSize={14} className="line-clamp-1">
                        {docotorInfo.expertises[0].alias_title
                            ? docotorInfo.expertises[0].alias_title
                            : `$
                        {docotorInfo.expertises[0].degree?.name ?? ''} $
                        {docotorInfo.expertises[0].expertise?.name ?? ''}`}
                    </Typography>
                )}
            </Stack>
            <Stack className="p-5">
                <Typography fontSize={14} fontWeight="500">
                    خدماتی که تمایل به فعالسازی آن دارید انتخاب نمایید.
                </Typography>
                <List className="space-y-3 !mt-3">
                    <Service
                        title="نوبت دهی مطب"
                        description="مدیریت نوبت دهی بیماران مطب"
                        type="office"
                        selected={selectedService.includes('office')}
                        onSelect={handleSelectService}
                    />
                    <Service
                        title="مشاوره آنلاین"
                        description="ویزیت آنلاین بیماران از سراسر دنیا"
                        type="consult"
                        selected={selectedService.includes('consult')}
                        onSelect={handleSelectService}
                    />
                </List>
            </Stack>
            <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]">
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={!selectedService}
                >
                    مرحله بعدی
                </Button>
            </FixedWrapBottom>
        </Container>
    );
};

export default Activation;
