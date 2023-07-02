import { memo, SVGAttributes } from 'react';

const ArrowheadIcon = memo(({ ...rest }: SVGAttributes<SVGElement>) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.5303 5.46967C11.8232 5.76256 11.8232 6.23744 11.5303 6.53033L6.81066 11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H6.81066L11.5303 17.4697C11.8232 17.7626 11.8232 18.2374 11.5303 18.5303C11.2374 18.8232 10.7626 18.8232 10.4697 18.5303L4.46967 12.5303C4.17678 12.2374 4.17678 11.7626 4.46967 11.4697L10.4697 5.46967C10.7626 5.17678 11.2374 5.17678 11.5303 5.46967Z"
            fill="currentColor"
        />
    </svg>
));

export default ArrowheadIcon;
