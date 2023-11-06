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
  return cy.get('.homework-list').contains('.title', homework.title)
}

export {
  getNewsDetail,
  getNews,
  getEvent,
  getEventDetail,
  getHomework
}
