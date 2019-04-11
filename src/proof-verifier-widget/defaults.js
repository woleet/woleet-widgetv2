import constants from "Common/constants";

function getProofVerifierWidgetDefaults() {
  return {
    styles: {
      icon: {
        width: null,
        height: null
      },
      banner: {
        width: '50px'
      },
      panel: {
        width: null,
        height: '400px'
      }
    },
    verification: {
      server: true
    },
    receipt: {
      url: null
    },
    proven_file: {
      url: null
    },
    lang: constants.DEFAULT_WIDGET_LANGUAGE,
    type: constants.PROOF_VERIFIER_WIDGET_TYPE,
    mode: constants.PROOF_VERIFIER_MODE_ICON
  };
}

export {
  getProofVerifierWidgetDefaults,
}
