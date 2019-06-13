const styleCodes = {
  // Define all style codes to control uniqueness of class names
  code: ['proof_verifier_widget--wrapper'],
  
  containers: {
    code: ['container'],
  },

  iconContainer: {
    code: ['icon_container'],
    icon: {
      code: ['icon_container-icon']
    }
  },

  bannerContainer: {
    code: ['banner_container'],
    wrapper: {
      code: ['banner_container--wrapper'],
      title: {
        code: ['banner_container--wrapper-title']
      }
    }
  },

  panelContainer: {
    code: ['panel_container'],
    wrapper: {
      code: ['panel_container--wrapper'],
      icon: {
        code: ['panel_container--wrapper-icon']
      }
    },
    label: {
      code: ['panel_container--label'],
    },
    title: {
      code: ['panel_container--title'],
      label: {
        code: ['panel_container--title-item', 'panel_container--title-label']
      },
      value: {
        code: ['panel_container--title-item', 'panel_container--title-value']
      },
      valueFilled: {
        code: ['panel_container--title-item', 'panel_container--title-value_filled']
      }
    },
    common: {
      code: ['panel_container--common'],
      wrapper: {
        code: ['panel_container--common_wrapper']
      },
      item: {
        code: ['panel_container--common-item']
      }
    },
    sign: {
      code: ['panel_container--sign'],
      wrapper: {
        code: ['panel_container--sign_wrapper']
      },
      item: {
        code: ['panel_container--sign-item']
      }
    },
    anchor: {
      code: ['panel_container--anchor'],
      wrapper: {
        code: ['panel_container--anchor_wrapper']
      },
      item: {
        code: ['panel_container--anchor-item']
      }
    },
    control: {
      code: ['panel_container--control'],
      wrapper: {
        code: ['panel_container--control_wrapper']
      },
      item: {
        code: ['panel_container--control-item']
      }
    }
  },

  error: {
    code: ['error'],
    container: {
      code: ['error_container'],
    }
  },

  // Common styles
  widget: {
    hidden:['woleet_widget_hidden'],
    cursorPointer: ['cursor-pointer']
  }
};

export default styleCodes;
