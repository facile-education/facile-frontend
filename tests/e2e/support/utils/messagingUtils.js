const waitMessagingToBeLoaded = () => {
  cy.get('[data-test=threads-panel] > [data-test=header]').contains('BOÎTE DE RÉCEPTION') // That waits the current folder loading
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

// message list of dump (+ two reply of the last message)
// const messageList = [
//   {
//     sender: anya,
//     recipients: testUsers,
//     subject: 'First message subject',
//     content: 'First message content',
//     attachedFiles: [],
//     draftMessageId: 0,
//     originMessageId: 0,
//     isReply: false,
//     isForward: false,
//     isSupport: false
//   },
//   {
//     sender: demira,
//     recipients: testUsers,
//     subject: 'Second message subject',
//     content: 'Second message content',
//     attachedFiles: [],
//     draftMessageId: 0,
//     originMessageId: 0,
//     isReply: false,
//     isForward: false,
//     isSupport: false
//   },
//   {
//     sender: demira,
//     recipients: testUsers,
//     subject: 'Third message subject',
//     content: 'Third message content',
//     attachedFiles: [],
//     draftMessageId: 0,
//     originMessageId: 0,
//     isReply: false,
//     isForward: false,
//     isSupport: false
//   },
//   {
//     sender: didio,
//     recipients: testUsers,
//     subject: 'Fourth message subject',
//     content: 'Fourth message content',
//     attachedFiles: [],
//     draftMessageId: 0,
//     originMessageId: 0,
//     isReply: false,
//     isForward: false,
//     isSupport: false
//   }
// ]

export {
  waitMessagingToBeLoaded,
  reloadThreadsAndFolders
}
