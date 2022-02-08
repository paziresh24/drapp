import Image from 'next/image';

interface AvatarProps {
    src: string;
}

export const Avatar: React.FC<AvatarProps> = props => {
    const { src } = props;
    return <Image src={src} alt="avatar" width={200} height={200} />;
};

export default Avatar;
