import { DrAppProvider } from '@paziresh24/context/drapp';
import { FillInfoProvider } from '@paziresh24/context/drapp/fillInfo';
import { WorkDaysProvider } from '@paziresh24/context/drapp/workDays';
import { DurationProvider } from '@paziresh24/context/drapp/duration';
import { MenuProvider } from '@paziresh24/context/core/menu';
import { SubMenuProvider } from '@paziresh24/context/core/subMenu';
import { SupportProvider } from '@paziresh24/context/core/supportChat';
import { PageProvider } from '@paziresh24/context/core/page';
import { IsActiveLearnProvider } from '@paziresh24/context/core/isActiveLearn';

import { MeProvider } from '@paziresh24/context/prescription/me-context';
import { SelectPrescriptionProvider } from '@paziresh24/context/prescription/selectPrescription-context';
import { SelectTypeProvider } from '@paziresh24/context/prescription/selectType-context';
import { ServicesProvider } from '@paziresh24/context/prescription/services-context';
import { DiagnosisProvider } from '@paziresh24/context/prescription/diagnosis-context';
import { BackPageProvider } from '@paziresh24/context/core/backPage';
// import { IsActiveLearnProvider } from '@paziresh24/context/core/isActiveLearn';
import { FavoriteItemProvider } from '@paziresh24/context/prescription/favoriteItem.context';
import { ToolBoxProvider } from '@paziresh24/context/prescription/toolBox.context';
import { TemplateItemProvider } from '@paziresh24/context/prescription/templateItem.context';

const Provider = ({ children }) => {
    return (
        <DrAppProvider>
            <FillInfoProvider>
                <WorkDaysProvider>
                    <DurationProvider>
                        <MenuProvider>
                            <SubMenuProvider>
                                <PageProvider>
                                    <IsActiveLearnProvider>
                                        <SupportProvider>
                                            <MeProvider>
                                                <SelectPrescriptionProvider>
                                                    <SelectTypeProvider>
                                                        <ServicesProvider>
                                                            <DiagnosisProvider>
                                                                <BackPageProvider>
                                                                    <FavoriteItemProvider>
                                                                        <ToolBoxProvider>
                                                                            <TemplateItemProvider>
                                                                                {children}
                                                                            </TemplateItemProvider>
                                                                        </ToolBoxProvider>
                                                                    </FavoriteItemProvider>
                                                                </BackPageProvider>
                                                            </DiagnosisProvider>
                                                        </ServicesProvider>
                                                    </SelectTypeProvider>
                                                </SelectPrescriptionProvider>
                                            </MeProvider>
                                        </SupportProvider>
                                    </IsActiveLearnProvider>
                                </PageProvider>
                            </SubMenuProvider>
                        </MenuProvider>
                    </DurationProvider>
                </WorkDaysProvider>
            </FillInfoProvider>
        </DrAppProvider>
    );
};

export default Provider;
