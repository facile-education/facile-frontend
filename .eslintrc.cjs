module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  plugins: ['simple-import-sort'],
  extends: ['plugin:vue/vue3-recommended', '@vue/standard'],
  rules: {
    'no-console': 'off',
    // 'no-debugger': import.meta.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': 'off', // Ignore but we have to sanitize all of them
    'simple-import-sort/imports': 'error',
    'vue/multi-word-component-names': 'off'
  }
}
