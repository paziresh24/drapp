import { Switch, Route } from 'react-router-dom';
import { routes } from './routes';
import { MeProvider } from '../../context/prescription/me-context';

import PrivateRoute from '../../components/prescription/privateRoute';
import { SelectPrescriptionProvider } from '../../context/prescription/selectPrescription-context';
import { SelectTypeProvider } from '../../context/prescription/selectType-context';
import { TokenProvider } from '../../context/prescription/token.context';
import { ServicesProvider } from '../../context/prescription/services-context';
import { BackPageProvider } from '../../context/core/backPage';
import { DiagnosisProvider } from '../../context/prescription/diagnosis-context';
import { IsActiveLearnProvider } from '../../context/core/isActiveLearn';
import { FavoriteItemProvider } from '../../context/prescription/favoriteItem.context';
import { Suspense } from 'react';
import { Overlay } from 'components/core/overlay';
import { ToolBoxProvider } from '../../context/prescription/toolBox.context';
import { TemplateItemProvider } from '../../context/prescription/templateItem.context';

const Prescription = () => {
    return (
        <MeProvider>
            <SelectPrescriptionProvider>
                <SelectTypeProvider>
                    <TokenProvider>
                        <ServicesProvider>
                            <DiagnosisProvider>
                                <BackPageProvider>
                                    <IsActiveLearnProvider>
                                        <FavoriteItemProvider>
                                            <ToolBoxProvider>
                                                <TemplateItemProvider>
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
                                                                    <PrivateRoute
                                                                        key={route.path}
                                                                        {...route}
                                                                    />
                                                                ) : (
                                                                    <Route
                                                                        key={route.path}
                                                                        {...route}
                                                                    />
                                                                )
                                                            )}
                                                        </Switch>
                                                    </Suspense>
                                                </TemplateItemProvider>
                                            </ToolBoxProvider>
                                        </FavoriteItemProvider>
                                    </IsActiveLearnProvider>
                                </BackPageProvider>
                            </DiagnosisProvider>
                        </ServicesProvider>
                    </TokenProvider>
                </SelectTypeProvider>
            </SelectPrescriptionProvider>
        </MeProvider>
    );
};

export { Prescription };
