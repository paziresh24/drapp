// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
/** @jsxImportSource @plasmicapp/react-web-runtime */
// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: rqmTJ9WSF4RQaQFCvo2iUX
// Component: ci4bkEJ4_oQw
import * as React from "react";
import {
  classNames,
  createPlasmicElementProxy,
  deriveRenderOpts,
  useCurrentUser,
  useDollarState
} from "@plasmicapp/react-web";
import { useDataEnv } from "@plasmicapp/react-web/lib/host";
import "@plasmicapp/react-web/lib/plasmic.css";
import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: rqmTJ9WSF4RQaQFCvo2iUX/projectcss
import sty from "./PlasmicFreeTurnBook.module.css"; // plasmic-import: ci4bkEJ4_oQw/css

export const PlasmicFreeTurnBook__VariantProps = new Array();

export const PlasmicFreeTurnBook__ArgProps = new Array(
  "centerId",
  "userCenterId",
  "serviceId"
);

const $$ = {};

function PlasmicFreeTurnBook__RenderFunc(props) {
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
        path: "bookdate",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => ({})
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
      <div className={classNames(projectcss.all, sty.freeBox__sx4Kl)}>
        <div className={classNames(projectcss.all, sty.freeBox__rpBeo)}>
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
                    const url = `https://apigw.paziresh24.com/v2/freeturns?center_id=${$props.centerId}&user_center_id=${$props.userCenterId}&service_id=${$props.serviceId}&from=${$state.bookdate[0].data.result[0].from}`;
                    return fetch(url)
                      .then(response => response.json())
                      .then(data => ($state.bookdate = data));
                  })();
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "15:35";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </div>
        </div>
      </div>
    </div>
  );
}

const PlasmicDescendants = {
  root: ["root", "text"],
  text: ["text"]
};

function makeNodeComponent(nodeName) {
  const func = function (props) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: PlasmicDescendants[nodeName],
          internalArgPropNames: PlasmicFreeTurnBook__ArgProps,
          internalVariantPropNames: PlasmicFreeTurnBook__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFreeTurnBook__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFreeTurnBook";
  } else {
    func.displayName = `PlasmicFreeTurnBook.${nodeName}`;
  }
  return func;
}

export const PlasmicFreeTurnBook = Object.assign(
  // Top-level PlasmicFreeTurnBook renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),
    // Metadata about props expected for PlasmicFreeTurnBook
    internalVariantProps: PlasmicFreeTurnBook__VariantProps,
    internalArgProps: PlasmicFreeTurnBook__ArgProps
  }
);

export default PlasmicFreeTurnBook;
/* prettier-ignore-end */
