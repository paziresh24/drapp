interface CardProps {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = props => {
    const { children } = props;
    return <div>{children}</div>;
};

export default Card;
