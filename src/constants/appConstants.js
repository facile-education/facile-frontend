// The keys should match the one in fr.json "Menu"
const ACCESS_MANAGER = 'access-admin'
const APPLICATION_MANAGER = 'application-admin'
const COURSES = 'cdt'
const CORTEX = 'cortex'
const DASHBOARD = 'dashboard'
const DASHBOARD_MANAGER = 'dashboard-admin'
const DISCIPLINES_CO = 'disciplines-co'
const DOCUMENTS = 'documents'
const GROUPS = 'groups'
const GRR = 'grr'
const H5P = 'h5p'
const SCHEDULE = 'horaires'
const SCHEDULE_MANAGER = 'horaires-admin'
const SCHOOL_LIFE = 'horaires-hors-cadre'
const MAINTENANCE = 'maintenance'
const MESSAGING = 'messaging'
const STATISTICS = 'statistics'
const UNIVERSALIS = 'universalis'
const UNIVERSALIS_JUNIOR = 'universalis-junior'
const USER_MANAGER = 'user-admin'

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
  ACCESS_MANAGER,
  APPLICATION_MANAGER,
  COURSES,
  CORTEX,
  DASHBOARD,
  DASHBOARD_MANAGER,
  DISCIPLINES_CO,
  DOCUMENTS,
  GROUPS,
  GRR,
  H5P,
  SCHEDULE,
  SCHEDULE_MANAGER,
  SCHOOL_LIFE,
  MAINTENANCE,
  MESSAGING,
  STATISTICS,
  UNIVERSALIS,
  UNIVERSALIS_JUNIOR,
  USER_MANAGER,
  isLocaleFR
}

export default {
  nbCharBeforeCompletion,
  timeBeforeCompletion,
  slotLabelList,
  popupDurationTime,
  fileAutoSaveTime,
  entityNameMaxSize
}
