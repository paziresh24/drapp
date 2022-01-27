import styles from './providerItem.module.scss';

import SalamatIcon from '../../icons/prescription/salamat';
import TaminIcon from '../../icons/prescription/tamin';
import { CenterItem } from './centerItem';
import { SalamatCenter } from './salamatCenter';
import isEmpty from 'lodash/isEmpty';
import { useDrApp } from '@paziresh24/context/drapp';
import { isMobile } from 'react-device-detect';

const PoroviderItem = ({ provider, data, centers, refetch }) => {
    const [info] = useDrApp();

    const providers = {
        tamin: {
            name: 'بیمه تامین اجتماعی',
            icon: <TaminIcon />
        },
        salamat: {
            name: 'بیمه سلامت',
            icon: <SalamatIcon />
        }
    };

    return (
        <div className={styles['wrapper']} aria-hidden>
            {!isMobile && (
                <div className={styles['header']}>
                    <div
                        className={styles['provider-name']}
                        id={provider === 'tamin' ? 'taminPorviderItem' : 'salamatPorviderItem'}
                    >
                        {providers[provider].icon}
                        <span>{providers[provider].name}</span>
                    </div>
                </div>
            )}
            <div className={styles.centersWrapper}>
                {provider === 'tamin' && (
                    <CenterItem
                        insurance={data[provider]}
                        provider={provider}
                        isAuth={!isEmpty(data[provider])}
                        refetch={refetch}
                    />
                )}
                {provider === 'salamat' &&
                    centers.map(
                        center =>
                            center.id === info.center.id && (
                                <SalamatCenter
                                    refetch={refetch}
                                    key={center.id}
                                    data={data[provider]}
                                    isAuth={
                                        data[provider].some(
                                            item => item.identifier === center.id
                                        ) &&
                                        data[provider].find(item => item.identifier === center.id)
                                            ?.is_invalid !== true
                                    }
                                    insurance={data[provider].find(
                                        item => item.identifier === center.id
                                    )}
                                    provider={provider}
                                    name={center.name}
                                    address={center.address}
                                    identifier={center.id}
                                />
                            )
                    )}
            </div>
        </div>
    );
};

export { PoroviderItem };
