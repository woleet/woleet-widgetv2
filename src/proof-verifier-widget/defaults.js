import constants from 'Common/constants';
import constantsProofVerifierWidget from 'ProofVerifierWidget/services/constants';

// Default configuration of the widget. For more information check the README file
function getProofVerifierWidgetDefaults() {
  return {
    styles: {
      zindex: 3,
      width: '600px',
      icon: {
        width: '32px',
        height: '32px'
      },
      banner: {
        color: '#555555',
        background: '#FBFBFB'
      },
      panel: {
        color: '#999999',
        background: '#FBFBFB',
        header: {
          color: '#555555'
        },
        control: {
          color: '#555555',
          background: '#FBFBFB'
        },
        value: {
          background: 'none',
          color: '#555555',
          style: {
            anchoredHash: {
              background: '#EBEBEB',
              color: '#555555'
            },
            signedHash: {
              background: '#EBEBEB',
              color: '#555555'
            }
          }
        }
      }
    },
    verification: {
      client: true
    },
    receipt: {
      url: null,
      payload: null
    },
    endpoints: {
      transaction: null,
      verification: null,
      identification: null
    },
    lang: constants.DEFAULT_WIDGET_LANGUAGE,
    mode: constantsProofVerifierWidget.PROOF_VERIFIER_MODE_ICON
  };
}

export {
  getProofVerifierWidgetDefaults
};
