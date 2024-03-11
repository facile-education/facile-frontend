import notUsualSlotsConstants from '@/constants/notUsualSlots'
import i18n from '@/i18n'

function isEditableSlot (event) {
  return !event.extendedProps.isUserSlot
}

function formatNonUsualSlots (sessions) {
  sessions.forEach(event => {
    const slotType = notUsualSlotsConstants.getSlotTypeByNumber(event.type)
    event.title = i18n.global.t(slotType.i18nKey)
    event.color = slotType.color
    event.capacity = undefined
    event.nbRegisteredStudents = undefined
  })
}

export {
  isEditableSlot,
  formatNonUsualSlots
}

export default isEditableSlot
