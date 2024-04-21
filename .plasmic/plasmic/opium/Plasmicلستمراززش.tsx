// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: rqmTJ9WSF4RQaQFCvo2iUX
// Component: Y7zSCi-xgVNQ

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

import { Popover } from "@plasmicpkgs/radix-ui";
import مرززش from "../../\u0645\u0631\u0632\u0632\u0634"; // plasmic-import: gnZ2lrwJIfnb/component
import { Fetcher } from "@plasmicapp/react-web/lib/data-sources";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../paziresh_24_design_system/plasmic_paziresh_24_design_system.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: rqmTJ9WSF4RQaQFCvo2iUX/projectcss
import sty from "./Plasmicلستمراززش.module.css"; // plasmic-import: Y7zSCi-xgVNQ/css

import ChevronDownIcon from "../paziresh_24_icons/icons/PlasmicIcon__ChevronDown"; // plasmic-import: aC_QFogxt1Ko/icon
import ChevronUpIcon from "../paziresh_24_icons/icons/PlasmicIcon__ChevronUp"; // plasmic-import: YXreB8gS3SjV/icon

createPlasmicElementProxy;

export type Plasmicلستمراززش__VariantMembers = {};
export type Plasmicلستمراززش__VariantsArgs = {};
type VariantPropType = keyof Plasmicلستمراززش__VariantsArgs;
export const Plasmicلستمراززش__VariantProps = new Array<VariantPropType>();

export type Plasmicلستمراززش__ArgsType = {
  centers?: any;
  onSelectedCenterChange?: (val: string) => void;
};
type ArgPropType = keyof Plasmicلستمراززش__ArgsType;
export const Plasmicلستمراززش__ArgProps = new Array<ArgPropType>(
  "centers",
  "onSelectedCenterChange"
);

export type Plasmicلستمراززش__OverridesType = {
  root?: Flex__<"div">;
  popoverCore?: Flex__<typeof Popover>;
  text?: Flex__<"div">;
};

export interface DefaultلستمراززشProps {
  centers?: any;
  onSelectedCenterChange?: (val: string) => void;
  className?: string;
}

const $$ = {};

function Plasmicلستمراززش__RenderFunc(props: {
  variants: Plasmicلستمراززش__VariantsArgs;
  args: Plasmicلستمراززش__ArgsType;
  overrides: Plasmicلستمراززش__OverridesType;
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
        path: "selectedCenter",
        type: "readonly",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "all",

        onChangeProp: "onSelectedCenterChange"
      },
      {
        path: "popoverCore.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
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
        sty.root
      )}
      dr={"rtl"}
    >
      <Popover
        data-plasmic-name={"popoverCore"}
        data-plasmic-override={overrides.popoverCore}
        className={classNames("__wab_instance", sty.popoverCore)}
        onOpenChange={generateStateOnChangeProp($state, [
          "popoverCore",
          "open"
        ])}
        open={generateStateValueProp($state, ["popoverCore", "open"])}
        overlay={
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__v1Jlr)}
          >
            <مرززش
              className={classNames("__wab_instance", sty.مرززش__qABnp)}
              name={"\u06a9\u0644 \u0646\u0648\u0628\u062a\u200c\u0647\u0627"}
              officeBook={undefined}
              onlineBook={undefined}
              onselected={async () => {
                const $steps = {};

                $steps["updateSelectedCenter"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["selectedCenter"]
                        },
                        operation: 0,
                        value: "all"
                      };
                      return (({
                        variable,
                        value,
                        startIndex,
                        deleteCount
                      }) => {
                        if (!variable) {
                          return;
                        }
                        const { objRoot, variablePath } = variable;

                        $stateSet(objRoot, variablePath, value);
                        return value;
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["updateSelectedCenter"] != null &&
                  typeof $steps["updateSelectedCenter"] === "object" &&
                  typeof $steps["updateSelectedCenter"].then === "function"
                ) {
                  $steps["updateSelectedCenter"] = await $steps[
                    "updateSelectedCenter"
                  ];
                }

                $steps["updateSelectedCenter2"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["popoverCore", "open"]
                        },
                        operation: 0,
                        value: false
                      };
                      return (({
                        variable,
                        value,
                        startIndex,
                        deleteCount
                      }) => {
                        if (!variable) {
                          return;
                        }
                        const { objRoot, variablePath } = variable;

                        $stateSet(objRoot, variablePath, value);
                        return value;
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["updateSelectedCenter2"] != null &&
                  typeof $steps["updateSelectedCenter2"] === "object" &&
                  typeof $steps["updateSelectedCenter2"].then === "function"
                ) {
                  $steps["updateSelectedCenter2"] = await $steps[
                    "updateSelectedCenter2"
                  ];
                }
              }}
              selected={(() => {
                try {
                  return $state.selectedCenter == "all";
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return [];
                  }
                  throw e;
                }
              })()}
            />

            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return $props.centers;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return [];
                  }
                  throw e;
                }
              })()
            ).map((__plasmic_item_0, __plasmic_idx_0) => {
              const currentItem = __plasmic_item_0;
              const currentIndex = __plasmic_idx_0;
              return (
                <مرززش
                  className={classNames("__wab_instance", sty.مرززش__s2Wjj)}
                  key={currentIndex}
                  name={(() => {
                    try {
                      return currentItem.name;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return undefined;
                      }
                      throw e;
                    }
                  })()}
                  officeBook={(() => {
                    try {
                      return (
                        currentItem.name.includes("مطب") &&
                        currentItem.type_id === 1 &&
                        currentItem.id !== "5532"
                      );
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return [];
                      }
                      throw e;
                    }
                  })()}
                  onlineBook={(() => {
                    try {
                      return currentItem.id === "5532";
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return [];
                      }
                      throw e;
                    }
                  })()}
                  onselected={async () => {
                    const $steps = {};

                    $steps["updateSelectedCenter"] = true
                      ? (() => {
                          const actionArgs = {
                            variable: {
                              objRoot: $state,
                              variablePath: ["selectedCenter"]
                            },
                            operation: 0,
                            value: currentItem.id
                          };
                          return (({
                            variable,
                            value,
                            startIndex,
                            deleteCount
                          }) => {
                            if (!variable) {
                              return;
                            }
                            const { objRoot, variablePath } = variable;

                            $stateSet(objRoot, variablePath, value);
                            return value;
                          })?.apply(null, [actionArgs]);
                        })()
                      : undefined;
                    if (
                      $steps["updateSelectedCenter"] != null &&
                      typeof $steps["updateSelectedCenter"] === "object" &&
                      typeof $steps["updateSelectedCenter"].then === "function"
                    ) {
                      $steps["updateSelectedCenter"] = await $steps[
                        "updateSelectedCenter"
                      ];
                    }

                    $steps["updateSelectedCenter2"] = true
                      ? (() => {
                          const actionArgs = {
                            variable: {
                              objRoot: $state,
                              variablePath: ["popoverCore", "open"]
                            },
                            operation: 0,
                            value: false
                          };
                          return (({
                            variable,
                            value,
                            startIndex,
                            deleteCount
                          }) => {
                            if (!variable) {
                              return;
                            }
                            const { objRoot, variablePath } = variable;

                            $stateSet(objRoot, variablePath, value);
                            return value;
                          })?.apply(null, [actionArgs]);
                        })()
                      : undefined;
                    if (
                      $steps["updateSelectedCenter2"] != null &&
                      typeof $steps["updateSelectedCenter2"] === "object" &&
                      typeof $steps["updateSelectedCenter2"].then === "function"
                    ) {
                      $steps["updateSelectedCenter2"] = await $steps[
                        "updateSelectedCenter2"
                      ];
                    }
                  }}
                  selected={(() => {
                    try {
                      return $state.selectedCenter == currentItem.id;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return [];
                      }
                      throw e;
                    }
                  })()}
                />
              );
            })}
          </Stack__>
        }
        themeResetClass={classNames(
          projectcss.root_reset,
          projectcss.plasmic_default_styles,
          projectcss.plasmic_mixins,
          projectcss.plasmic_tokens,
          plasmic_fragment_design_system_css.plasmic_tokens
        )}
      >
        <div
          className={classNames(projectcss.all, sty.freeBox__dP8GQ)}
          onClick={async event => {
            const $steps = {};

            $steps["updatePopoverCoreOpen"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["popoverCore", "open"]
                    },
                    operation: 0,
                    value: true
                  };
                  return (({ variable, value, startIndex, deleteCount }) => {
                    if (!variable) {
                      return;
                    }
                    const { objRoot, variablePath } = variable;

                    $stateSet(objRoot, variablePath, value);
                    return value;
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["updatePopoverCoreOpen"] != null &&
              typeof $steps["updatePopoverCoreOpen"] === "object" &&
              typeof $steps["updatePopoverCoreOpen"].then === "function"
            ) {
              $steps["updatePopoverCoreOpen"] = await $steps[
                "updatePopoverCoreOpen"
              ];
            }
          }}
        >
          <div
            className={classNames(projectcss.all, sty.freeBox___4EVJx)}
            dr={"rtl"}
          >
            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return (() => {
                      if ($state.selectedCenter == "all") return "کل نوبت‌ها";
                      if ($state.selectedCenter == "5532")
                        return "نوبت‌های آنلاین";
                      if (
                        $state.selectedCenter !== "5532" &&
                        $props.centers.find(
                          center => center.id == $state.selectedCenter
                        ).type_id == 1
                      )
                        return "نوبت‌های حضوری";
                    })();
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u06a9\u0644 \u0646\u0648\u0628\u062a\u200c\u0647\u0627";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </div>
            {(() => {
              try {
                return !$state.popoverCore.open;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return true;
                }
                throw e;
              }
            })() ? (
              <ChevronDownIcon
                className={classNames(projectcss.all, sty.svg___57O6W)}
                role={"img"}
              />
            ) : null}
            {(() => {
              try {
                return $state.popoverCore.open === true;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return true;
                }
                throw e;
              }
            })() ? (
              <ChevronUpIcon
                className={classNames(projectcss.all, sty.svg__deGnp)}
                role={"img"}
              />
            ) : null}
          </div>
        </div>
      </Popover>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "popoverCore", "text"],
  popoverCore: ["popoverCore", "text"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  popoverCore: typeof Popover;
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  Plasmicلستمراززش__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: Plasmicلستمراززش__VariantsArgs;
    args?: Plasmicلستمراززش__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<Plasmicلستمراززش__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      Plasmicلستمراززش__ArgsType,
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
          internalArgPropNames: Plasmicلستمراززش__ArgProps,
          internalVariantPropNames: Plasmicلستمراززش__VariantProps
        }),
      [props, nodeName]
    );
    return Plasmicلستمراززش__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName =
      "Plasmic\u0644\u0633\u062a\u0645\u0631\u0627\u0632\u0632\u0634";
  } else {
    func.displayName = `Plasmicلستمراززش.${nodeName}`;
  }
  return func;
}

export const Plasmicلستمراززش = Object.assign(
  // Top-level Plasmicلستمراززش renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    popoverCore: makeNodeComponent("popoverCore"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for Plasmicلستمراززش
    internalVariantProps: Plasmicلستمراززش__VariantProps,
    internalArgProps: Plasmicلستمراززش__ArgProps
  }
);

export default Plasmicلستمراززش;
/* prettier-ignore-end */
