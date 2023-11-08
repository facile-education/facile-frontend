export default {
  notBeginByDot,
  containsNoCotes,
  isUnderMaxSize,
  isNotEmpty,
  isValidURL
}

function notBeginByDot (str) {
  return str[0] !== '.'
}

function containsNoCotes (str) {
  return !str.includes('\'') && !str.includes('"')
}

function isUnderMaxSize (str, maxSize) {
  return str.length <= maxSize
}

function isNotEmpty (list) {
  return list.length > 0
}

function isValidURL (url) { // TODO: Move to utils?
  const pattern = new RegExp('^(https?:\\/\\/)?' + // Protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // Request string
    '(\\#[-a-z\\d_]*)?$', 'i') // Fragment
  return !!pattern.test(url)
}
