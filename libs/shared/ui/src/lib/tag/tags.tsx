import classNames from 'classnames';
import React, { Children } from 'react';
import { v4 } from 'uuid';

interface Tags {
    children: React.ReactNode;
    className?: string;
    oneSelect?: boolean;
}
export const Tags = (props: Tags) => {
    const { children, className, oneSelect } = props;
    const idGroup = v4();

    const tags = React.Children.map(children as React.ReactElement, (child: React.ReactElement) => {
        return React.cloneElement(child, {
            ...child.props,
            idGroup,
            ...(oneSelect && { oneSelect })
        });
    });

    return <div className={classNames(className, 'flex w-full flex-wrap gap-3')}>{tags}</div>;
};

export default Tags;
