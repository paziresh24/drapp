/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { routes } from './routes';

import PrivateRoute from '@paziresh24/components/doctorApp/privateRoute';
import Provider from '@paziresh24/components/doctorApp/provider';
import Wrapper from '@paziresh24/components/doctorApp/wrapper';
import { Overlay } from '@paziresh24/components/core/overlay';

const DoctorApp = () => {
    return (
        <Provider>
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
