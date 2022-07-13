import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { CheckIcon } from '@paziresh24/shared/icon';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { useWorkHoursStore } from 'apps/drapp/src/store/workhours.store';
import { weekDays } from '../../../constants/weekDays';

interface Props {
    onChange: Dispatch<SetStateAction<DayIds[]>>;
    selectedDays: DayIds[];
}

const SelectDay = (props: Props) => {
    const { onChange: setSelectedDays, selectedDays } = props;
    const isAnotherProvider = useWorkHoursStore(state => state.isAnotherProvider);

    const handleSelctedDuration = useCallback(
        (dayId: DayIds) => {
            if (selectedDays.includes(dayId)) {
                return setSelectedDays(prev => prev.filter(id => id !== dayId));
            }
            setSelectedDays(prev => [...prev, dayId]);
        },
        [selectedDays]
    );

    const isDaySelected = (dayId: DayIds) => selectedDays.includes(dayId);

    return (
        <FormControl className="space-y-4">
            {isAnotherProvider && (
                <Alert icon={false} className="!bg-[#F9F7F3]">
                    <p className="text-sm font-medium text-[#755F3E]">
                        برای عدم تداخل نوبت ها، زمان هایی را انتخاب کنید که با نوبت های حضوری و
                        پلتفرم های دیگر تداخل نداشته باشد.
                    </p>
                </Alert>
            )}
            <FormLabel focused={false}>روزهای کاری</FormLabel>
            <Stack direction="row-reverse" gap={1.5} className="mt-5 flex-wrap">
                {weekDays.map(day => (
                    <Chip
                        key={day.id}
                        label={day.name}
                        variant="outlined"
                        icon={
                            isDaySelected(day.id) ? (
                                <CheckIcon className="!mr-2 fill-primary" />
                            ) : undefined
                        }
                        color={isDaySelected(day.id) ? 'primary' : 'default'}
                        onClick={() => handleSelctedDuration(day.id)}
                    />
                ))}
            </Stack>
        </FormControl>
    );
};

export default memo(SelectDay);
