import Chips from '../../atoms/chips';

interface TagStatusProps {
    status: 'expired' | 'deleted' | 'not_visited';
}

enum TagsStatus {
    expired = 'منقضی',
    deleted = 'حذف شده'
}

export const TagStatus: React.FC<TagStatusProps> = props => {
    const { status } = props;

    if (status === 'not_visited') return null;
    return <Chips className="absolute left-4 top-2">{TagsStatus[status]}</Chips>;
};

export default TagStatus;
