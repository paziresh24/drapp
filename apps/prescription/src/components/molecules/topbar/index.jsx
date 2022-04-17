import { useHistory } from 'react-router-dom';
import Button from '@paziresh24/shared/ui/button';
import { ChevronIcon } from '@paziresh24/shared/icon';

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
