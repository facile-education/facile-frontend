const getNewsDetail = (news) => {
  return cy.contains('.detailed-news', news.content)
}

const getNews = (news) => {
  return cy.get('[data-test="announcement-widget"]').contains('.announcement', news.title)
}

const getEvent = (news) => {
  return cy.get('[data-test="diary-widget"]').contains('.diary-event', news.title)
}

const getEventDetail = (event) => {
  return cy.get('.detailed-event').within(() => {
    cy.contains(event.content)
    cy.contains(event.title)
    cy.contains(event.location)
  })
}

const getHomework = (homework) => {
  return cy.contains('.homework-item', homework.title)
}

const getHomeworkDetails = (homework) => {
  return cy.contains('.homework-item', homework.title).within(() => {
    cy.contains(homework.content)
    cy.contains(homework.teacher)
  })
}

const getSession = (session) => {
  return cy.contains('.schedule-item', session.name).within(() => {
    cy.contains(session.startHour)
    cy.contains(session.endHour)
    cy.contains(session.classRoom)
    cy.contains(session.teacher)
  })
}

const getInformation = (information) => {
  return cy.contains('.activity-item', information.title)
}

const getInformationDetail = (information) => {
  return cy.get('[data-test="news-details-modal"]').within(() => {
    cy.contains(information.title)
    cy.contains(information.content)
  })
}

const selectChild = (child) => {
  cy.get('.child-selector').within(() => {
    cy.get('button').click()
    cy.get('.suggestion-list').within(() => {
      cy.contains('li', child).click()
    })
  })
}

const setActivityWithContent = () => {
  cy.loadTables('dashboard/dashboard_tables_activity.sql')
  cy.exec('npm run dl:loadDocumentLibrary document_library_activity.tar.xz')
}

const setActivityNewsWithContent = () => {
  cy.loadTables('dashboard/dashboard_tables_activity_News_attachedFile.sql')
  cy.exec('npm run dl:loadDocumentLibrary document_library_activity.tar.xz')
}

const setAnnouncementDocumentWithContent = () => {
  cy.loadTables('dashboard/dashboard_tables_news_document.sql')
  cy.exec('npm run dl:loadDocumentLibrary document_library_dashboard.tar.xz')
}

const loadActivity = request => {
  cy.intercept('GET', `**/${request}**`).as('loadActivity')
  return cy.wait('@loadActivity')
}

const ScrollToAndCheckVisibility = (widget) => {
  cy.get(widget).scrollIntoView()
  cy.get(widget).should('be.visible')
}

const checkFileVisibilityAndClick = (file) => {
  cy.contains('.attached-file', file).within(() => {
    cy.get('.size').should('be.visible')
  })
  cy.contains('.attached-file', file).should('be.visible').click()
  cy.get('[data-test="file-display-modal"]').should('be.visible').within(() => {
    cy.get('[data-test="closeModal"]').click({ force: true })
  })
}

const addPersonalFile = (file) => {
  cy.get('.select-files-buttons').within(() => {
    cy.get('button').eq(0).click()
  })
  // Add file from personal document
  cy.get('[data-test="file-picker-modal"]').within(() => {
    cy.contains('.file', file).click()
    cy.get('[data-test="submitButton"]').click()
  })
}

const addCollaborativeFile = (file) => {
  cy.get('.select-files-buttons').within(() => {
    cy.get('button').eq(0).click()
  })
  // Add file from collaborative document
  cy.get('[data-test="file-picker-modal"]').within(() => {
    cy.get('[data-test="breadcrumb-item"]').click()
    cy.get('[data-test="groups"]').click()
    cy.get('.documents-list').within(() => {
      cy.contains('button', 'Espace collaboratif sans les élèves').click()
    })
    cy.contains('.file', file).click()
    cy.get('[data-test="submitButton"]').click()
  })
}

const addFileFromWorkSpace = () => {
  cy.get('.select-files-buttons').within(() => {
    // Get file in fixture
    cy.fixture('filesToUpload/file.txt').as('myFile')
    // Get input type file in button to get get file in workSpace
    cy.get('button').eq(1).within(() => {
      // Use selectFile to simulate get file in workSpace
      cy.get('input[type=file]').selectFile('@myFile', { force: true })
    })
  })
  cy.get('.attached-file').contains('file.txt')
}

export {
  getNewsDetail,
  getNews,
  getEvent,
  getEventDetail,
  getHomework,
  getHomeworkDetails,
  getSession,
  getInformation,
  getInformationDetail,
  selectChild,
  setActivityWithContent,
  loadActivity,
  ScrollToAndCheckVisibility,
  setAnnouncementDocumentWithContent,
  checkFileVisibilityAndClick,
  setActivityNewsWithContent,
  addPersonalFile,
  addCollaborativeFile,
  addFileFromWorkSpace
}
