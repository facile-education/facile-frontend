import i18n from '@/i18n'

const firedType = 1
const detentionType = 2
const replayTestType = 3
const tutoringType = 4
const studyType = 5

const slotTypes = [
  {
    type: tutoringType,
    label: i18n.global.t('NotUsualSlots.tutoring'),
    color: '#8763CA'
  },
  {
    type: studyType,
    label: i18n.global.t('NotUsualSlots.study'),
    color: '#32AC71'
  },
  {
    type: replayTestType,
    label: i18n.global.t('NotUsualSlots.replayTest'),
    color: '#3694B7'
  },
  {
    type: detentionType,
    label: i18n.global.t('NotUsualSlots.detention'),
    color: '#EDA12A'
  },
  {
    type: firedType,
    label: i18n.global.t('NotUsualSlots.fired'),
    color: '#f00'
  }
]

export default {
  firedType,
  detentionType,
  replayTestType,
  tutoringType,
  studyType,
  slotTypes
}
