import notUsualSlotsConstants from '@/constants/notUsualSlots'

function isEditableSlot (event) {
  return !event.extendedProps.isUserSlot
}

function formatNonUsualSlots (sessions) {
  sessions.forEach(event => {
    const slotType = notUsualSlotsConstants.getSlotTypeByNumber(event.type)
    event.title = slotType.label
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
