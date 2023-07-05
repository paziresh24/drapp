import classNames from 'classnames';
import { ReactNode } from 'react';

type Detailes = Record<string, string>;

interface VacationCardProps {
    detailes: Detailes;
    title: string;
    icon?: ReactNode;
    wrapperClassName?: string;
}

export const VacationCard = (props: VacationCardProps) => {
    const { detailes, title, icon, wrapperClassName } = props;
    return (
        <div
            className={classNames(
                'w-full h-24 bg-white border border-solid border-[#d3d3d3] rounded-md flex justify-between items-center p-4',
                wrapperClassName
            )}
        >
            <div className="flex flex-col gap-2">
                <span className="text-[0.75rem] font-bold leading-6 ml-4">{title}</span>
                {Object.entries(detailes).map(([lable, value]) => (
                    <span className="text-start text-[0.75rem]">
                        {lable ? `${lable}: ` : ''}
                        {value}
                    </span>
                ))}
            </div>
            {!!icon && <div>{icon}</div>}
        </div>
    );
};

export default VacationCard;
