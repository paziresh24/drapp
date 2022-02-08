import { createContext, useContext, useMemo, useState } from 'react';

const FiltersContext = createContext();

const useStatisticsFilters = () => {
    const context = useContext(FiltersContext);
    if (!context) {
        throw new Error(`useStatisticsFilters must be used within a FiltersContext`);
    }

    return context;
};

const StatisticsFiltersProvider = props => {
    const [filters, setFilters] = useState({ duration: 'DAILY' });

    const value = useMemo(() => [filters, setFilters], [filters]);
    return <FiltersContext.Provider value={value} {...props} />;
};

export { useStatisticsFilters, StatisticsFiltersProvider };
