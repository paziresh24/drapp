import { routes } from './routes';
import { Switch, Route } from 'react-router-dom';

function App() {
    return (
        <Switch>
            {routes.map(({ name, path, exact, component }) => (
                <Route key={name} path={path} exact={exact} component={component} />
            ))}
        </Switch>
    );
}

export { App };
