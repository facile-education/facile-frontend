import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
// import localeData from 'dayjs/plugin/localeData'

dayjs.extend(LocalizedFormat)
// dayjs.extend(localeData)

console.log(fr)
dayjs.locale(fr)

// Set current date to Wednesday, may 5th
const now = dayjs('2021-05-05T16:00:00.000Z')
const url = '/nero/not-usual-slots'
const groupName = '0922R2'
const studentName = 'ANYA ALOSTA (1051AC)'
const studentSearch = 'alo'
const teacherName = 'Darko Jovanovic (Maitre)'
const teacherSearch = 'dar'

export {
  groupName,
  now,
  studentName,
  studentSearch,
  teacherName,
  teacherSearch,
  url
}
