module.exports = {
  extends: [
    'airbnb-base/legacy'
  ],
  parserOptions: {
    'sourceType': 'module',
    ecmaVersion: 2017
  },
  env: {
    es6: true,
    browser: true,
    jasmine: true
  },
  globals: {
    inject: true,
    Promise: true,
    LE: true
  },
  rules: {
    'func-names': 0,
    'max-len': ['error', 140, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],
    'no-console': 0,
    'no-alert': 0,
    'no-restricted-syntax': 0,
    'no-loop-func': 0,
    'no-use-before-define': 0,
    'no-var': 0,
    'no-plusplus': 0,
    'no-extra-boolean-cast': 0,
    'quote-props': 0,
    'const': 0,
    'object-shorthand': 0,
    'prefer-arrow-callback': 0,
    'vars-on-top': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'wrap-iife': 0
  }
};
