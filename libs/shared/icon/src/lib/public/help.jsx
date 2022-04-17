const HelpIcon = props => {
    return (
        <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M8.00006 9.9198V9.70984C8.00006 9.02984 8.42009 8.66982 8.84009 8.37982C9.25009 8.09982 9.66003 7.73983 9.66003 7.07983C9.66003 6.15983 8.92006 5.4198 8.00006 5.4198C7.08006 5.4198 6.34009 6.15983 6.34009 7.07983"
                stroke={props.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.9955 12.0692H8.0045"
                stroke={props.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="8" cy="8.99445" r="7.25" stroke={props.color} strokeWidth="1.5" />
        </svg>
    );
};

HelpIcon.defaultProps = {
    color: 'white'
};

export { HelpIcon };
