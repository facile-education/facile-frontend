const firedType = 1
const detentionType = 2
const replayTestType = 3
const tutoringType = 4
const studyType = 5

const slotTypes = [
  {
    type: tutoringType,
    i18nKey: 'NotUsualSlots.tutoring',
    color: '#8763CA'
  },
  {
    type: studyType,
    i18nKey: 'NotUsualSlots.study',
    color: '#32AC71'
  },
  {
    type: replayTestType,
    i18nKey: 'NotUsualSlots.replayTest',
    color: '#3694B7'
  },
  {
    type: detentionType,
    i18nKey: 'NotUsualSlots.detention',
    color: '#EDA12A'
  },
  {
    type: firedType,
    i18nKey: 'NotUsualSlots.fired',
    color: '#FF0000'
  }
]

function getSlotTypeByNumber (typeNumber) {
  return slotTypes.find(obj => obj.type === typeNumber)
}

export default {
  firedType,
  detentionType,
  replayTestType,
  tutoringType,
  studyType,
  slotTypes,
  getSlotTypeByNumber
}
