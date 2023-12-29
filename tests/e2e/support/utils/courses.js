const waitCourseServiceToBeLoaded = () => {
  cy.get('h1[aria-label="Cours & Devoirs"]', { timeout: 10000 }).should('exist')
}

const getSessionHomework = (homework) => {
  return cy.contains('.homework', homework.title)
}

const getSessionHomeworkWithSupport = (homework) => {
  return cy.contains('.homework', homework.title).within(() => {
    cy.contains(homework.content)
    cy.get('.attached-file').should('contain', homework.attachedFile)
    cy.get('.ck-editor').should('contain', homework.additionalText)
    if (cy.get('.estimated-time').length > 0) {
      cy.get('.estimated-time').should('contain', formatWorkLoadEstimatedTime(homework.estimatedTime))
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
      cy.get('.estimated-time').should('contain', formatEstimatedTime(homework.estimatedTime))
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

const clickOnContents = (sessionSupport) => {
  cy.get('.attached-file').should('contain', sessionSupport.attachedFile).click()
  cy.get('[data-test="file-display-modal"]').should('be.visible').within(() => {
    cy.get('.header').should('contain', sessionSupport.attachedFile)
    cy.get('[data-test="closeModal"]').click({ force: true })
  })
  cy.get('.course-content').eq(1).should('contain', sessionSupport.video).click()
  cy.get('.videoWindow').should('be.visible').within(() => {
    cy.get('.title').should('contain', sessionSupport.video)
    cy.get('[data-test="closeModal"]').click()
  })
  cy.get('.course-content').eq(2).should('contain', sessionSupport.h5p).click()
  cy.get('.h5pWindow').should('be.visible').within(() => {
    cy.get('.title').should('contain', sessionSupport.h5p)
    cy.get('[data-test="closeModal"]').click()
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

const submitHomework = () => {
  cy.get('.edit-homework-modal').within(() => {
    cy.contains('button', 'Publier').click()
  })
}

const submitSessionContent = () => {
  cy.get('.edit-course-modal').within(() => {
    cy.contains('button', 'Publier').click()
  })
}

const openHomeworkCreateModal = (sessionDatatestDate) => {
  cy.get(`[data-test="${sessionDatatestDate}"]`, { timeout: 10000 }).click()
  cy.get('.homeworks').within(() => {
    // Click on create homework button
    cy.get('[data-test="createSessionHomework"]').click()
  })
}

const openSessionContentCreateModal = (sessionDatatestDate) => {
  cy.get(`[data-test="${sessionDatatestDate}"]`, { timeout: 10000 }).click()
  cy.get('.session-details').within(() => {
    // Click on create homework button
    cy.get('[data-test="createSessionContent"]').click()
  })
}

const openEditHomworkModal = (homework, sessionDatatestDate, option) => {
  cy.get(`[data-test="${sessionDatatestDate}"]`).click()
  cy.get('.session-details').within(() => {
    // Get current session homeWork
    cy.contains('.homeworks', homework.title).within(() => {
      cy.get('.title').eq(0).within(() => {
        // Open edit session content panel
        cy.get('.edit-button').click()
      })
    })
  })
  // Click on update button
  cy.get('.context-menu').within(() => {
    cy.contains('button', `${option}`).click()
  })
}
const openEditSessionContentModal = (homework, sessionDatatestDate, option) => {
  cy.get(`[data-test="${sessionDatatestDate}"]`).click()
  cy.get('.session-details').within(() => {
    // Get current session homeWork
    cy.contains('.session-content', homework.title).within(() => {
      cy.get('.content-title').eq(0).within(() => {
        // Open edit session content panel
        cy.get('.edit-button').click()
      })
    })
  })
  // Click on update button
  cy.get('.context-menu').within(() => {
    cy.contains('button', `${option}`).click()
  })
}

const openWorkload = (sessionDatatestDate) => {
  cy.get(`[data-test="${sessionDatatestDate}"]`).click()
  cy.get('.homeworks').within(() => {
    // Click on create homework button
    cy.get('[data-test="createSessionHomework"]').click()
  })
  cy.get('.edit-homework-modal').should('be.visible').within(() => {
    cy.get('.work-load-button').click()
  })
}

const getWorkInWorkload = (homework, dateToDoWorkload, visibility) => {
  // Check if homework created is visible
  cy.get('[data-test="workLoadModal"]').within(() => {
    cy.contains('.day-works', dateToDoWorkload).within(() => {
      cy.contains('.work-item', homework.title).should(`${visibility}`)
      if (visibility === 'be.visible') {
        cy.contains('.work-item', homework.title).within(() => {
          cy.get('.estimated-time').should('contain', formatWorkLoadEstimatedTime(homework.estimatedTime))
        })
      }
    })
  })
}

const formatEstimatedTime = (nbMinutes) => {
  const nbHour = Math.floor(nbMinutes / 60)
  if (nbHour > 0) {
    return nbHour + 'h' + nbMinutes % 60
  } else {
    return nbMinutes + ' ' + 'min'
  }
}

const formatWorkLoadEstimatedTime = (nbMinutes) => {
  const nbHour = Math.floor(nbMinutes / 60)
  if (nbHour > 0) {
    return nbHour + 'h' + nbMinutes % 60
  } else {
    return nbMinutes + 'mn'
  }
}

export {
  waitCourseServiceToBeLoaded,
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
  addFile,
  getWorkInWorkload,
  submitHomework,
  openHomeworkCreateModal,
  openSessionContentCreateModal,
  submitSessionContent,
  openEditHomworkModal,
  openEditSessionContentModal,
  openWorkload,
  clickOnContents
}
