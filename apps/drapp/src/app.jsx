import { routes } from './routes';
import { Switch, Route } from 'react-router-dom';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { useEffect } from 'react';

export const growthbook = new GrowthBook({
    apiHost: window._env_.P24_GROWTHBOOK_API_HOST,
    clientKey: window._env_.P24_GROWTHBOOK_CLIENT_KEY
});

function App() {
    useEffect(() => {
        growthbook.loadFeatures({ autoRefresh: true });
        growthbook.setAttributes({
            client_unique_identifier: localStorage.getItem('client_identifier')
        });
    }, []);

    return (
        <GrowthBookProvider growthbook={growthbook}>
            <Switch>
                {routes.map(({ name, path, exact, component }) => (
                    <Route key={name} path={path} exact={exact} component={component} />
                ))}
            </Switch>
        </GrowthBookProvider>
    );
}

export { App };
