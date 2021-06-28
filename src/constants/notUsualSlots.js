import i18n from '@/i18n'

const slotTypes = [
  {
    type: 'tutoring',
    label: i18n.global.t('NotUsualSlots.tutoring'),
    color: '#8763CA'
  },
  {
    type: 'study',
    label: i18n.global.t('NotUsualSlots.study'),
    color: '#32AC71'
  },
  {
    type: 'replayTest',
    label: i18n.global.t('NotUsualSlots.replayTest'),
    color: '#3694B7'
  },
  {
    type: 'detention',
    label: i18n.global.t('NotUsualSlots.detention'),
    color: '#EDA12A'
  },
  {
    type: 'fired',
    label: i18n.global.t('NotUsualSlots.fired'),
    color: '#f00'
  }
]

export default {
  slotTypes
}
