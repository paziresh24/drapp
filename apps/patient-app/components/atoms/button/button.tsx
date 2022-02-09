interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    theme?: 'simple' | 'error';
    icon?: React.ReactNode;
    onClick?: () => void;
    block?: boolean;
    className?: string;
}

const buttonStyles = {
    variant: {
        primary: 'bg-primary border border-primary text-white',
        secondary: 'border border-primary text-primary'
    },
    size: {
        sm: 'px-3 h-10 text-sm',
        md: 'px-4 h-12 text-base',
        lg: 'px-5 h-14 text-lg'
    },
    theme: {
        error: {
            primary: 'bg-red-500 border-red-50 text-white',
            secondary: 'border-red-500 text-red-500'
        }
    },
    block: 'w-full'
};

export const Button: React.FC<ButtonProps> = props => {
    const {
        children,
        variant = 'primary',
        size = 'md',
        theme = 'simple',
        block = false,
        onClick,
        icon,
        className
    } = props;

    return (
        <button
            className={`
            flex items-center justify-center rounded-md font-bold ${
                buttonStyles.variant[variant]
            } ${buttonStyles.size[size]} ${buttonStyles.theme[theme]?.[variant]} ${
                block ? buttonStyles['block'] : ''
            } ${className ? className : ''}`}
            onClick={onClick}
        >
            {icon && <span className="flex items-center justify-center ml-2">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
