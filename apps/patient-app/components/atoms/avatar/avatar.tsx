/* eslint-disable @next/next/no-img-element */
interface AvatarProps {
    src: string;
}

export const Avatar: React.FC<AvatarProps> = props => {
    const { src } = props;
    return <img src={src} alt="avatar" width={70} height={70} className="rounded-full" />;
};

export default Avatar;
