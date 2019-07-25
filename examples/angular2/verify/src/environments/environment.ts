export const environment = {
  production: false,
  apiEndpoint: 'https://api.woleet.io/v1',
  widget: {
    configuration: {
      fileHasher: {
        lang: 'fr',
        styles: { width: '100%', icon: { color: '#258C90' } },
        observers: {}
      },
      proofVerifier: {
        lang: 'fr',
        verification: {
          server: false
        },
        mode: 'banner',
        styles: {
          zindex: 20,
          width: '100%',
          icon: {
            width: '32px',
            height: '36px'
          }
        }
      }
    }
  }
};
