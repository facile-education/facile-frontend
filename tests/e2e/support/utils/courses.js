const getHomework = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
  })
}

const getHomeworkDetailsSupport = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    cy.get('.attached-file').should('contain', homework.attachedFile)
    cy.get('.ck-editor').should('contain', homework.additionalText)
    cy.get('.course-content').eq(0).should('contain', homework.audio)
    cy.get('.course-content').eq(1).should('contain', homework.link)
    cy.get('.course-content').eq(2).should('contain', homework.video)
    cy.get('.course-content').eq(3).should('contain', homework.h5p)
  })
}

const getSession = (session) => {
  return cy.contains('.session-content', session.title).within(() => {
    cy.contains(session.content)
  })
}

const getSessionDetailsSupport = (sessionSupport) => {
  return cy.contains('.session-content', sessionSupport.title).within(() => {
    cy.contains(sessionSupport.content)
    cy.get('.attached-file').should('contain', sessionSupport.attachedFile)
    cy.get('.ck-editor').should('contain', sessionSupport.additionalText)
    cy.get('.course-content').eq(0).should('contain', sessionSupport.audio)
    cy.get('.course-content').eq(1).should('contain', sessionSupport.link)
    cy.get('.course-content').eq(2).should('contain', sessionSupport.video)
    cy.get('.course-content').eq(3).should('contain', sessionSupport.h5p)
  })
}

const getCourseSessionDetails = (homework, session) => {
  return cy.contains('.session-infos', session.headText).within(() => {
    getHomework(homework)
  })
}

const getCourseSessionDetailsSupport = (homework, session, sessionSupport) => {
  return cy.contains('.session-infos', session.headText).within(() => {
    getHomeworkDetailsSupport(homework)
    getSessionDetailsSupport(sessionSupport)
  })
}

export {
  getHomework,
  getHomeworkDetailsSupport,
  getSession,
  getSessionDetailsSupport,
  getCourseSessionDetails,
  getCourseSessionDetailsSupport
}
