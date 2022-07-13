import Service from '../../../components/activation/service';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import { useDrApp } from '@paziresh24/context/drapp';
import { baseURL } from '@paziresh24/utils/baseUrl';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const activationPaths = {
    office: '/fill-info',
    consult: '/consult/fill-info',
    prescription: '/providers?source=activation'
};

const Activation = () => {
    const router = useHistory();
    const [{ doctor: docotorInfo, centers }] = useDrApp();
    const [selectedService, setSelectedService] = useState<ServicesType[]>([]);

    const handleSelectService = (service: ServicesType) => {
        if (selectedService.includes(service))
            return setSelectedService(selectedService.filter(s => s !== service));
        setSelectedService(prev => [...prev, service]);
    };

    const isClinicActivated =
        centers.find((center: { type_id: number }) => center.type_id === 1)?.is_active_booking ??
        false;

    const handleSubmit = () => {
        const url = activationPaths[selectedService[0]];
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
                <Typography fontSize={14}>
                    {docotorInfo.expertises.length > 0 && (
                        <span className="line-clamp-1">
                            {docotorInfo.expertises[0].alias_title
                                ? docotorInfo.expertises[0].alias_title
                                : `${docotorInfo.expertises[0].degree?.name ?? ''} ${
                                      docotorInfo.expertises[0].expertise?.name ?? ''
                                  }`}
                        </span>
                    )}
                </Typography>
            </Stack>
            <Stack className="p-5">
                <Typography fontSize={14} fontWeight="500">
                    خدماتی که تمایل به فعالسازی آن دارید انتخاب نمایید.
                </Typography>
                <List className="space-y-3 !mt-3">
                    {!isClinicActivated && (
                        <Service
                            title="نوبت دهی مطب"
                            description="مدیریت نوبت دهی بیماران مطب"
                            type="office"
                            selected={selectedService.includes('office')}
                            onSelect={handleSelectService}
                        />
                    )}
                    <Service
                        title="مشاوره آنلاین"
                        description="ویزیت آنلاین بیماران از سراسر دنیا"
                        type="consult"
                        selected={selectedService.includes('consult')}
                        onSelect={handleSelectService}
                    />
                    <Service
                        title="نسخه نویسی آنلاین"
                        description="صدور آنلاین نسخه های بیماران"
                        type="prescription"
                        selected={selectedService.includes('prescription')}
                        onSelect={handleSelectService}
                    />
                </List>
            </Stack>
            <FixedWrapBottom className="border-t border-solid border-[#e8ecf0]">
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
