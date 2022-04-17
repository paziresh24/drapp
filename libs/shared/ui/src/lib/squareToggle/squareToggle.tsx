import { useState, useEffect } from 'react';

interface SquareToggleProps {
    onChange: (value: boolean) => void;
    value?: boolean;
    label: string;
}

export const SquareToggle: React.FC<SquareToggleProps> = props => {
    const { onChange, value = false, label } = props;

    const [isChecked, setIsChecked] = useState(value);

    useEffect(() => {
        onChange(isChecked);
    }, [isChecked]);

    return (
        <div
            onClick={() => setIsChecked(prevState => !prevState)}
            className={`flex items-center justify-center w-12 min-w-[3rem] h-12 border-2 opacity-100 grayscale-0 border-solid border-[#27BDA0] rounded-md bg-[#27bd9f34] cursor-pointer transition-all ${
                !isChecked ? 'bg-transparent !opacity-60 !grayscale' : ''
            }`}
        >
            <span className="text-[#27BDA0] font-bold">{label}</span>
        </div>
    );
};

export default SquareToggle;
