const MessageIcon = props => {
    return (
        <svg
            width={20}
            height={18}
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.768.25h8.464c.813 0 1.469 0 2 .043.546.045 1.026.14 1.47.366a3.75 3.75 0 011.64 1.639c.226.444.32.924.365 1.47.043.531.043 1.187.043 2V17a.75.75 0 01-1.085.67l-2.65-1.324c-.521-.26-.72-.358-.923-.426a3.255 3.255 0 00-.586-.139c-.212-.03-.433-.031-1.017-.031H5.768c-.813 0-1.469 0-2-.043-.546-.045-1.026-.14-1.47-.366a3.75 3.75 0 01-1.64-1.638c-.226-.445-.32-.925-.365-1.471-.043-.531-.043-1.187-.043-2V5.768c0-.813 0-1.469.043-2 .045-.546.14-1.026.366-1.47A3.75 3.75 0 012.298.658c.444-.226.924-.32 1.47-.365C4.3.25 4.956.25 5.769.25zM3.89 1.788c-.454.037-.715.107-.912.207a2.25 2.25 0 00-.984.984c-.1.197-.17.458-.207.912-.037.462-.038 1.057-.038 1.909v4.4c0 .853 0 1.447.038 1.91.037.453.107.714.207.912.216.423.56.767.984.983.197.1.458.17.912.207.462.037 1.057.038 1.909.038h7.742c.513 0 .844 0 1.172.046.291.04.578.108.856.202.315.106.61.254 1.07.483l.047.024 1.563.781V5.8c0-.852 0-1.447-.038-1.91-.038-.453-.107-.714-.207-.911a2.25 2.25 0 00-.983-.984c-.198-.1-.459-.17-.913-.207-.462-.037-1.057-.038-1.909-.038H5.8c-.852 0-1.447 0-1.91.038zM4.25 5A.75.75 0 015 4.25h8a.75.75 0 010 1.5H5A.75.75 0 014.25 5zM5 8.25a.75.75 0 000 1.5h4a.75.75 0 000-1.5H5z"
                fill={props.color}
            />
        </svg>
    );
};

MessageIcon.defaultProps = {
    color: '#3F3F79'
};

export { MessageIcon };
