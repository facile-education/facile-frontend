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
  return cy.contains('.homework-list', homework.title)
}

const getHomeworkDetails = (homework) => {
  return cy.contains('.homework-list', homework.title).within(() => {
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
  cy.exec('npm run dl:loadDocumentLibrary document_library_groupActivity.tar.xz')
}

const loadActivity = request => {
  cy.intercept('GET', `**/${request}**`).as('loadActivity')
  return cy.wait('@loadActivity')
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
  loadActivity
}
