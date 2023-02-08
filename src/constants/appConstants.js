const nbCharBeforeCompletion = 2
const timeBeforeCompletion = 500

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
const fileAutoSaveTime = 60000

const entityNameMaxSize = 255

// Search
const quickSearchPaginationSize = 10

export {
  nbCharBeforeCompletion,
  timeBeforeCompletion,
  slotLabelList,
  popupDurationTime,
  fileAutoSaveTime,
  entityNameMaxSize,
  quickSearchPaginationSize
}

export default {
  nbCharBeforeCompletion,
  timeBeforeCompletion,
  slotLabelList,
  popupDurationTime,
  fileAutoSaveTime,
  entityNameMaxSize,
  quickSearchPaginationSize
}
