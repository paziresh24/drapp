// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
/** @jsxImportSource @plasmicapp/react-web-runtime */
// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: rqmTJ9WSF4RQaQFCvo2iUX
// Component: VnVeQfvp9iDS
import * as React from "react";
import {
  classNames,
  createPlasmicElementProxy,
  deriveRenderOpts,
  hasVariant,
  renderPlasmicSlot,
  useCurrentUser,
  useDollarState
} from "@plasmicapp/react-web";
import { useDataEnv } from "@plasmicapp/react-web/lib/host";
import * as pp from "@plasmicapp/react-web";
import Select__Option from "../../Select__Option"; // plasmic-import: _Ly0NX0qIjFf/component
import "@plasmicapp/react-web/lib/plasmic.css";
import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: rqmTJ9WSF4RQaQFCvo2iUX/projectcss
import sty from "./PlasmicSelect__OptionGroup.module.css"; // plasmic-import: VnVeQfvp9iDS/css
import SUPER__PlasmicSelect from "./PlasmicSelect"; // plasmic-import: OzXPMxUo1TiP/render

export const PlasmicSelect__OptionGroup__VariantProps = new Array(
  "noTitle",
  "isFirst"
);

export const PlasmicSelect__OptionGroup__ArgProps = new Array(
  "children",
  "title"
);

const $$ = {};

function PlasmicSelect__OptionGroup__RenderFunc(props) {
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
        path: "noTitle",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.noTitle
      },
      {
        path: "isFirst",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isFirst
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
  const superContexts = {
    Select: React.useContext(SUPER__PlasmicSelect.Context)
  };
  return (
    <div
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
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
      {(hasVariant($state, "isFirst", "isFirst") ? false : true) ? (
        <div
          data-plasmic-name={"separator"}
          data-plasmic-override={overrides.separator}
          className={classNames(projectcss.all, sty.separator, {
            [sty.separatorisFirst]: hasVariant($state, "isFirst", "isFirst"),
            [sty.separatornoTitle]: hasVariant($state, "noTitle", "noTitle")
          })}
        />
      ) : null}
      {(hasVariant($state, "noTitle", "noTitle") ? false : true) ? (
        <div
          data-plasmic-name={"titleContainer"}
          data-plasmic-override={overrides.titleContainer}
          className={classNames(projectcss.all, sty.titleContainer, {
            [sty.titleContainerisFirst]: hasVariant(
              $state,
              "isFirst",
              "isFirst"
            ),
            [sty.titleContainernoTitle]: hasVariant(
              $state,
              "noTitle",
              "noTitle"
            )
          })}
        >
          {renderPlasmicSlot({
            defaultContents: "Group Name",
            value: args.title,
            className: classNames(sty.slotTargetTitle)
          })}
        </div>
      ) : null}
      <div
        data-plasmic-name={"optionsContainer"}
        data-plasmic-override={overrides.optionsContainer}
        className={classNames(projectcss.all, sty.optionsContainer)}
      >
        {renderPlasmicSlot({
          defaultContents: (
            <React.Fragment>
              <Select__Option
                className={classNames("__wab_instance", sty.option__c0Cgm)}
              />

              <Select__Option
                className={classNames("__wab_instance", sty.option__lmt2J)}
              />
            </React.Fragment>
          ),

          value: args.children
        })}
      </div>
    </div>
  );
}

function useBehavior(props) {
  return pp.useSelectOptionGroup(PlasmicSelect__OptionGroup, props, {
    noTitleVariant: { group: "noTitle", variant: "noTitle" },
    isFirstVariant: { group: "isFirst", variant: "isFirst" },
    optionsSlot: "children",
    titleSlot: "title",
    root: "root",
    separator: "separator",
    titleContainer: "titleContainer",
    optionsContainer: "optionsContainer"
  });
}

const PlasmicDescendants = {
  root: ["root", "separator", "titleContainer", "optionsContainer"],
  separator: ["separator"],
  titleContainer: ["titleContainer"],
  optionsContainer: ["optionsContainer"]
};

function makeNodeComponent(nodeName) {
  const func = function (props) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: PlasmicDescendants[nodeName],
          internalArgPropNames: PlasmicSelect__OptionGroup__ArgProps,
          internalVariantPropNames: PlasmicSelect__OptionGroup__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSelect__OptionGroup__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSelect__OptionGroup";
  } else {
    func.displayName = `PlasmicSelect__OptionGroup.${nodeName}`;
  }
  return func;
}

export const PlasmicSelect__OptionGroup = Object.assign(
  // Top-level PlasmicSelect__OptionGroup renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    separator: makeNodeComponent("separator"),
    titleContainer: makeNodeComponent("titleContainer"),
    optionsContainer: makeNodeComponent("optionsContainer"),
    // Metadata about props expected for PlasmicSelect__OptionGroup
    internalVariantProps: PlasmicSelect__OptionGroup__VariantProps,
    internalArgProps: PlasmicSelect__OptionGroup__ArgProps,
    useBehavior
  }
);

export default PlasmicSelect__OptionGroup;
/* prettier-ignore-end */