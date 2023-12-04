const getHomework = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    cy.contains(homework.teacher)
  })
}

const getHomeworkDetailsContents = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    cy.contains(homework.teacher)
    cy.get('.attached-file').should('contain', homework.attachedFile)
    cy.get('.ck-editor').should('contain', homework.additionalText)
    cy.get('.course-content').eq(0).should('contain', homework.audio)
    cy.get('.course-content').eq(1).should('contain', homework.link)
    cy.get('.course-content').eq(2).should('contain', homework.video)
    cy.get('.course-content').eq(3).should('contain', homework.h5p)
  })
}

export {
  getHomework,
  getHomeworkDetailsContents
}
