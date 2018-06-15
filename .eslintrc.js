module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 8,
    sourceType: 'module'
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ]
}