import { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { routes } from './routes';
import Helmet from 'react-helmet';
import centersConfig from '@paziresh24/configs/drapp/centers.config.json';

import PrivateRoute from '@components/privateRoute';
import Provider from '@components/provider';
import Wrapper from '@components/wrapper';
import { Overlay } from '@paziresh24/shared/ui/overlay';

const DoctorApp = () => {
    return (
        <Provider>
            <Helmet
                titleTemplate={`${
                    centersConfig[window.location.hostname]?.title ?? 'پذیرش24'
                } | %s`}
            />

            <Wrapper>
                <Suspense
                    fallback={
                        <div style={{ flexGrow: 1 }}>
                            <Overlay />
                        </div>
                    }
                >
                    <Switch>
                        {routes.map(route =>
                            route.isPrivate ? (
                                <PrivateRoute key={route.path} {...route} />
                            ) : (
                                <Route key={route.path} {...route} />
                            )
                        )}
                    </Switch>
                </Suspense>
            </Wrapper>
        </Provider>
    );
};

export default DoctorApp;
