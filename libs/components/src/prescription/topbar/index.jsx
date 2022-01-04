import { useHistory } from 'react-router-dom';
import Button from '../../core/button';
import { ChevronIcon } from '../../icons';

const Topbar = () => {
    const history = useHistory();

    return (
        <div className="topbar" style={{ zIndex: '5' }}>
            <Button
                variant="secondary"
                size="small"
                onClick={() => history.goBack()}
                icon={<ChevronIcon dir="left" color="#27bda0" />}
            >
                بازگشت
            </Button>
        </div>
    );
};

export { Topbar };
