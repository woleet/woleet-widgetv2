export const environment = {
  production: false,
  widget: {
    configuration: {
      fileHasher: {
        lang: 'fr',
        styles: { width: '100%', icon: { color: '#258C90' } },
        observers: {}
      },
      proofVerifier: {
        id: 'my-id-todo',
        lang: 'fr',
        verification: {
          server: false
        },
        mode: 'banner',
        styles: {
          zindex: 20,
          icon: {
            width: '32px',
            height: '36px'
          },
          banner: {
            width: '800px'
          }
        },
        receipt: {
          url: 'https://api.woleet.io/v1/receipt/54ceeadc-e2e2-4d37-b76c-432ddf4b3967'
        }
      }
    }
  }
};
