import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)
dayjs.extend(LocalizedFormat)
dayjs.locale(fr)

// Set current date to Wednesday, may 5th
const now = dayjs('2021-05-05T16:00:00.000Z')
const url = '/nero/horaires'
const groupName = '0922R2'
const studentName = 'ALOSTA ANYA (1051AC)'
const studentSearch = 'alo'
const teacherName = 'Jovanovic Darko (Maitre)'
const teacherSearch = 'dar'
const secondChildName = 'LISA'
const substituteCalendarName = 'Y. Caillat'
const substituteName = 'Caillat Yoan'
const substituteSearch = 'cail'

export {
  groupName,
  now,
  studentName,
  studentSearch,
  teacherName,
  teacherSearch,
  url,
  secondChildName,
  substituteCalendarName,
  substituteName,
  substituteSearch
}
