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

export {
  getNewsDetail,
  getNews,
  getEvent,
  getEventDetail
}
