import constants from "Common/constants";

function getDefaultLanguage() {
  return constants.DEFAULT_WIDGET_LANGUAGE;
}

function getProofVerifierWidgetDefaults() {
  return {
    styles: {
      width: '130px',
      icon: {
        width: '40px',
        height: '45px'
      }
    },
    verification: {
      server: true
    },
    receipt: {
      url: null
    },
    lang: constants.DEFAULT_WIDGET_LANGUAGE,
    type: constants.PROOF_VERIFIER_WIDGET_TYPE,
    mode: constants.PROOF_VERIFIER_MODE_ICON
  };
}

export {
  getDefaultLanguage,
  getProofVerifierWidgetDefaults,
}
