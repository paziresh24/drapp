interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    theme?: 'simple' | 'error';
    icon?: React.ReactNode;
    onClick?: () => void;
    block?: boolean;
    className?: string;
    loading?: boolean;
}

const buttonStyles = {
    variant: {
        primary: 'bg-primary border border-primary text-white',
        secondary: 'border border-primary text-primary'
    },
    size: {
        sm: 'px-3 h-10 text-sm',
        md: 'px-4 h-12 text-sm',
        lg: 'px-5 h-14 text-md'
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
        className,
        loading = false
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
            {!loading && (
                <>
                    {icon && <span className="flex items-center justify-center ml-2">{icon}</span>}
                    {children}
                </>
            )}
            {loading && (
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="60px"
                    height="10px"
                    viewBox="0 0 80 20"
                >
                    <circle cx="10" cy="10" r="10" fill="#fff">
                        <animate
                            attributeName="cx"
                            from="10"
                            to="40"
                            dur="0.5s"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1"
                            keyTimes="0;1"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="10" cy="10" r="0" fill="#fff">
                        <animate
                            attributeName="r"
                            from="0"
                            to="10"
                            dur="0.5s"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1"
                            keyTimes="0;1"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="40" cy="10" r="10" fill="#fff">
                        <animate
                            attributeName="cx"
                            from="40"
                            to="70"
                            dur="0.5s"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1"
                            keyTimes="0;1"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <circle cx="70" cy="10" r="10" fill="#fff">
                        <animate
                            attributeName="r"
                            from="10"
                            to="0"
                            dur="0.5s"
                            calcMode="spline"
                            keySplines="0.42 0 0.58 1"
                            keyTimes="0;1"
                            repeatCount="indefinite"
                        />
                    </circle>
                </svg>
            )}
        </button>
    );
};

export default Button;
