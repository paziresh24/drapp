import { memo, SVGAttributes } from 'react';

interface Props extends SVGAttributes<SVGElement> {
    color: string;
}
export const DotsIcon = memo(({ color, ...rest }: Props) => (
    <svg
        width="5"
        height="15"
        viewBox="0 0 3 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
    >
        <circle cx="1.35281" cy="1.75977" r="1" fill={color} />
        <circle cx="1.35281" cy="6.75977" r="1" fill={color} />
        <circle cx="1.35281" cy="11.7598" r="1" fill={color} />
    </svg>
));

export default DotsIcon;
