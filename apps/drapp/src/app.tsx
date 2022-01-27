import { routes } from './routes';
import { Switch, Route } from 'react-router-dom';

interface routesProps {
    name: string;
    path: string;
    component?: React.ComponentType;
    exact: boolean;
}

function App() {
    return (
        <Switch>
            {routes.map(({ name, path, exact, component }: routesProps) => (
                <Route key={name} path={path} exact={exact} component={component} />
            ))}
        </Switch>
    );
}

export { App };
