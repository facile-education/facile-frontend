const waitMessagingToBeLoaded = () => {
  cy.get('[data-test=threads-panel] > [data-test=header]').contains('BOÎTE DE RÉCEPTION') // That waits the current folder loading
  cy.wait(200)
  cy.get('[data-test=spinner]').should('not.exist')
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
  waitMessagingToBeLoaded
}
