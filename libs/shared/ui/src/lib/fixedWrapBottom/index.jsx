import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { isEmbed } from '@paziresh24/shared/utils';

const FixedWrapBottom = ({ children, className = '' }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <div
            className={classNames(
                className,
                'fixed bottom-[4.5rem] right-0 p-3 border-t border-solid border-[#e8ecf0]  bg-white w-full z-50 flex gap-2 sm:p-0 sm:bg-transparent sm:border-none sm:static',
                {
                    '!bottom-0': isEmbed()
                }
            )}
        >
            {children}
        </div>
    );
};

export default FixedWrapBottom;
