module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  rules: {
    'arrow-parens': [2, 'as-needed'],
    'function-paren-newline': 0,
    'no-mixed-operators': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-use-before-define': 0,
    'object-curly-newline': 0,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
  },
  env: {
    browser: true,
  },
};
