const getSessionHomework = (homework) => {
  return cy.contains('.homework', homework.title)
}

const getSessionHomeworkWithSupport = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    cy.get('.attached-file').should('contain', homework.attachedFile)
    cy.get('.ck-editor').should('contain', homework.additionalText)
    if (cy.get('.estimated-time').length > 0) {
      cy.get('.estimated-time').should('contain', homework.estimatedTime)
    }
    cy.get('.course-content').eq(0).should('contain', homework.audio)
    cy.get('.course-content').eq(1).should('contain', homework.link)
    cy.get('.course-content').eq(2).should('contain', homework.video)
    cy.get('.course-content').eq(3).should('contain', homework.h5p)
  })
}

const getSessionHomeworkWithSupportWithoutAudio = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    if (cy.get('.estimated-time').length > 0) {
      cy.get('.estimated-time').should('contain', homework.estimatedTime)
    }
    cy.get('.attached-file').should('contain', homework.attachedFile)
    // cy.get('.ck-editor').should('contain', homework.additionalText)
    cy.get('.course-content').eq(0).should('contain', homework.link)
    cy.get('.course-content').eq(1).should('contain', homework.video)
    cy.get('.course-content').eq(2).should('contain', homework.h5p)
  })
}

const getSessionContent = (session) => {
  return cy.contains('.session-content', session.title)
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

const changetab = (tab) => {
  cy.get('.tabs').within(() => {
    cy.contains('li', tab).click()
  })
}

const selectCourse = (course) => {
  cy.get('.courses').should('be.visible').within(() => {
    cy.contains('li', course).click()
  })
}
const addFile = (file) => {
  cy.get('[title="Ajouter une pièce jointe depuis vos documents de l\'ENTA"]').click()
  cy.get('[data-test="file-picker-modal"]').within(() => {
    cy.contains('.file', file).click()
    cy.get('[data-test="submitButton"]').click()
  })
}

const addLink = (linkName, linkUrl) => {
  cy.get('[title="Ajouter un lien"]').click()
  cy.get('[data-test="link"]').within(() => {
    cy.get('.link-name').type(linkName)
    cy.get('.link-url').type(linkUrl)
    cy.get('[data-test="addLinkButton"]').click()
  })
}

const addVideo = (videoName, videoUrl) => {
  cy.get('[title="Ajouter une vidéo"]').click()
  cy.get('[data-test="video"]').within(() => {
    cy.get('.video-name').type(videoName)
    cy.get('.video-url').type(videoUrl)
    cy.get('[data-test="addVideo"]').click()
  })
}

const addH5P = (h5pName, h5pUrl) => {
  cy.get('[title="Ajouter un élément H5P"]').click()
  cy.get('[data-test="h5p"]').within(() => {
    cy.get('.content-name').type(h5pName)
    cy.get('.content-url').type(h5pUrl)
    cy.get('[data-test="addH5P"]').click()
  })
}

export {
  getSessionHomework,
  getSessionHomeworkWithSupport,
  getSessionContent,
  getSessionContentWithSupport,
  getCourseSession,
  getCourseSessionWithSupport,
  getSessionContentWithSupportWithoutAudio,
  getSessionHomeworkWithSupportWithoutAudio,
  changetab,
  selectCourse,
  addLink,
  addVideo,
  addH5P,
  addFile
}
