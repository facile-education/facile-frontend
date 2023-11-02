import { messagingURL } from '../../support/constants/urls'
import { HEADMASTER, MULTI_PARENT, PARENT, STUDENT } from '../../support/constants/users'
import { openContactPicker, openList } from '../../support/utils/contactPickerUtils'

describe('UserSelection_AddressBook_DisplayCorrectLists', () => {
  beforeEach(() => {
    cy.fixture('contactPicker.json').as('contactPickerData')
  })
  it.only('UserSelection_AddressBook_DisplayCorrectList_Check_Viewport', function () {
    const Lists = this.contactPickerData.Lists
    // Login
    cy.login(HEADMASTER, messagingURL)
    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')
    cy.get('.address-book').within(() => {
      cy.get('.extended').contains('li', Lists[0]).should('be.visible')
    })
    // Check if button classes is not visible in viewport
    cy.get('.address-book').contains('button', 'Classes').should('not.visible')
    // Scroll to see the button classes
    cy.get('.address-book').scrollTo('bottom')
    // Check if button classes is visible
    cy.get('.address-book').contains('button', 'Classes').should('be.visible')
  })

  it('UserSelection_AddressBook_DisplayCorrectList_Open_Close_List', function () {
    const Lists = this.contactPickerData.Lists
    // Login
    cy.login(HEADMASTER, messagingURL)
    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')
    cy.get('.address-book').within(() => {
      cy.get('.extended').contains('li', Lists[0]).should('be.visible')
    })
    cy.get('.address-book').contains('button', 'Personnels').click()
    cy.get('.address-book').within(() => {
      cy.get('.extended').contains('li', Lists[0]).should('not.visible')
    })
  })

  it('UserSelection_AddressBook_DisplayCorrectList_ListContent', function () {
    const Lists = this.contactPickerData.Lists
    // Login
    cy.login(HEADMASTER, messagingURL)
    // Open contactPicker
    openContactPicker()

    for (let i = 0; i < Lists.length - 1; i++) {
      openList(Lists[i].label)
      // Find a user in list
      cy.get('.user-list').within(() => {
        cy.get('[data-test="UserListItem"]').contains(Lists[i].userInList).should('be.exist')
        // Check the number of users
        cy.get('[data-test="UserListItem"]').should('have.length', Lists[i].nbTotalUsers)
        // Check the nbUser icon
        cy.get('.nb-users').should('contain', Lists[i].nbTotalUsers)
      })
      cy.get('.address-book').contains('button', 'Personnels').click()
    }
    cy.get('.address-book').contains('button', '09').click()
    cy.get('.address-book').contains('button', '0911R1').click()

    // Check for a class students
    cy.get('.address-book').contains('button', 'Elèves de 0911R1').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('ALVARADO').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 20)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 20)
    })

    // Check for a class teachers
    cy.get('.address-book').contains('button', 'Enseignants·tes de 0911R1').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('BENIESH').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 16)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 16)
    })

    // Check for a class parents
    cy.get('.address-book').contains('button', 'Responsables légaux de 0911R1').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('Alvarado').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 40)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 40)
    })

    // Check list content for a student
    cy.login(STUDENT, messagingURL)
    // Open contactPicker
    openContactPicker()

    // Class list
    cy.get('.address-book').contains('button', 'Ma classe').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('BATTELLI').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 20)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 20)
    })

    // Parents list
    cy.get('.address-book').contains('button', 'Mes responsables légaux').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('Ribeiro').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 2)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 2)
    })

    // Check list content for a parent
    cy.login(PARENT, messagingURL)
    // Open contactPicker
    openContactPicker()

    // Class list
    cy.get('.address-book').contains('button', 'Elèves en responsabilité').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('RIBEIRO').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 1)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 1)
    })

    // Parents list
    cy.get('.address-book').contains('button', 'Responsables légaux').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('Ribeiro').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 2)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 2)
    })

    // Check list content for a multi_parent
    cy.login(MULTI_PARENT, messagingURL)
    // Open contactPicker
    openContactPicker()

    // Class list
    cy.get('.address-book').contains('button', 'Elèves en responsabilité').click()
    cy.get('.user-list').within(() => {
      cy.get('[data-test="UserListItem"]').contains('COMENCINI').should('be.exist')
      cy.get('[data-test="UserListItem"]').contains('COOPER').should('be.exist')
      // Check the number of users
      cy.get('[data-test="UserListItem"]').should('have.length', 2)
      // Check the nbUser icon
      cy.get('.nb-users').should('contain', 2)
    })
  })

  it('UserSelection_AddressBook_DisplayCorrectTabs_ByProfil', function () {
    // Check for a student
    cy.login(STUDENT, messagingURL)
    openContactPicker()
    cy.get('.tabs').should('not.exist')

    // Check for a parent
    cy.login(PARENT, messagingURL)
    openContactPicker()
    cy.get('.tabs').should('not.exist')

    // Check for a headermaster
    cy.login(HEADMASTER, messagingURL)
    openContactPicker()
    cy.get('.tabs').should('be.exist')
  })

  it('UserSelection_AddressBook_DisplayCorrectLists_ByProfil', function () {
    const Lists = this.contactPickerData.Lists

    // Check for a student
    cy.login(STUDENT, messagingURL)
    openContactPicker()
    cy.get('.address-book').contains('button', 'Personnels').click()
    for (let i = 0; i < Lists.length - 1; i++) {
      cy.get('.address-book').contains('li', Lists[i]).should('be.exist')
    }
    cy.get('.address-book').contains('button', 'Ma classe').should('be.exist')
    cy.get('.address-book').contains('button', 'Mes responsables légaux').should('be.exist')

    // Check for a parent
    cy.login(PARENT, messagingURL)
    openContactPicker()
    cy.get('.address-book').contains('button', 'Personnels').click()
    for (let i = 0; i < Lists.length - 1; i++) {
      cy.get('.address-book').contains('li', Lists[i]).should('be.exist')
    }
    cy.get('.address-book').contains('button', 'Elèves en responsabilité').should('be.exist')
    cy.get('.address-book').contains('button', 'Responsables légaux').should('be.exist')

    // Check for a headermaster
    cy.login(HEADMASTER, messagingURL)
    openContactPicker()
    cy.get('.address-book').contains('button', 'Personnels').click()
    for (let i = 0; i < Lists.length - 1; i++) {
      cy.get('.address-book').contains('li', Lists[i]).should('be.exist')
    }
    cy.get('.address-book').contains('button', 'Classes').should('be.exist')
  })

  it('UserSelection_AddressBook_DisplayCorrectLists_Check_Viewport_Mobile', function () {
    cy.viewport('iphone-5')
    // Check for an agent
    cy.login(HEADMASTER, messagingURL)
    // Open contactPicker
    openContactPicker()
    // Open teachers list
    openList('Enseignants·tes')
    cy.get('.address-book').within(() => {
      cy.get('.extended').should('be.exist')
    })
    // Check if button classes is not visible in viewport
    cy.get('.address-book').contains('button', 'Classes').should('not.visible')
    // Scroll to bottom
    cy.get('.address-book').scrollTo('bottom')
    // Check if button classe is visible
    cy.get('.address-book').contains('button', 'Classes').should('be.visible')
  })
})
