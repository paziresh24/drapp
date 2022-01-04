const MinusLineIcon = ({ color, onClick }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H12H18C18.4142 11.25 18.75 11.5858 18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H12H6C5.58579 12.75 5.25 12.4142 5.25 12Z"
                fill={color}
            />
        </svg>
    );
};

MinusLineIcon.defaultProps = {
    color: '#27bda0'
};

export { MinusLineIcon };
