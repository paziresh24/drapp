// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
/** @jsxImportSource @plasmicapp/react-web-runtime */
// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: rqmTJ9WSF4RQaQFCvo2iUX
// Component: oTc6QTbblo0F
import * as React from "react";
import {
  Stack as Stack__,
  classNames,
  createPlasmicElementProxy,
  deriveRenderOpts,
  generateStateOnChangeProp,
  generateStateValueProp,
  initializePlasmicStates,
  set as $stateSet,
  useCurrentUser,
  useDollarState
} from "@plasmicapp/react-web";
import { useDataEnv } from "@plasmicapp/react-web/lib/host";
import Checkbox from "../../Checkbox"; // plasmic-import: WT38Ke_Z_eCs/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import "@plasmicapp/react-web/lib/plasmic.css";
import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: rqmTJ9WSF4RQaQFCvo2iUX/projectcss
import sty from "./PlasmicDaysOfWeek.module.css"; // plasmic-import: oTc6QTbblo0F/css

export const PlasmicDaysOfWeek__VariantProps = new Array();

export const PlasmicDaysOfWeek__ArgProps = new Array(
  "selectedDay",
  "selectTrigger",
  "cancelTrigger"
);

const $$ = {};

function PlasmicDaysOfWeek__RenderFunc(props) {
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
  const stateSpecs = React.useMemo(
    () => [
      {
        path: "selectAll.isChecked",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "daysofweek[].isChecked",
        type: "private",
        variableType: "boolean"
      },
      {
        path: "days",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => [
          { id: 6, name: "\u0634\u0646\u0628\u0647", nameEn: "Saturday" },
          {
            id: 7,
            name: "\u06cc\u06a9\u0634\u0646\u0628\u0647",
            nameEn: "Sunday"
          },
          {
            id: 1,
            name: "\u062f\u0648\u0634\u0646\u0628\u0647",
            nameEn: "Monday"
          },
          {
            id: 2,
            name: "\u0633\u0647\u200c\u0634\u0646\u0628\u0647",
            nameEn: "Tuesday"
          },
          {
            id: 3,
            name: "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
            nameEn: "Wednesday"
          },
          {
            id: 4,
            name: "\u067e\u0646\u062c\u200c\u0634\u0646\u0628\u0647",
            nameEn: "Thursday"
          },
          { id: 5, name: "\u062c\u0645\u0639\u0647", nameEn: "Friday" }
        ]
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
    >
      <div
        data-plasmic-name={"text"}
        data-plasmic-override={overrides.text}
        className={classNames(projectcss.all, projectcss.__wab_text, sty.text)}
      >
        {
          "\u06a9\u067e\u06cc \u0633\u0627\u0639\u062a \u06a9\u0627\u0631\u06cc \u0628\u0631\u0627\u06cc \u0631\u0648\u0632\u0647\u0627\u06cc :"
        }
      </div>
      <Checkbox
        data-plasmic-name={"selectAll"}
        data-plasmic-override={overrides.selectAll}
        className={classNames("__wab_instance", sty.selectAll)}
        isChecked={
          generateStateValueProp($state, ["selectAll", "isChecked"]) ?? false
        }
        onChange={(...eventArgs) => {
          generateStateOnChangeProp($state, ["selectAll", "isChecked"])(
            eventArgs[0]
          );
        }}
      >
        {"\u0627\u0646\u062a\u062e\u0627\u0628 \u0647\u0645\u0647 "}
      </Checkbox>
      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return $state.days;
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
        return (() => {
          const child$Props = {
            className: classNames("__wab_instance", sty.daysofweek),
            isChecked:
              generateStateValueProp($state, [
                "daysofweek",
                __plasmic_idx_0,
                "isChecked"
              ]) ?? false,
            isDisabled: (() => {
              try {
                return $props.selectedDay === currentItem.id;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return [];
                }
                throw e;
              }
            })(),
            key: currentIndex,
            onChange: (...eventArgs) => {
              generateStateOnChangeProp($state, [
                "daysofweek",
                __plasmic_idx_0,
                "isChecked"
              ])(eventArgs[0]);
            }
          };
          initializePlasmicStates(
            $state,
            [
              {
                name: "daysofweek[].isChecked",
                initFunc: ({ $props, $state, $queries }) =>
                  (() => {
                    try {
                      return (
                        $state.selectAll.isChecked === true ||
                        $props.selectedDay === currentItem.id
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
                  })()
              }
            ],

            [__plasmic_idx_0]
          );
          return (
            <Checkbox
              data-plasmic-name={"daysofweek"}
              data-plasmic-override={overrides.daysofweek}
              {...child$Props}
            >
              <div
                data-plasmic-name={"\u0634\u0646\u0628\u06472"}
                data-plasmic-override={overrides.شنبه2}
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.شنبه2
                )}
              >
                <React.Fragment>
                  {(() => {
                    try {
                      return currentItem.name;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "\u0634\u0646\u0628\u0647";
                      }
                      throw e;
                    }
                  })()}
                </React.Fragment>
              </div>
            </Checkbox>
          );
        })();
      })}
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
      >
        <Button
          data-plasmic-name={"apply"}
          data-plasmic-override={overrides.apply}
          children2={"\u062b\u0628\u062a"}
          className={classNames("__wab_instance", sty.apply)}
          onClick={async event => {
            const $steps = {};
            $steps["runSelectTrigger"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["selectTrigger"],
                    args: [
                      (() => {
                        try {
                          return $state.daysofweek
                            .map((item, index) =>
                              item.isChecked ? $state.days[index].id : false
                            )
                            .filter(Boolean);
                        } catch (e) {
                          if (
                            e instanceof TypeError ||
                            e?.plasmicType === "PlasmicUndefinedDataError"
                          ) {
                            return undefined;
                          }
                          throw e;
                        }
                      })()
                    ]
                  };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runSelectTrigger"] != null &&
              typeof $steps["runSelectTrigger"] === "object" &&
              typeof $steps["runSelectTrigger"].then === "function"
            ) {
              $steps["runSelectTrigger"] = await $steps["runSelectTrigger"];
            }
          }}
        />

        <Button
          data-plasmic-name={"cancel"}
          data-plasmic-override={overrides.cancel}
          children2={"\u0627\u0646\u0635\u0631\u0627\u0641"}
          className={classNames("__wab_instance", sty.cancel)}
          color={"softSand"}
          onClick={async event => {
            const $steps = {};
            $steps["runCode"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return $state.daysofweek.forEach((day, index) => {
                        if (
                          day.isChecked &&
                          $state.days[index].id !== $props.selectedDay
                        ) {
                          day.isChecked = false;
                        }
                      });
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runCode"] != null &&
              typeof $steps["runCode"] === "object" &&
              typeof $steps["runCode"].then === "function"
            ) {
              $steps["runCode"] = await $steps["runCode"];
            }
            $steps["updateSelectAllIsChecked"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["selectAll", "isChecked"]
                    },
                    operation: 0,
                    value: false
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
              $steps["updateSelectAllIsChecked"] != null &&
              typeof $steps["updateSelectAllIsChecked"] === "object" &&
              typeof $steps["updateSelectAllIsChecked"].then === "function"
            ) {
              $steps["updateSelectAllIsChecked"] = await $steps[
                "updateSelectAllIsChecked"
              ];
            }
            $steps["updateSelectAllIsChecked2"] = true
              ? (() => {
                  const actionArgs = { eventRef: $props["cancelTrigger"] };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["updateSelectAllIsChecked2"] != null &&
              typeof $steps["updateSelectAllIsChecked2"] === "object" &&
              typeof $steps["updateSelectAllIsChecked2"].then === "function"
            ) {
              $steps["updateSelectAllIsChecked2"] = await $steps[
                "updateSelectAllIsChecked2"
              ];
            }
          }}
        />
      </Stack__>
    </Stack__>
  );
}

const PlasmicDescendants = {
  root: [
    "root",
    "text",
    "selectAll",
    "daysofweek",
    "\u0634\u0646\u0628\u06472",
    "freeBox",
    "apply",
    "cancel"
  ],

  text: ["text"],
  selectAll: ["selectAll"],
  daysofweek: ["daysofweek", "\u0634\u0646\u0628\u06472"],
  شنبه2: ["\u0634\u0646\u0628\u06472"],
  freeBox: ["freeBox", "apply", "cancel"],
  apply: ["apply"],
  cancel: ["cancel"]
};

function makeNodeComponent(nodeName) {
  const func = function (props) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: PlasmicDescendants[nodeName],
          internalArgPropNames: PlasmicDaysOfWeek__ArgProps,
          internalVariantPropNames: PlasmicDaysOfWeek__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicDaysOfWeek__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicDaysOfWeek";
  } else {
    func.displayName = `PlasmicDaysOfWeek.${nodeName}`;
  }
  return func;
}

export const PlasmicDaysOfWeek = Object.assign(
  // Top-level PlasmicDaysOfWeek renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),
    selectAll: makeNodeComponent("selectAll"),
    daysofweek: makeNodeComponent("daysofweek"),
    شنبه2: makeNodeComponent("\u0634\u0646\u0628\u06472"),
    freeBox: makeNodeComponent("freeBox"),
    apply: makeNodeComponent("apply"),
    cancel: makeNodeComponent("cancel"),
    // Metadata about props expected for PlasmicDaysOfWeek
    internalVariantProps: PlasmicDaysOfWeek__VariantProps,
    internalArgProps: PlasmicDaysOfWeek__ArgProps
  }
);

export default PlasmicDaysOfWeek;
/* prettier-ignore-end */