import { useEffect } from 'react';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { Tab, Tabs } from '@paziresh24/shared/ui/tab';
import { useGetLevels } from '@paziresh24/prescription-dashboard/apis/getLevel/useGetLevel.hook';
import MustUsedStatistics from '@paziresh24/prescription-dashboard/components/mostUsedItems';
import PrescriptionStatistics from '@paziresh24/prescription-dashboard/components/prescription';
import { StatisticsFiltersProvider } from '@paziresh24/prescription-dashboard/contexts/filters.context';
import { StatisticsProvider } from '@paziresh24/prescription-dashboard/contexts/statistics.context';

export const Statistics = () => {
    const getLevels = useGetLevels();

    useEffect(() => {
        getLevels.refetch();
    }, []);

    return (
        <StatisticsFiltersProvider>
            <StatisticsProvider>
                {getLevels.isLoading && <Overlay />}
                {getLevels.isSuccess && (
                    <div className="w-full h-full overflow-auto">
                        <Tabs>
                            <Tab title="نسخه">
                                <PrescriptionStatistics
                                    level={getLevels.data.data?.[0]?.user_level ?? 'DOCTOR'}
                                />
                            </Tab>
                            <Tab title="پراستفاده">
                                <MustUsedStatistics
                                    level={getLevels.data.data?.[0]?.user_level ?? 'DOCTOR'}
                                />
                            </Tab>
                        </Tabs>
                    </div>
                )}
            </StatisticsProvider>
        </StatisticsFiltersProvider>
    );
};

export default Statistics;
