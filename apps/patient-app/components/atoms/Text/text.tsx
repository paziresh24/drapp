interface TextProps {
    children: React.ReactNode;
    fontSize?:
        | 'xs'
        | 'sm'
        | 'base'
        | 'lg'
        | 'xl'
        | '2xl'
        | '3xl'
        | '4xl'
        | '5xl'
        | '6xl'
        | '7xl'
        | '8xl'
        | '9xl';
}

export const Text: React.FC<TextProps> = props => {
    const { fontSize, children } = props;
    return <span className={`text-${fontSize}`}>{children}</span>;
};

export default Text;
