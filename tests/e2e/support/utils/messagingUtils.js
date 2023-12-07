const waitMessagingToBeLoaded = () => {
  cy.get('[data-test=threads-panel] > [data-test=thread-list-header]', { timeout: 6000 }).contains('BOÎTE DE RÉCEPTION') // That waits the current folder loading
  cy.wait(200)
  cy.get('[data-test=spinner]').should('not.exist')
}

const reloadThreadsAndFolders = () => {
  cy.intercept(
    { method: 'GET', url: '**/get-threads*' }
  ).as('reloadThreads')
  cy.intercept(
    { method: 'GET', url: '**/get-all-user-folders*' }
  ).as('reloadFolders')

  cy.get('[data-test=option_refresh]').click()

  cy.wait('@reloadThreads').its('response.body.success').should('be.equals', true)

  cy.window().then(win => {
    win.store.dispatch('messaging/loadMessagingFolders')
  })

  cy.wait('@reloadFolders').its('response.body.success').should('be.equals', true)
  cy.wait('@reloadThreads').its('response.body.success').should('be.equals', true)
}

const getThread = (thread) => {
  // Get thread by subject
  const lastThreadMessage = thread.find((message) => message.messageIndexInThread === thread.length - 1) // the displayed subject
  return cy.contains('[data-test=thread-list-item]', lastThreadMessage.subject)
}

const getMessage = (message) => {
  // Get message by content
  return cy.get('[data-test=messages-panel]').contains('[data-test=message]', message.content)
}

const getFileInMessage = (message, attachedFile) => {
  // Get message by content
  return cy.get('.message-list').within(() => {
    cy.contains('[data-test=message]', message.content).within(() => {
      cy.contains('.attached-file', attachedFile)
    })
  })
}

const getDraft = (message) => {
  // Get draft by content
  return cy.contains('[data-test=thread-list-item]', message)
}

const setRecipient = (user) => {
  cy.get('.base-tags-input').type(`${user.firstName}`)
  cy.get('.suggestion-list').contains(`${user.lastName} ${user.firstName}`).click()
}

const setMessagingDocumentLibrary = () => {
  cy.loadTables('messaging/messaging_tables_document.sql')
  cy.exec('npm run dl:loadDocumentLibrary document_library.tar.xz')
}

export {
  waitMessagingToBeLoaded,
  reloadThreadsAndFolders,
  getThread,
  getMessage,
  getDraft,
  setRecipient,
  setMessagingDocumentLibrary,
  getFileInMessage
}
