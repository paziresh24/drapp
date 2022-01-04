const CircleminusIcon = props => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle cx="12" cy="12" r="9" fill={props.color} fillOpacity="0.16" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12ZM12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM7.99997 11.25C7.58576 11.25 7.24997 11.5858 7.24997 12C7.24997 12.4142 7.58576 12.75 7.99997 12.75H16C16.4142 12.75 16.75 12.4142 16.75 12C16.75 11.5858 16.4142 11.25 16 11.25H7.99997Z"
                fill={props.color}
            />
        </svg>
    );
};

CircleminusIcon.defaultProps = {
    color: '#27BDA0'
};

export { CircleminusIcon };
