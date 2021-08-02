import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(LocalizedFormat)
dayjs.extend(weekOfYear)

dayjs.locale(fr)

// Set current date to Wednesday, may 5th
const now = dayjs('2021-05-05T16:00:00.000Z')
const url = '/nero/not-usual-slots'
const groupName = '0922R2'
const studentName = 'MELISSA BARMAN (1021LC)'
const studentSearch = 'mel'
const studentSlotsNumberAtWeek35 = 40
const studentSlotsNumberAtTuesday = 4
const teacherName = 'Darko Jovanovic (Maitre)'
const teacherSearch = 'dar'

const tutoring = {
  type: 4,
  label: 'Dépannage',
  color: '#8763CA',
  nbSlotsAtWeek35: 4,
  teacherNameAtWednesdaySlot: 'C. Kummer'
}
const study = {
  type: 5,
  label: 'Cercle d\'étude',
  color: '#32AC71',
  nbSlotsAtWeek35: 4,
  teacherNameAtWednesdaySlot: 'A. Veluz'
}
const replayTest = {
  type: 3,
  label: 'Travaux à refaire',
  color: '#3694B7',
  nbSlotsAtWeek35: 4,
  teacherNameAtWednesdaySlot: 'D. Jovanovic'
}
const detention = {
  type: 2,
  label: 'Retenue',
  color: '#EDA12A',
  nbSlotsAtWeek35: 3,
  teacherNameAtWednesdaySlot: 'A. Regad'
}
const fired = {
  type: 1,
  label: 'Renvoi',
  color: '#f00',
  nbSlotsAtWeek35: 6,
  teacherNameAtWednesdaySlot: 'F. Vuilleumier Freymond'
}

const slotTypes = {
  tutoring,
  study,
  replayTest,
  detention,
  fired
}

export {
  groupName,
  now,
  studentName,
  studentSearch,
  studentSlotsNumberAtWeek35,
  studentSlotsNumberAtTuesday,
  teacherName,
  teacherSearch,
  url,
  slotTypes
}
