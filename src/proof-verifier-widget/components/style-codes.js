const styleCodes = {
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
  
  /*common styles*/
  widget: {
    hidden:['woleet_widget_hidden'],
    cursorPointer: ['cursor-pointer']
  }
};

export default styleCodes;
