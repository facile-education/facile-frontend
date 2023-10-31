const waitDocumentServiceToBeLoaded = () => {
  cy.get('h1[aria-label="Mes documents"]', { timeout: 10000 }).should('exist')
}

export {
  waitDocumentServiceToBeLoaded
}
