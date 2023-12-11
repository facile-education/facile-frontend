const waitScheduleToBeLoaded = () => {
  cy.get('h1[aria-label="Horaires"]', { timeout: 10000 }).should('exist')
  cy.get('.fc', { timeout: 10000 }).should('exist')
}

export {
  waitScheduleToBeLoaded
}
