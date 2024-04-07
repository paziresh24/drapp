import { Timeit } from 'react-timeit';

export const TimePicker = ({ onChange, value = '00:00' }: any) => {
    return (
        <Timeit
            onChange={time => {
                if (value !== time) onChange(time);
            }}
            defualtValue={value}
        />
    );
};
