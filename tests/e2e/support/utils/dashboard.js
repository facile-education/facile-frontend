const getNewsDetail = (news) => {
  return cy.get('.detailed-news').contains(news.content)
}

const getNews = (news) => {
  return cy.get('[data-test="announcement-widget"]').contains('.announcement', news.title)
}

export {
  getNewsDetail,
  getNews
}
