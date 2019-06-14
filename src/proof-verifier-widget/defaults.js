import constants from "Common/constants";

// Default configuration of the widget. For more information check the README file
function getProofVerifierWidgetDefaults() {
  return {
    styles: {
      zindex: 3,
      icon: {
        width: '45px',
        height: '45px'
      },
      banner: {
        width: '600px',
        color: ''
      },
      panel: {
        width: null,
        height: '400px',
        value: {
          background: 'none',
          color: '#31708f',
          theme: {
            light: {
              background: '#D7E9F6',
              color: '#31708f',
            },
            dark: {
              background: '#31708f',
              color: '#fff',
            }
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
    lang: constants.DEFAULT_WIDGET_LANGUAGE,
    mode: constants.PROOF_VERIFIER_MODE_ICON
  };
}

export {
  getProofVerifierWidgetDefaults,
}
