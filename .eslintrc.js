module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-recommended', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off' // Ignore but we have to sanitize all of them
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
