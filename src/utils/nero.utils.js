var NeroUtils = {
  JSON: {
    deepCopy: (jsonObject) => {
      return JSON.parse(JSON.stringify(jsonObject))
    }
  },
  String: {
    normalize: (str) => {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
    }
  }
}

export default NeroUtils
