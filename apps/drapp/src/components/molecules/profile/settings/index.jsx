import styles from './settings.module.scss';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import {
    useGetSettings,
    useRemoveSetting,
    useSetSetting
} from '@paziresh24/hooks/prescription/settings';

const Settings = () => {
    const getSettings = useGetSettings();
    const setSetting = useSetSetting();
    const removeSetting = useRemoveSetting();

    useEffect(() => {
        getSettings.remove();
        getSettings.refetch();
    }, []);

    const togglePassword = (e, id) => {
        if (e.target.checked) {
            setSetting.mutate(
                {
                    id
                },
                {
                    onError: error => {
                        toast.error(error.response.data.message);
                    }
                }
            );
        } else {
            removeSetting.mutate(
                {
                    id
                },
                {
                    onError: error => {
                        toast.error(error.response.data.message);
                    }
                }
            );
        }
    };

    return (
        <>
            {getSettings.isLoading && <Overlay />}
            {getSettings.isSuccess &&
                getSettings.data.map(setting => (
                    <div className="flex items-center space-s-3" key={setting.key}>
                        <div className={styles.toggle}>
                            <input
                                type="checkbox"
                                id={setting.key}
                                defaultChecked={setting.active}
                                onChange={e => togglePassword(e, setting.id)}
                            />
                            <label htmlFor={setting.key}>Toggle</label>
                        </div>
                        <span>{setting.name}</span>
                    </div>
                ))}
        </>
    );
};

export default Settings;
