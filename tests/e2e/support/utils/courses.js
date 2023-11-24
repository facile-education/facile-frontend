const getHomework = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    cy.contains(homework.teacher)
  })
}

export {
  getHomework
}
