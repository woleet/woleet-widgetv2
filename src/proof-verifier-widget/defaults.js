import constants from "Common/constants";

function getProofVerifierWidgetDefaults() {
  return {
    styles: {
      zindex: 3,
      icon: {
        width: null,
        height: null
      },
      banner: {
        width: '600px'
      },
      panel: {
        width: null,
        height: '400px',
        title: {
          background_color: 'none',
          color: '#31708f',
          light: {
            background_color: '#D7E9F6',
            color: '#31708f',
          },
          dark: {
            background_color: '#31708f',
            color: '#fff',
          }
        }
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
