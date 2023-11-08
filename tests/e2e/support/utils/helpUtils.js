const testArticleContent = (helpArticle) => {
  cy.get('article').within(() => {
    // Title
    cy.contains('h2', helpArticle.name)

    // Video
    if (helpArticle.article.hasVideo) {
      cy.get('video')
    } else {
      cy.get('video').should('not.exist')
    }

    // Manual
    if (helpArticle.article.manualContent !== '') {
      cy.get('section.manual-section').within(() => {
        cy.contains('h3', 'MANUEL')
        cy.contains('.html-content', helpArticle.article.manualContent)
      })
    } else {
      cy.get('section.manual-section').should('not.exist')
    }

    // FAQ
    if (helpArticle.article.questions.length > 0) {
      cy.get('section.faq-section').within(() => {
        cy.contains('h3', 'F.A.Q')
        helpArticle.article.questions.forEach((question) => {
          cy.contains(question.answer).should('not.exist')
          cy.contains(question.question).click()
          cy.contains(question.answer).should('exist')
        })
      })
    } else {
      cy.get('section.question-section').should('not.exist')
    }

    // Links
    if (helpArticle.article.links.length > 0) {
      cy.get('aside').within(() => {
        helpArticle.article.links.forEach((link) => {
          cy.contains('a', link.label).should('have.attr', 'href', link.url)
        })
      })
    }

    // Related
    if (helpArticle.article.related.length > 0) {
      cy.get('aside').within(() => {
        helpArticle.article.related.forEach((related) => {
          cy.contains('a', related)
        })
        // Test selection
        // cy.contains('a', helpArticle.article.related[0]).click()
      })
      // cy.contains('h2', helpArticle.article.related[0])
    }
  })
}

const setServiceDiffusion = (serviceId, roleIds) => {
  cy.request({
    method: 'POST',
    url: '/api/jsonws/gestionApplications-portlet.broadcastrule/update-broadcast-rules',
    form: true,
    body: {
      serviceId: serviceId,
      schoolId: 322701,
      rules: JSON.stringify([{ roleIds: roleIds, orgIds: [0] }])
    }
  }).then(
    (response) => {
      // response.body is automatically serialized into JSON
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('success', true) // true
    }
  )
}
export {
  testArticleContent,
  setServiceDiffusion
}
