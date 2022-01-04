const Pen = props => {
    return (
        <svg
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0946 2.1555C11.7661 1.82708 11.2337 1.82707 10.9053 2.15549L10.7305 2.33023C10.754 2.97339 11.2765 3.496 11.9197 3.51966L12.0945 3.34479C12.423 3.01638 12.423 2.48392 12.0946 2.1555ZM10.7193 4.72C10.2101 4.4577 9.79233 4.0399 9.53008 3.53064L6.09704 6.96363C5.29027 7.77039 4.98968 8.07981 4.78354 8.4439C4.60164 8.76516 4.49408 9.12757 4.28118 9.96881C5.12243 9.75591 5.48484 9.64835 5.8061 9.46646C6.17019 9.26032 6.4796 8.95974 7.28636 8.15298L10.7193 4.72ZM9.8446 1.09482C10.7588 0.180616 12.241 0.180634 13.1552 1.09487C14.0694 2.00908 14.0694 3.49126 13.1552 4.40545L8.34702 9.21364L8.27349 9.28718L8.27348 9.2872C7.56541 9.99554 7.10812 10.453 6.54515 10.7718C5.98218 11.0905 5.35462 11.2473 4.38292 11.49L4.38291 11.49L4.28202 11.5152L3.43173 11.7278C3.17615 11.7917 2.90579 11.7168 2.7195 11.5305C2.53322 11.3442 2.45833 11.0738 2.52222 10.8183L2.73479 9.968L2.76 9.86711C3.00272 8.89539 3.15948 8.26782 3.47824 7.70484C3.797 7.14186 4.25448 6.68457 4.96284 5.97649L5.03639 5.90296L9.8446 1.09482ZM0.25 14.7501C0.25 14.3359 0.585786 14.0001 1 14.0001H13C13.4142 14.0001 13.75 14.3359 13.75 14.7501C13.75 15.1644 13.4142 15.5001 13 15.5001H1C0.585786 15.5001 0.25 15.1644 0.25 14.7501Z"
                fill={props.color}
            />
        </svg>
    );
};

Pen.defaultProps = {
    color: 'white'
};

export default Pen;
