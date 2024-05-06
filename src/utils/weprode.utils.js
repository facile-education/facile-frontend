const WeprodeUtils = {
  filterArray (filter, array, property) {
    filter = WeprodeUtils.normalize(filter)

    return array.filter((item) => {
      if (filter.length === 0) {
        return true
      }

      const value = (property !== undefined) ? item[property] : item
      return WeprodeUtils.normalize(value).includes(filter)
    })
  },

  sortArrayWithString (array, reversed = false, property) {
  // sort array based on alphabetic order of property
    const sortedArray = array.slice()

    function compare (a, b) {
      if (property !== undefined) {
        a = a[property]
        b = b[property]
      }
      a = WeprodeUtils.normalize(a)
      b = WeprodeUtils.normalize(b)

      if (reversed) {
        if (a < b) return 1
        if (a > b) return -1
      } else {
        if (a < b) return -1
        if (a > b) return 1
      }
      return 0
    }

    return sortedArray.sort(compare)
  },

  getCookie (cookieName) {
    const name = cookieName + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieAttributeList = decodedCookie.split(';')
    for (let i = 0; i < cookieAttributeList.length; i++) {
      let attribute = cookieAttributeList[i]
      while (attribute.charAt(0) === ' ') {
        attribute = attribute.substring(1)
      }
      if (attribute.indexOf(name) === 0) {
        return attribute.substring(name.length, attribute.length)
      }
    }
    return ''
  },

  daysBetween (first, second) {
  // Copy date parts of the timestamps, discarding the time parts.
    const one = new Date(first.getFullYear(), first.getMonth(), first.getDate())
    const two = new Date(second.getFullYear(), second.getMonth(), second.getDate())

    // Do the math.
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    const millisBetween = two.getTime() - one.getTime()
    const days = millisBetween / millisecondsPerDay

    // Round down.
    return Math.floor(days)
  },

  deepCopy (jsonObject) {
    return JSON.parse(JSON.stringify(jsonObject))
  },

  isValidJson (str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  },

  // Strip string from accented characters, uppercase and useless whitespaces
  normalize (str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  },

  // Change theme color
  updateColor (color, newColor) {
    const themeTag = document.getElementById('theme-color')
    const regExp = new RegExp(color, 'g')
    themeTag.innerHTML = themeTag.innerHTML.replace(regExp, newColor)
  },

  params (obj) {
    return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
  }
}
export default WeprodeUtils
