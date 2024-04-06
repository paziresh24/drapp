import { routes } from './routes';
import { Switch, Route } from 'react-router-dom';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { useEffect } from 'react';
import PlasmicHost from './pages/fragment';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { PlasmicRootProvider } from '@plasmicapp/react-web';

export const growthbook = new GrowthBook({
    apiHost: window._env_.P24_GROWTHBOOK_API_HOST,
    clientKey: window._env_.P24_GROWTHBOOK_CLIENT_KEY
});

function App() {
    useEffect(() => {
        growthbook.loadFeatures({ autoRefresh: true });
        growthbook.setAttributes({
            ...growthbook.getAttributes(),
            client_unique_identifier: localStorage.getItem('client_identifier')
        });
    }, []);

    useEffect(() => {
        const sessionStartTime = Date.now();

        const sendSessionDurationToSplunk = () => {
            const sessionEndTime = Date.now();
            const sessionDuration = sessionEndTime - sessionStartTime;

            getSplunkInstance().sendEvent({
                group: 'UserEngagement',
                type: 'SessionDuration',
                event: {
                    duration: sessionDuration
                }
            });
        };

        window.addEventListener('beforeunload', sendSessionDurationToSplunk);

        return () => {
            window.removeEventListener('beforeunload', sendSessionDurationToSplunk);
            sendSessionDurationToSplunk();
        };
    }, []);

    return (
        <GrowthBookProvider growthbook={growthbook}>
            <PlasmicRootProvider>
                <Switch>
                    <Route path="/fragment" component={PlasmicHost} />
                    {routes.map(({ name, path, exact, component }) => (
                        <Route key={name} path={path} exact={exact} component={component} />
                    ))}
                </Switch>
            </PlasmicRootProvider>
        </GrowthBookProvider>
    );
}

export { App };
