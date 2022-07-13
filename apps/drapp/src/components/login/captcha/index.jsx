import styles from './captcha.module.scss';
import TextField from '@paziresh24/shared/ui/textField';
import { useCaptcha } from '@paziresh24/hooks/drapp/auth';
import { useLayoutEffect } from 'react';

const Captcha = ({ captchaEntered, error }) => {
    const { data: captcha, isSuccess, refetch } = useCaptcha();

    useLayoutEffect(() => {
        refetch();
    }, []);

    return (
        <div className={styles['captcha']}>
            {isSuccess && (
                <>
                    <img className={styles['captcha-image']} src={captcha.img} alt="captcha" />
                    <TextField
                        label="عبارت امنیتی"
                        error={error}
                        onChange={e =>
                            captchaEntered({
                                captcha_key: captcha.key,
                                captcha_value: e.target.value
                            })
                        }
                        type="text"
                        style={{ direction: 'ltr' }}
                    />
                </>
            )}
        </div>
    );
};

export default Captcha;
