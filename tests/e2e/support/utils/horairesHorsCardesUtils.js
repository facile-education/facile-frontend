const waitCalendarToLoad = () => {
  cy.wait(500)
}

const selectHours = (startHour, endHour) => {
  cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').clear()
  cy.get('[data-test=time-selection] > .input-section > :nth-child(2)').type(startHour)
  cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').clear()
  cy.get('[data-test=time-selection] > .input-section > :nth-child(3)').type(endHour)
}

const submit = () => {
  cy.get('.button').contains('Valider').click()
}

const fillEditSlotModal = (form, isModification) => {
  cy.get('[data-test=edit-slot-modal]').within(() => {
    selectHours(form.startHour, form.endHour)
    if (isModification) {
      cy.get('.tag-item > .pc-times').click()
      cy.get('.tag-item').should('not.exist')
    }
    cy.get('[data-test=user-completion-input]').type(form.teacherSearch)
    cy.tick(500)
    cy.contains(form.teacherName).click()
    cy.get('[placeholder="Salle"]').type(form.roomNumber)
    cy.get('[type="number"]').type(form.capacity)

    submit()
  })
}

const phoneGoToDayOfMonth = (dayNumber) => {
  cy.get('.toolbar .date-picker i').click()
  cy.tick(500)
  cy.get('.vc-popover-content').contains(Number(dayNumber)).click()
  cy.get('.toolbar .date-picker i').click()
  cy.tick(500)
  cy.wait(100)
  cy.tick(500)
  cy.get('.vc-popover-content').should('not.exist')
}

const checkSlotData = (date, expectedSlot, checkTeachersAndStuff = true) => {
  cy.get('[data-test="' + date.format('MM-DD') + '_' + expectedSlot.startHour + '"]').within(() => {
    cy.contains(expectedSlot.label).first().click({ force: true })
  })
  cy.get('[data-test=event-popup] ').within(() => {
    cy.contains(expectedSlot.startHour + ' - ' + expectedSlot.endHour)
    if (checkTeachersAndStuff) { // TODO: To remove when we will fix teacher and roomNumber, etc from Slot to sessions
      cy.contains(expectedSlot.teacherName)
      cy.contains(expectedSlot.roomNumber)
      cy.contains(expectedSlot.capacity)
    }
  })
  // close popup to not be crowded by it on next clicks
  cy.get('[data-test="' + date.format('MM-DD') + '_' + expectedSlot.startHour + '"]').within(() => {
    cy.contains(expectedSlot.label).first().click({ force: true })
  })
}

export default {
  checkSlotData,
  fillEditSlotModal,
  phoneGoToDayOfMonth,
  selectHours,
  submit,
  waitCalendarToLoad
}
