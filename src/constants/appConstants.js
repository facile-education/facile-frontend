// The keys should match the one in fr.json "Menu"
// TODO: Review usage of those statics route name and check if it's translation-compliant
const COURSES = 'cdt'
const DASHBOARD = 'dashboard'
const DOCUMENTS = 'documents'
const GROUPS = 'groups'
const SCHEDULE = 'horaires'
const SCHOOL_LIFE = 'horaires-hors-cadre'
const MESSAGING = 'messaging'
const STATISTICS = 'statistics'

const nbCharBeforeCompletion = 2
const timeBeforeCompletion = 500

const locales = [
  {
    frontId: 'en',
    backId: 'en_US',
    label: 'English',
    iconName: 'englishFlag', // icon name in icons.js
    isDefault: true
  },
  {
    frontId: 'fr',
    backId: 'fr_FR',
    label: 'Français',
    iconName: 'frenchFlag'
  },
  {
    frontId: 'de',
    backId: 'de_DE',
    label: 'Deutsch',
    iconName: 'deutschFlag'
  },
  {
    frontId: 'it',
    backId: 'it_IT',
    label: 'Italiano',
    iconName: 'italianFlag'
  }
]

const slotLabelList = {
  '08 h': 'P1',
  '09 h': 'P2',
  '10 h': 'P3',
  '11 h': 'P4',
  '12 h': 'P5',
  '13 h': 'P6',
  '14 h': 'P7',
  '15 h': 'P8',
  '16 h': 'P9',
  '17 h': 'P10'
}

// time in ms
const popupDurationTime = 3500
const mobilePopupDurationTime = 2000
const fileAutoSaveTime = 60000
const uploadProgressionTimeAfterFinish = 5000

const entityNameMaxSize = 255
const ckMaxSize = 63206

export {
  locales,
  nbCharBeforeCompletion,
  timeBeforeCompletion,
  uploadProgressionTimeAfterFinish,
  slotLabelList,
  popupDurationTime,
  mobilePopupDurationTime,
  fileAutoSaveTime,
  entityNameMaxSize,
  ckMaxSize,
  COURSES,
  DASHBOARD,
  DOCUMENTS,
  GROUPS,
  SCHEDULE,
  SCHOOL_LIFE,
  MESSAGING,
  STATISTICS
}

export default {
  nbCharBeforeCompletion,
  timeBeforeCompletion,
  slotLabelList,
  popupDurationTime,
  fileAutoSaveTime,
  entityNameMaxSize
}
