const LikeIcon = props => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={props.onClick}
        >
            <path
                d="M2.81728 8.03245L7.55006 12.8728C7.79693 13.1253 8.20317 13.1253 8.45004 12.8728L13.1828 8.03245C14.3783 6.80982 14.3783 4.8562 13.1828 3.63356C11.9488 2.37145 9.91802 2.37145 8.68395 3.63356L8.00005 4.33301L7.31615 3.63356C6.08208 2.37145 4.05135 2.37145 2.81729 3.63356C1.62182 4.8562 1.62182 6.80982 2.81728 8.03245Z"
                fill="#27BDA0"
                fillOpacity={props.fill ? 1 : 0}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.77992 4.15842C5.84005 3.19719 4.29344 3.19719 3.35357 4.15842C2.4431 5.08959 2.4431 6.57747 3.35357 7.50863L8.00008 12.2607L12.6466 7.50863C13.5571 6.57747 13.5571 5.08959 12.6466 4.15842C11.7067 3.19719 10.1601 3.19719 9.22023 4.15842L8.53633 4.85787C8.39523 5.00218 8.20191 5.08353 8.00008 5.08353C7.79824 5.08353 7.60493 5.00218 7.46382 4.85787L6.77992 4.15842ZM2.28106 3.10975C3.80932 1.54675 6.32417 1.54675 7.85243 3.10975L8.00008 3.26075L8.14772 3.10975C9.67599 1.54675 12.1908 1.54675 13.7191 3.10975C15.1996 4.62385 15.1996 7.04321 13.7191 8.55731L8.98632 13.3977C8.44526 13.951 7.5549 13.951 7.01384 13.3977L2.28106 8.55731C0.800601 7.04321 0.800602 4.62385 2.28106 3.10975Z"
                fill="#27BDA0"
            />
        </svg>
    );
};

export { LikeIcon };