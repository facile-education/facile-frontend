## Create Nero frontend from scratch with Vue.

### Install
    git clone .
    yarn / npm install

### Is installed
- Vue
- vue-cli 3.0
- vue-router
- vuex
- vue-i18n
- axios
- jest
- cypress

### VSCode config (plugins : Vetur, Vue VSCode Snippets, ESLint)
    {
      // VSCode editor
      "editor.tabSize": 2,
      "editor.formatOnSave": false,
      "editor.renderWhitespace": "boundary",
      // ESLint
      "eslint.validate": [
        "javascript",
        "javascriptreact",
        {
          "language": "vue",
          "autoFix": true
        }
      ],
      "eslint.autoFixOnSave": true,
      "eslint.packageManager": "yarn",
      //SCSS
      "scss.lint.emptyRules": "error",
      "scss.lint.important": "error",
      "scss.lint.universalSelector": "warning",  
      "scss.lint.zeroUnits": "error",
      "scss.lint.float": "warning",
      //NPM
      "npm.enableScriptExplorer": true,
      "npm.packageManager": "yarn"
    }