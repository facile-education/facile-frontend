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
  },
  Cookies: {
    getCookie (cookieName) {
      var name = cookieName + '='
      var decodedCookie = decodeURIComponent(document.cookie)
      var cookieAttributeList = decodedCookie.split(';')
      for (var i = 0; i < cookieAttributeList.length; i++) {
        var attribute = cookieAttributeList[i]
        while (attribute.charAt(0) === ' ') {
          attribute = attribute.substring(1)
        }
        if (attribute.indexOf(name) === 0) {
          return attribute.substring(name.length, attribute.length)
        }
      }
      return ''
    }
  }
}

export default NeroUtils
