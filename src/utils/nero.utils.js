var NeroUtils = {
  JSON: {
    deepCopy (jsonObject) {
      return JSON.parse(JSON.stringify(jsonObject))
    }
  },
  String: {
    normalize (str) {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    }
  },
  Theme: {
    updateColor (color, newColor) {
      var themeTag = document.getElementById('theme-color')
      var regExp = new RegExp(color, 'g')
      themeTag.innerHTML = themeTag.innerHTML.replace(regExp, newColor)
    }
  },
  URL: {
    params (obj) {
      return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
    }
  }
}

export default NeroUtils
