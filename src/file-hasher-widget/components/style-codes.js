const styleCodes = {
  code: ['file_hasher_widget--wrapper'],
  title: {
    code: ['title'],
    container: {
      code: ['title_container'],
    }
  },
  hash: {
    code: ['hash'],
    container: {
      code: ['hash_container'],
    }
  },
  error: {
    code: ['error'],
    container: {
      code: ['error_container'],
    }
  },
  drop: {
    code: ['drop_container'],
    body: {
      code: ['drop_container--body'],
      icon: {
        code: ['drop_container--body-icon']
      },
      input: {
        code: ['drop_container--body-file_input']
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
    },
    title: {
      code: ['preview_container--title'],
      wrapper: {
        code: ['preview_container--title_wrapper']
      }
    }
  },
  progress: {
    container: {
      code: ['progress_bar--container']
    },
    bar: {
      code: ['progress_bar']
    },
    control: {
      code: ['progress_bar--control'],
      icon: {
        code: ['progress_bar--control-icon']
      },
    },
    wrapper: {
      code: ['progress_bar--wrapper']
    },
    body: {
      code: ['progress_bar--body']
    },
    title: {
      code: ['progress_bar--title'],
      span: {
        code: ['progress_bar--title__span']
      }
    }
  },
  
  /*common styles*/
  widget: {
    hidden:['woleet_widget_hidden']
  }
};

export default styleCodes;
