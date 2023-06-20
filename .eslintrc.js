module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['simple-import-sort'],
  extends: ['plugin:vue/vue3-recommended', '@vue/standard'],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off', // Ignore but we have to sanitize all of them
    'simple-import-sort/imports': 'error'
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  }
}
