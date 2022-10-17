import { entityNameMaxSize } from '@/constants/appConstants'

export default {
  notBeginByDot,
  containsNoCotes,
  isUnderMaxSize
}

function notBeginByDot (str) {
  return str[0] !== '.'
}

function containsNoCotes (str) {
  return !str.includes('\'') && !str.includes('"')
}

function isUnderMaxSize (str) {
  return str.length <= entityNameMaxSize
}
