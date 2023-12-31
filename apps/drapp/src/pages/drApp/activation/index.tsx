import Service from '../../../components/activation/service';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { useDrApp } from '@paziresh24/context/drapp';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useActivationStore } from './activation.store';

enum ActivationPaths {
    office = '/activation/office/center',
    consult = '/activation/consult/rules'
}

const Activation = () => {
    const router = useHistory();
    const [{ doctor: docotorInfo }] = useDrApp();
    const selectedService = useActivationStore(state => state.selectedService);
    const setSelectedService = useActivationStore(state => state.setSelectedService);

    const handleSelectService = (service: ServicesType) => {
        if (selectedService.includes(service))
            return setSelectedService(() => selectedService.filter(s => s !== service));
        setSelectedService(prev => [...prev, service]);

        getSplunkInstance().sendEvent({
            group: 'activation',
            type: `click-${service}`
        });

        router.push(ActivationPaths[selectedService[0] ?? service]);
    };

    return (
        <Container
            maxWidth="sm"
            className="h-full !p-0 md:h-auto md:bg-white md:!p-5 rounded-md pt-4 md:mt-14 md:shadow-2xl md:shadow-slate-300"
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
                <Button variant="outlined" size="small" onClick={() => router.push('/profile')}>
                    ویرایش پروفایل
                </Button>
            </Stack>
            <Stack className="p-5">
                <List className="space-y-3 !mt-3">
                    <Service
                        title="نوبت دهی مطب"
                        description="مدیریت نوبت دهی بیماران مطب"
                        type="office"
                        selected={selectedService.includes('office')}
                        onSelect={handleSelectService}
                    />
                    <Service
                        title="ویزیت آنلاین"
                        description="ظرفیت پزشکان ویزیت آنلاین تکمیل شده است."
                        type="consult"
                        selected={selectedService.includes('consult')}
                        onSelect={handleSelectService}
                        status="disable"
                    />
                </List>
            </Stack>
        </Container>
    );
};

export default Activation;
