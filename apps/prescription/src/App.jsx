import { routes } from './routes';
import { Switch, Route } from 'react-router-dom';

function App() {
    return (
        <Switch>
            {routes.map(route => (
                <Route key={route.path} {...route} />
            ))}
        </Switch>
    );
}

export { App };
