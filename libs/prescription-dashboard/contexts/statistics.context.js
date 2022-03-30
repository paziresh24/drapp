import { createContext, useContext, useMemo, useState } from 'react';

const StatisticsContext = createContext();

const useStatistics = () => {
    const context = useContext(StatisticsContext);
    if (!context) {
        throw new Error(`useStatistics must be used within a StatisticsContext`);
    }

    return context;
};

function StatisticsProvider(props) {
    const [statisticsData, setStatisticsData] = useState([
        {
            gender: 'F',
            total: 1,
            insurance_type: 'salamat',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-05 00:00:00',
            ends_at: '2021-10-05 23:59:59'
        },
        {
            gender: 'M',
            total: 1,
            insurance_type: 'salamat',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-09 00:00:00',
            ends_at: '2021-10-09 23:59:59'
        },
        {
            gender: 'F',
            total: 4,
            insurance_type: 'salamat',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-13 00:00:00',
            ends_at: '2021-10-13 23:59:59'
        },
        {
            gender: 'F',
            total: 1,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-09-28 00:00:00',
            ends_at: '2021-09-28 23:59:59'
        },
        {
            gender: 'M',
            total: 1,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-09-30 00:00:00',
            ends_at: '2021-09-30 23:59:59'
        },
        {
            gender: 'M',
            total: 2,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-03 00:00:00',
            ends_at: '2021-10-03 23:59:59'
        },
        {
            gender: 'M',
            total: 2,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-04 00:00:00',
            ends_at: '2021-10-04 23:59:59'
        },
        {
            gender: 'M',
            total: 1,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-06 00:00:00',
            ends_at: '2021-10-06 23:59:59'
        },
        {
            gender: 'M',
            total: 4,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-07 00:00:00',
            ends_at: '2021-10-07 23:59:59'
        },
        {
            gender: 'M',
            total: 4,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-08 00:00:00',
            ends_at: '2021-10-08 23:59:59'
        },
        {
            gender: 'F',
            total: 9,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-09 00:00:00',
            ends_at: '2021-10-09 23:59:59'
        },
        {
            gender: 'M',
            total: 2,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-10 00:00:00',
            ends_at: '2021-10-10 23:59:59'
        },
        {
            gender: 'M',
            total: 2,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-11 00:00:00',
            ends_at: '2021-10-11 23:59:59'
        },
        {
            gender: 'M',
            total: 1,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-12 00:00:00',
            ends_at: '2021-10-12 23:59:59'
        },
        {
            gender: 'M',
            total: 3,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-13 00:00:00',
            ends_at: '2021-10-13 23:59:59'
        },
        {
            gender: 'M',
            total: 2,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-15 00:00:00',
            ends_at: '2021-10-15 23:59:59'
        },
        {
            gender: 'M',
            total: 2,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-16 00:00:00',
            ends_at: '2021-10-16 23:59:59'
        },
        {
            gender: 'M',
            total: 3,
            insurance_type: 'tamin',
            doctor_id: 3,
            center_id: 'c428924f-cd66-4557-a2eb-b7b671102df8',
            starts_at: '2021-10-17 00:00:00',
            ends_at: '2021-10-17 23:59:59'
        }
    ]);
    const value = useMemo(() => [statisticsData, setStatisticsData], [statisticsData]);
    return <StatisticsContext.Provider value={value} {...props} />;
}

export { useStatistics, StatisticsProvider };
