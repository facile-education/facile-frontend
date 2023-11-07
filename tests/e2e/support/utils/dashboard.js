const getNewsDetail = (news) => {
  return cy.get('.detailed-news').contains(news.content)
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

const getSessions = (session) => {
  return cy.contains('.schedule-item', session.name).within(() => {
    cy.contains(session.startHour)
    cy.contains(session.endHour)
    cy.contains(session.classRoom)
    cy.contains(session.teacher)
  })
}

export {
  getNewsDetail,
  getNews,
  getEvent,
  getEventDetail,
  getHomework,
  getHomeworkDetails,
  getSessions
}
