export default {
  notBeginByDot,
  containsNoCotes,
  isUnderMaxSize,
  isNotEmpty
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
