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
        color: '#31708f',
        background: '#dff0d8',
      },
      panel: {
        width: null,
        height: '400px',
        color: '#333',
        background: '#dff0d8',
        header: {
          color: '#31708f'
        },
        control: {
          color: '#31708f',
          background: '#EEE',
        },
        value: {
          background: 'none',
          color: '#31708f',
          style: {
            anchoredHash: {
              background: '#D7E9F6',
              color: '#31708f',
            },
            signedHash: {
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
