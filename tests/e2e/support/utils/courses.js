const getSessionHomework = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
  })
}

const getSessionHomeworkWithSupport = (homework) => {
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

const getSessionContent = (session) => {
  return cy.get('.session-content').contains(session.title)
}

const getSessionContentWithSupport = (sessionSupport) => {
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

const getSessionContentWithSupportWithoutAudio = (sessionSupport) => {
  return cy.contains('.session-content', sessionSupport.title).within(() => {
    cy.contains(sessionSupport.content)
    cy.get('.attached-file').should('contain', sessionSupport.attachedFile)
    cy.get('.ck-editor').should('contain', sessionSupport.additionalText)
    cy.get('.course-content').eq(0).should('contain', sessionSupport.link)
    cy.get('.course-content').eq(1).should('contain', sessionSupport.video)
    cy.get('.course-content').eq(2).should('contain', sessionSupport.h5p)
  })
}

const getCourseSession = (homework, session) => {
  return cy.contains('.session-infos', session.headText).within(() => {
    getSessionHomework(homework)
  })
}

const getCourseSessionWithSupport = (homework, session, sessionSupport) => {
  return cy.contains('.session-infos', session.headText).within(() => {
    getSessionHomeworkWithSupport(homework)
    getSessionContentWithSupport(sessionSupport)
  })
}

export {
  getSessionHomework,
  getSessionHomeworkWithSupport,
  getSessionContent,
  getSessionContentWithSupport,
  getCourseSession,
  getCourseSessionWithSupport,
  getSessionContentWithSupportWithoutAudio
}
