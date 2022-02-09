import Text from '../../atoms/text';

interface LocationProps {
    address: string;
    lat: number;
    long: number;
}

export const Location: React.FC<LocationProps> = props => {
    const { address, lat, long } = props;
    return (
        <a
            href={`https://maps.google.com/maps?daddr=${lat},${long}&amp;ll=`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center w-full p-3"
        >
            <div className="flex items-center justify-center w-12 min-w-[3rem] h-12 bg-gray rounded-md ml-2">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.646 3.09014C17.9316 4.33162 18.75 6.16288 18.75 8.51853C18.75 11.0174 17.6374 13.1812 16.3893 14.827L16.3414 14.8903C15.7807 15.6299 15.2699 16.3039 14.6289 16.7669C13.9199 17.279 13.1065 17.504 12.0002 17.504C10.8939 17.504 10.0804 17.2791 9.37139 16.767C8.73044 16.304 8.21953 15.63 7.65887 14.8905L7.6109 14.8272C6.36272 13.1813 5.25 11.0175 5.25 8.51853C5.25 6.16287 6.06844 4.3316 7.354 3.09012C8.63051 1.85739 10.3225 1.25 12 1.25C13.6775 1.25 15.3695 1.85741 16.646 3.09014ZM5.68787 15.5475C5.85294 15.9274 5.67879 16.3692 5.29889 16.5342C4.72123 16.7852 4.31008 17.0499 4.0546 17.2991C3.80118 17.5462 3.75 17.7261 3.75 17.8355C3.75 17.9612 3.8206 18.1862 4.18671 18.4905C4.54835 18.7912 5.11663 19.0955 5.88481 19.3656C7.41435 19.9034 9.57636 20.25 12 20.25C14.4236 20.25 16.5856 19.9034 18.1152 19.3656C18.8834 19.0955 19.4516 18.7912 19.8133 18.4905C20.1794 18.1862 20.25 17.9612 20.25 17.8355C20.25 17.7261 20.1988 17.5462 19.9454 17.2991C19.6899 17.0499 19.2788 16.7852 18.7011 16.5342C18.3212 16.3692 18.1471 15.9274 18.3121 15.5475C18.4772 15.1676 18.919 14.9934 19.2989 15.1585C19.972 15.451 20.5609 15.8041 20.9927 16.2252C21.4266 16.6484 21.75 17.1914 21.75 17.8355C21.75 18.5837 21.3169 19.1912 20.7722 19.644C20.223 20.1006 19.4732 20.4781 18.6127 20.7807C16.8849 21.3882 14.5469 21.75 12 21.75C9.45308 21.75 7.11508 21.3882 5.38726 20.7807C4.52677 20.4781 3.77703 20.1006 3.22782 19.644C2.68308 19.1912 2.25 18.5837 2.25 17.8355C2.25 17.1914 2.57342 16.6484 3.0073 16.2252C3.43912 15.8041 4.02797 15.451 4.70111 15.1585C5.08101 14.9934 5.5228 15.1676 5.68787 15.5475ZM14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8Z"
                        fill="#3F3F79"
                    />
                </svg>
            </div>
            <Text fontSize="base" className="line-clamp-2">
                {address}
            </Text>
        </a>
    );
};

export default Location;
