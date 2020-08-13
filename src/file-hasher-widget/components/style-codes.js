const styleCodes = {
  // Define all style codes to control uniqueness of class names
  code: ['file_hasher_widget--wrapper'],
  error: {
    code: ['error'],
    container: {
      code: ['error_container']
    }
  },
  drop: {
    code: ['drop_container'],
    body: {
      code: ['drop_container--body'],
      input: {
        code: ['drop_container--body-input']
      }
    }
  },
  download: {
    code: ['download_container'],
    body: {
      code: ['download_container--body'],
      icon: {
        code: ['download_container--body-icon']
      }
    }
  },
  preview: {
    code: ['preview_container'],
    body: {
      code: ['preview_container--body'],
      icon: {
        code: ['preview_container--body-icon']
      },
      image: {
        code: ['preview_container--body-image'],
        wrapper: {
          code: ['preview_container--body-image_wrapper']
        }
      }
    },
    pdf: {
      code: ['preview_container--pdf'],
      canvas: {
        code: ['preview_container--pdf-canvas'],
        wrapper: {
          code: ['preview_container--pdf-canvas_wrapper']
        }
      },
      control: {
        code: ['preview_container--pdf-control'],
        icon: {
          code: ['preview_container--pdf-control_icon'],
          prev: {
            code: ['preview_container--pdf-control_icon', 'preview_container--pdf-control_icon--prev']
          },
          next: {
            code: ['preview_container--pdf-control_icon', 'preview_container--pdf-control_icon--next']
          }
        }
      }
    },
    control: {
      code: ['preview_container--control'],
      icon: {
        code: ['preview_container--control_icon'],
        redo: {
          code: ['preview_container--control_icon', 'preview_container--control_icon--redo']
        }
      }
    }
  },

  // common styles
  widget: {
    hidden: ['woleet_widget_hidden']
  }
};

export default styleCodes;
