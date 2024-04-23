// import { PlasmicRootProvider, PlasmicComponent } from '@plasmicapp/loader-react';
// import { PLASMIC } from 'plasmic-init';
import { Components } from './components';
import { getFeatures } from './features';
import { growthbook } from '../app';
import pick from 'lodash/pick';

interface FragmentProps {
    name: string;
    variants?: Record<string, any>;
    props?: Record<string, any>;
}

export const Fragment = ({ name, variants, props }: FragmentProps) => {
    if (!name) return null;

    const features = getFeatures({ provider: growthbook });
    // // if (publicRuntimeConfig.PLASMIC_PREVIEW) {
    // return (
    //     <PlasmicRootProvider loader={PLASMIC} disableLoadingBoundary={true}>
    //         <PlasmicComponent
    //             component={name}
    //             componentProps={{
    //                 'data-fragment-component-id': (Components as any)?.[name]?.id,
    //                 'data-fragment-component': name,
    //                 'data-fragment-project-id': (Components as any)?.[name]?.projectId,
    //                 variants,
    //                 ...features,
    //                 ...props
    //             }}
    //         />
    //     </PlasmicRootProvider>
    // );
    // // }

    const { Component, id, projectId, propsAllowed } = (Components as any)?.[name] ?? {
        Component: () => <p>Error</p>,
        id: '',
        propsAllowed: []
    };
    return (
        <Component
            data-fragment-component-id={id}
            data-fragment-project-id={projectId}
            data-fragment-component={name}
            {...{ ...pick({ ...props, ...features }, propsAllowed ?? []), ...variants }}
        />
    );
};

export default Fragment;
