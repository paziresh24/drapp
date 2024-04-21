// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: rqmTJ9WSF4RQaQFCvo2iUX
// Component: gnZ2lrwJIfnb

import * as React from "react";

import {
  Flex as Flex__,
  MultiChoiceArg,
  PlasmicDataSourceContextProvider as PlasmicDataSourceContextProvider__,
  PlasmicIcon as PlasmicIcon__,
  PlasmicImg as PlasmicImg__,
  PlasmicLink as PlasmicLink__,
  PlasmicPageGuard as PlasmicPageGuard__,
  SingleBooleanChoiceArg,
  SingleChoiceArg,
  Stack as Stack__,
  StrictProps,
  Trans as Trans__,
  classNames,
  createPlasmicElementProxy,
  deriveRenderOpts,
  ensureGlobalVariants,
  generateOnMutateForSpec,
  generateStateOnChangeProp,
  generateStateOnChangePropForCodeComponents,
  generateStateValueProp,
  get as $stateGet,
  hasVariant,
  initializeCodeComponentStates,
  initializePlasmicStates,
  makeFragment,
  omit,
  pick,
  renderPlasmicSlot,
  set as $stateSet,
  useCurrentUser,
  useDollarState,
  usePlasmicTranslator,
  useTrigger,
  wrapWithClassName
} from "@plasmicapp/react-web";
import {
  DataCtxReader as DataCtxReader__,
  useDataEnv,
  useGlobalActions
} from "@plasmicapp/react-web/lib/host";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../paziresh_24_design_system/plasmic_paziresh_24_design_system.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: rqmTJ9WSF4RQaQFCvo2iUX/projectcss
import sty from "./Plasmicمرززش.module.css"; // plasmic-import: gnZ2lrwJIfnb/css

createPlasmicElementProxy;

export type Plasmicمرززش__VariantMembers = {
  officeBook: "officeBook";
  onlineBook: "onlineBook";
  selected: "selected";
};
export type Plasmicمرززش__VariantsArgs = {
  officeBook?: SingleBooleanChoiceArg<"officeBook">;
  onlineBook?: SingleBooleanChoiceArg<"onlineBook">;
  selected?: SingleBooleanChoiceArg<"selected">;
};
type VariantPropType = keyof Plasmicمرززش__VariantsArgs;
export const Plasmicمرززش__VariantProps = new Array<VariantPropType>(
  "officeBook",
  "onlineBook",
  "selected"
);

export type Plasmicمرززش__ArgsType = {
  name?: string;
  onselected?: () => void;
};
type ArgPropType = keyof Plasmicمرززش__ArgsType;
export const Plasmicمرززش__ArgProps = new Array<ArgPropType>(
  "name",
  "onselected"
);

export type Plasmicمرززش__OverridesType = {
  root?: Flex__<"div">;
  text?: Flex__<"div">;
};

export interface DefaultمرززشProps {
  name?: string;
  onselected?: () => void;
  officeBook?: SingleBooleanChoiceArg<"officeBook">;
  onlineBook?: SingleBooleanChoiceArg<"onlineBook">;
  selected?: SingleBooleanChoiceArg<"selected">;
  className?: string;
}

const $$ = {};

function Plasmicمرززش__RenderFunc(props: {
  variants: Plasmicمرززش__VariantsArgs;
  args: Plasmicمرززش__ArgsType;
  overrides: Plasmicمرززش__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(() => Object.assign({}, props.args), [props.args]);

  const $props = {
    ...args,
    ...variants
  };

  const $ctx = useDataEnv?.() || {};
  const refsRef = React.useRef({});
  const $refs = refsRef.current;

  const currentUser = useCurrentUser?.() || {};

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "officeBook",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.officeBook
      },
      {
        path: "onlineBook",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.onlineBook
      },
      {
        path: "selected",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.selected
      }
    ],
    [$props, $ctx, $refs]
  );
  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries: {},
    $refs
  });

  return (
    <Stack__
      as={"div"}
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      hasGap={true}
      className={classNames(
        projectcss.all,
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        plasmic_fragment_design_system_css.plasmic_tokens,
        sty.root,
        {
          [sty.rootofficeBook]: hasVariant($state, "officeBook", "officeBook"),
          [sty.rootonlineBook]: hasVariant($state, "onlineBook", "onlineBook"),
          [sty.rootselected]: hasVariant($state, "selected", "selected")
        }
      )}
      onClick={async event => {
        const $steps = {};

        $steps["runOnselected"] = true
          ? (() => {
              const actionArgs = { eventRef: $props["onselected"] };
              return (({ eventRef, args }) => {
                return eventRef?.(...(args ?? []));
              })?.apply(null, [actionArgs]);
            })()
          : undefined;
        if (
          $steps["runOnselected"] != null &&
          typeof $steps["runOnselected"] === "object" &&
          typeof $steps["runOnselected"].then === "function"
        ) {
          $steps["runOnselected"] = await $steps["runOnselected"];
        }
      }}
    >
      <div
        data-plasmic-name={"text"}
        data-plasmic-override={overrides.text}
        className={classNames(projectcss.all, projectcss.__wab_text, sty.text, {
          [sty.textofficeBook]: hasVariant($state, "officeBook", "officeBook"),
          [sty.textonlineBook]: hasVariant($state, "onlineBook", "onlineBook")
        })}
      >
        {hasVariant($state, "onlineBook", "onlineBook") ? (
          <React.Fragment>
            {(() => {
              try {
                return "نوبت‌های آنلاین";
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return "";
                }
                throw e;
              }
            })()}
          </React.Fragment>
        ) : hasVariant($state, "officeBook", "officeBook") ? (
          <React.Fragment>
            {(() => {
              try {
                return " نوبت‌های حضوری ";
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return "";
                }
                throw e;
              }
            })()}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {(() => {
              try {
                return $props.name;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return "";
                }
                throw e;
              }
            })()}
          </React.Fragment>
        )}
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "text"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  Plasmicمرززش__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: Plasmicمرززش__VariantsArgs;
    args?: Plasmicمرززش__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<Plasmicمرززش__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      Plasmicمرززش__ArgsType,
      ReservedPropsType
    > &
    /* Specify overrides for each element directly as props*/ Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    /* Specify props for the root element*/ Omit<
      Partial<React.ComponentProps<NodeDefaultElementType[T]>>,
      ReservedPropsType | VariantPropType | ArgPropType | DescendantsType<T>
    >;

function makeNodeComponent<NodeName extends NodeNameType>(nodeName: NodeName) {
  type PropsType = NodeComponentProps<NodeName> & { key?: React.Key };
  const func = function <T extends PropsType>(
    props: T & StrictProps<T, PropsType>
  ) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: PlasmicDescendants[nodeName],
          internalArgPropNames: Plasmicمرززش__ArgProps,
          internalVariantPropNames: Plasmicمرززش__VariantProps
        }),
      [props, nodeName]
    );
    return Plasmicمرززش__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "Plasmic\u0645\u0631\u0632\u0632\u0634";
  } else {
    func.displayName = `Plasmicمرززش.${nodeName}`;
  }
  return func;
}

export const Plasmicمرززش = Object.assign(
  // Top-level Plasmicمرززش renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),

    // Metadata about props expected for Plasmicمرززش
    internalVariantProps: Plasmicمرززش__VariantProps,
    internalArgProps: Plasmicمرززش__ArgProps
  }
);

export default Plasmicمرززش;
/* prettier-ignore-end */
