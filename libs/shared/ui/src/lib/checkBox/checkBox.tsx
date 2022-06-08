import { useState, forwardRef, LegacyRef } from 'react';
import styles from './checkBox.module.scss';
import { v4 } from 'uuid';

interface CheckBox {
    title: string;
    checked?: boolean;
    onChange?: (e: unknown) => void;
}

const CheckBox = forwardRef(
    ({ title, onChange, checked }: CheckBox, ref: LegacyRef<HTMLInputElement>) => {
        const [id] = useState(v4());

        return (
            <div className="flex items-start">
                <div className="flex h-5">
                    <input
                        ref={ref}
                        onChange={onChange}
                        type="checkbox"
                        value=""
                        className="form-checkbox w-6 h-6 border border-gray-300 rounded-md bg-gray-50 focus:ring-3 focus:ring-blue-300"
                        required
                        id={id}
                    />
                </div>
                <label htmlFor={id} className="mr-2 text-sm font-medium text-gray-900">
                    {title}
                </label>
            </div>
        );
    }
);

export { CheckBox };
