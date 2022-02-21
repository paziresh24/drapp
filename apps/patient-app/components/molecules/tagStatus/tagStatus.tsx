import Chips from '../../atoms/chips';
import { BookStatus } from 'apps/patient-app/types/bookStatus';

export interface TagStatusProps {
    status: BookStatus;
}

enum TagsStatus {
    expired = 'منقضی',
    deleted = 'حذف شده',
    visited = 'ویزیت شده'
}

export const TagStatus: React.FC<TagStatusProps> = props => {
    const { status } = props;

    if (status === BookStatus.not_visited) return null;
    return <Chips className="absolute left-4 top-2">{TagsStatus[status]}</Chips>;
};

export default TagStatus;
