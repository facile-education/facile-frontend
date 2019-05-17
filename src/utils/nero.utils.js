import moment from 'moment'

var NeroUtils = {
  Array: {
    // Filter array with string
    filter (filter, array, property) {
      filter = NeroUtils.String.normalize(filter)

      return array.filter((item) => {
        if (filter.length === 0) {
          return true
        }

        var value = (property !== undefined) ? item[property] : item
        return NeroUtils.String.normalize(value).includes(filter)
      })
    },
    sortWithString (array, property, sortedType = undefined) {
      // sort array based on alphabetic order of property
      var sortedArray = array.slice()

      function compare (a, b) {
        if (property !== undefined) {
          a = a[property]
          b = b[property]
        }
        a = NeroUtils.String.normalize(a)
        b = NeroUtils.String.normalize(b)

        if (sortedType === 'reversed') {
          if (a < b) return 1
          if (a > b) return -1
        } else {
          if (a < b) return -1
          if (a > b) return 1
        }
        return 0
      }

      return sortedArray.sort(compare)
    }
  },
  Cookies: {
    // Return cookie value
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
  },
  Date: {
    // Format date in parameter
    formatToString (momentDate) {
      var today = moment()
      var lastWeek = moment().subtract(7, 'days')

      // If the day is today
      if (momentDate.isSame(today, 'day')) {
        return momentDate.format('LT')

      // Compare if date is in last 7 days
      } else if (momentDate.isAfter(lastWeek, 'days') && momentDate.isBefore(today, 'days')) {
        return momentDate.format('dddd')

      // If date is before last week or in the future
      } else {
        return momentDate.format('L')
      }
    }
  },
  Document: {
    File: {
      // Extensions used in Nero app
      Extension: {
        audioExtensionList: ['mp3', 'wav', 'wma'],
        convertExtensionList: ['wav', 'wma', 'avi', 'm4v', 'mpg', 'mpeg', 'mov'],
        documentExtensionList: ['pdf'],
        imageExtensionList: ['gif', 'jpeg', 'jpg', 'png'],
        officeExtensionList: ['odp', 'ppt', 'sxi', 'csv', 'ods', 'sxc', 'tsv', 'xls', 'doc', 'odt', 'rtf', 'sxw', 'txt', 'docx', 'xlsx', 'pptx'],
        otherExtensionList: ['epub', 'html'],
        supportedExtensionList () {
          // TODO condition on officeExtensions
          return [...this.documentExtensionList, ...this.officeExtensionList,
            ...this.imageExtensionList, ...this.audioExtensionList,
            ...this.videoExtensionList, ...this.otherExtensionList]
        },
        videoExtensionList: ['mp4', 'avi', 'm4v', 'mpg', 'mpeg', 'mov']
      },
      isViewable (fileName) {
        var extension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase()
        return (NeroUtils.Document.File.Extension.supportedExtensionList().includes(extension))
      }
    }
  },
  JSON: {
    // Return a copy of the jsonObject
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
    }

  },
  String: {
    // Strip string from accented characters, uppercase and useless whitespaces
    normalize (str) {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    }
  },
  Theme: {
    // Change theme color
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
