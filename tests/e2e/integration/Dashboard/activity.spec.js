import { dashboardURL } from '../../support/constants/urls'
import { DOYEN, MULTI_PARENT, PARENT, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getInformation, getInformationDetail, setDocumentGroupWithContent } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  beforeEach(() => {
    setDocumentGroupWithContent()
    cy.loadTables('schoollife/schoollife_tables.sql')
    cy.fixture('dashboard.json').as('dashboardData')
  })
  context('desktop', function () {
    it('Dashboard_Activities_DisplayActivity_Check_Infomrmation_ReadRecipient_Info', function () {
      const existingActivity = this.dashboardData.existingActivity

      // Login with author
      cy.login(TEACHER, dashboardURL)

      cy.get('[data-test="activity-widget"]').within(() => {
        getInformation(existingActivity[0]).click()
      })
      cy.get('[data-test="news-details-modal"]').within(() => {
        // No one read this event
        cy.get('.read-infos').should('contain', '0 destinataire')
      })

      // Login recipient
      cy.login(STUDENT, dashboardURL)
      // Student read this event
      getInformation(existingActivity[0]).click()

      // Login with author
      cy.login(TEACHER, dashboardURL)
      getInformation(existingActivity[0]).click()
      cy.get('[data-test="news-details-modal"]').within(() => {
        // No one read this event
        cy.get('.read-infos').should('contain', '1 destinataire')
        // Open recipients infos
        cy.get('.read-infos > button').click()
      })
      cy.get('[data-test="readInfoModal"]').within(() => {
        cy.get('.population').click()
        cy.get('.read-info-user').contains(`${STUDENT.lastName} ${STUDENT.firstName}`).should('not.contain', 'Non lu')
      })
    })

    it('Dashboard_Activities_DisplayActivity_Check_InformationContent', function () {
      const existingActivity = this.dashboardData.existingActivity

      // Login recipient
      cy.login(STUDENT, dashboardURL)
      // Student read this event
      getInformation(existingActivity[0]).click()
      cy.get('[data-test="news-details-modal"]').within(() => {
        // Check the title
        cy.get('.header').should('contain', existingActivity[0].title)
        // Chekc the recipient
        cy.get('.lonely-population').should('contain', existingActivity[0].recipient)
        // Check the content
        cy.get('.detailed-news > .content').should('contain', existingActivity[0].content)
      })
    })

    it('Dashboard_Activities_DisplayActivity_Display_Limite_Number_Activities', function () {
      const existingActivity = this.dashboardData.existingActivity
      const newActivity = this.dashboardData.futurActivity
      const information = existingActivity[0]
      const group = existingActivity[1]
      const documentInGroup = existingActivity[2]
      const homeWork1 = existingActivity[5]
      const homeWork2 = existingActivity[6]

      // Login
      cy.login(STUDENT, dashboardURL)
      // Set Clock after new activity release to see if it is in first position
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newActivity.publicationDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Check if max five activities is visible
      cy.get('.activity-item').contains(newActivity.title).should('be.visible')
      cy.get('.activity-item').contains(group.title).should('be.visible')
      cy.get('.activity-item').contains(documentInGroup.title).should('be.visible')
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('.activity-item').contains(homeWork1.content).scrollIntoView().should('be.visible')
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('.activity-item').contains(homeWork2.content).scrollIntoView().should('be.visible', { timeout: 10000 })
      cy.get('.activity-item').contains(information.title).should('not.exist')

      // Click to see all activities
      cy.contains('button', 'Voir toutes les activités').click()
      cy.get('.activities').should('have.class', 'infinite-scroll')

      // Check if in all activities all activities is visible
      cy.get('.activity-item').contains(newActivity.title).should('be.visible')
      cy.get('.activity-item').contains(group.title).should('be.visible')
      cy.get('.activity-item').contains(documentInGroup.title).should('be.visible')
      cy.get('.activity-item').contains(homeWork1.content).should('be.visible')
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('.activity-item').contains(homeWork2.content).scrollIntoView().should('be.visible', { timeout: 10000 })
      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('.activity-item').contains(information.title).scrollIntoView().should('be.visible', { timeout: 10000 })
    })

    it('Dashboard_Activities_DisplayActivity_Click_On_Document_Redirection_Student_Parent', function () {
      // Login with student
      cy.login(STUDENT, dashboardURL)

      // Redirection document
      cy.get('.doc-activity').within(() => {
        cy.contains('i', 'document.odt').click()
      })
      cy.get('[data-test="file-display-modal"]').should('be.visible')

      // Login with parent
      cy.login(MULTI_PARENT, dashboardURL)

      // Redirection document
      cy.get('.doc-activity').within(() => {
        cy.contains('i', 'note.html').click()
      })
      cy.get('[data-test="file-display-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DisplayActivity_Click_On_DocumentSpace_Redirection', function () {
      const existingActivity = this.dashboardData.existingActivity
      const DocumentSpace = existingActivity[1]
      // Login
      cy.login(STUDENT, dashboardURL)

      // Redirection document
      cy.get('.doc-activity').within(() => {
        cy.contains('i', DocumentSpace.title).click()
      })
      cy.get('.documents').should('be.visible')
    })

    it('Dashboard_Activities_DisplayActivity_Click_On_Group_Redirection_ByProfil', function () {
      const existingActivity = this.dashboardData.existingActivity
      const groupStudent = existingActivity[1]
      const groupTeacher = existingActivity[7]

      // Login with teacher
      cy.login(TEACHER2, dashboardURL)

      cy.contains('.membership-activity', groupTeacher.title).within(() => {
        cy.contains('i', groupTeacher.title).click()
      })
      cy.get('.group-list').should('be.visible')

      // Login with student
      cy.login(STUDENT, dashboardURL)

      cy.contains('.membership-activity', groupStudent.title).within(() => {
        cy.contains('i', groupStudent.title).click()
      })
      cy.get('.group-list').should('not.exist')
    })

    it('Dashboard_Activities_DisplayActivity_Click_On_Homework_Redirection', function () {
      const existingActivity = this.dashboardData.existingActivity
      const homeWork1 = existingActivity[5]
      // Login
      cy.login(STUDENT, dashboardURL)

      // Redirection homework
      cy.contains('.activity-item', homeWork1.content).click()
      cy.get('.homework-tab').should('be.visible')
    })

    it('Dashboard_Activities_DisplayActivity_Click_On_Firing_Redirection_ByProfil', function () {
      const renvoiForAuthor = this.dashboardData.existingActivity[3]
      const renvoiForOthers = this.dashboardData.existingActivity[4]

      // Login with author
      cy.login(TEACHER, dashboardURL)
      // Redirection firing for the author
      cy.contains('.activity-item', renvoiForAuthor.content).click()
      cy.get('.pending-firing-modal').should('be.visible')

      // Login with doyen
      cy.login(DOYEN, dashboardURL)
      // Redirection firing for the doyen
      cy.contains('.activity-item', renvoiForOthers.content).click()
      cy.get('.pending-firing-modal').should('not.exist')
    })

    it('Dashboard_Activities_DisplayActivity_Display_Placeholder', function () {
      // Load dump empty
      cy.loadTables('dashboard/dashboard_tables_activity_empty.sql')
      // Login
      cy.login(STUDENT, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('.placeholder').should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayAllActivities', function () {
      const existingActivity = this.dashboardData.existingActivity
      const information = existingActivity[0]
      const group = existingActivity[1]
      const documentInGroup = existingActivity[2]

      cy.login(STUDENT, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
        cy.get('.activities').should('have.class', 'infinite-scroll')
        getInformation(information).should('be.visible')
        getInformation(group).should('be.visible')
        getInformation(documentInGroup).should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivities_Display_In_RightOrder', function () {
      const existingActivity = this.dashboardData.existingActivity
      const newActivity = this.dashboardData.futurActivity
      const information = existingActivity[0]
      const group = existingActivity[1]
      const documentInGroup = existingActivity[2]
      const homeWork1 = existingActivity[5]
      const homeWork2 = existingActivity[6]

      // Login
      cy.login(STUDENT, dashboardURL)
      // Set Clock after new activity release to see if it is in first position
      cy.clock().invoke('setSystemTime', Cypress.dayjs(newActivity.publicationDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Click to see all activities
      cy.contains('button', 'Voir toutes les activités').click()
      cy.get('.activities').should('have.class', 'infinite-scroll')
      // Check the position of activities
      cy.get('.activity-item').eq(0).should('contain', newActivity.title)
      cy.get('.separator').should('be.visible')
      cy.get('.activity-item').eq(1).should('contain', documentInGroup.title)
      cy.get('.activity-item').eq(2).should('contain', group.title)
      cy.get('.activity-item').eq(3).should('contain', homeWork1.content)
      cy.get('.activity-item').eq(4).should('contain', homeWork2.content)
      cy.get('.activity-item').eq(5).should('contain', information.title)
    })

    it('Dashboard_Activities_DisplayActivities_Renvoi_VisibilityByProfil', function () {
      const renvoiForAuthor = this.dashboardData.existingActivity[3]
      const renvoiForOthers = this.dashboardData.existingActivity[4]

      // Login with author
      cy.login(TEACHER, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        // Check the position of activities
        cy.contains('.activity-item', renvoiForAuthor.content).should('be.exist')
      })

      // Login with class doyen
      cy.login(DOYEN, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        // Check the position of activities
        cy.contains('.activity-item', renvoiForOthers.content).should('be.exist')
      })
    })

    it('Dashboard_Activities_DisplayActivities_GroupActivity_Parent', function () {
      const documentActivity = this.dashboardData.existingActivity[8]
      // Login with author
      cy.login(MULTI_PARENT, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('.doc-activity').contains(documentActivity.document).should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivities_Filter_In_AllActivities', function () {
      const existingActivity = this.dashboardData.existingActivity
      const information = existingActivity[0]
      const group = existingActivity[1]
      const documentInGroup = existingActivity[2]
      const homeWork1 = existingActivity[5]
      const homeWork2 = existingActivity[6]
      const homeWorkDate = this.dashboardData.existingHomework[0]

      cy.login(STUDENT, dashboardURL)
      // Set date to see the homework
      cy.clock().invoke('setSystemTime', Cypress.dayjs(homeWorkDate.dateBefore, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      // Click to see all activities
      cy.contains('button', 'Voir toutes les activités').click()
      cy.get('.activities').should('have.class', 'infinite-scroll')
      // Check if all activity are visible
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('.activity-item', information.title).should('be.visible')
        cy.contains('.activity-item', documentInGroup.content).should('be.visible')
        cy.contains('.activity-item', group.content).should('be.visible')
        cy.contains('.activity-item', homeWork1.content).should('be.visible')
        cy.contains('.activity-item', homeWork2.content).should('be.visible')

        // Filtrer by informations
        cy.get('.filters').within(() => {
          cy.contains('button', 'Informations').click()
        })
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(2000)
        cy.contains('.activity-item', information.title).should('be.visible')
        cy.contains('.activity-item', documentInGroup.content).should('not.exist')
        cy.contains('.activity-item', homeWork1.content).should('not.exist')
        cy.contains('.activity-item', homeWork2.content).should('not.exist')

        // Filtrer by documents
        cy.get('.filters').within(() => {
          // Remove informations filter
          cy.contains('button', 'Informations').click()
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(2000)
          cy.contains('button', 'Documents').click()
        })
        getInformation(information).should('not.exist')
        cy.contains('.activity-item', group.content).should('not.exist')
        cy.contains('.activity-item', documentInGroup.content).should('be.visible')
        cy.contains('.activity-item', homeWork1.content).should('not.exist')
        cy.contains('.activity-item', homeWork2.content).should('not.exist')

        // Filtrer by cours et devoir
        cy.get('.filters').within(() => {
          // Remove informations filter
          cy.contains('button', 'Documents').click()
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(2000)
          cy.contains('button', 'Cours et devoirs').click()
        })
        getInformation(information).should('not.exist')
        cy.contains('.activity-item', group.content).should('not.exist')
        cy.contains('.activity-item', documentInGroup.content).should('not.exist')
        cy.contains('.activity-item', homeWork1.content).should('be.visible')
        cy.contains('.activity-item', homeWork2.content).should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivities_DisplayFilterMenu', function () {
      cy.login(STUDENT, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('.activity-filter').contains('button', 'Filtrer').click()
        // Check if filter panel is visible
        cy.get('.filters').should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivities_FuturRelease', function () {
      const futurActivity = this.dashboardData.futurActivity

      // Login
      cy.login(STUDENT, dashboardURL)
      // Set date before release
      cy.clock().invoke('setSystemTime', Cypress.dayjs(futurActivity.dateBeforeRelease, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      cy.get('[data-test="activity-widget"]').within(() => {
        // Check if information does not exist
        getInformation(futurActivity).should('not.exist')
      })
      // Login
      cy.login(STUDENT, dashboardURL)
      // Set date after release
      cy.clock().invoke('setSystemTime', Cypress.dayjs(futurActivity.publicationDate, 'YYYY/MM/DD').toDate().getTime()) // To put after login to make it works
      cy.get('[data-test="activity-widget"]').within(() => {
        // Check if information is visible
        getInformation(futurActivity).should('be.visible')
      })
    })

    it('Dashboard_Activities_CreateActivity_Button_HeaderActivity', function () {
      const activityToCreate = this.dashboardData.ActivityToCreate

      // Login
      cy.login(TEACHER, dashboardURL)
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000)
      cy.get('[data-test="activity-widget"]').within(() => {
        // Click to oopen createActivity modal
        cy.get('[data-test="CreateActivity"]').click()
      })
      // Set informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', activityToCreate.recipient).click()
        cy.get('.labelled').type(activityToCreate.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(activityToCreate.content)
        // submit
        cy.get('[data-test="submitButton"]').click()
      })
      // Check if the new activity is visible
      cy.get('[data-test="activity-widget"]').within(() => {
        getInformation(activityToCreate).should('be.visible').click()
      })
      // Verify the content
      getInformationDetail(activityToCreate).should('be.visible')

      // Login
      cy.login(STUDENT, dashboardURL)
      // Check if a student the new actvity is visible
      cy.get('[data-test="activity-widget"]').within(() => {
        // For wait to page load
        cy.request('https://dev-ent-gve.com/tableau-de-bord')
        cy.get('.activities').should('be.visible')
        // Display all activity
        cy.contains('button', 'Voir toutes les activités').click()
        cy.get('.activities').should('be.visible')
        getInformation(activityToCreate).should('be.visible').click()
      })
      // Verify the content
      getInformationDetail(activityToCreate)
    })

    it('Dashboard_Activities_CreateActivity_Button_AllActivity', function () {
      const existingActivity = this.dashboardData.existingActivity
      // Login
      cy.login(TEACHER, dashboardURL)
      cy.get('[data-test="activity-widget"]').should('be.visible').within(() => {
        // For wait to page load
        getInformation(existingActivity[0]).should('be.visible')
        // Display all activity
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Click on button to display modal createActivity
      cy.get('[data-test="CreateActivity"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_CreateActivity_Display_WarningMessage_SetInformations', function () {
      const activityToCreate = this.dashboardData.ActivityToCreate

      // Login
      cy.login(TEACHER, dashboardURL)

      // Open Create activity modal
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('[data-test="CreateActivity"]').click()
      })
      // Set content
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(activityToCreate.content)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')

      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('[data-test="CreateActivity"]').click()
      })

      // Set recipient
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', activityToCreate.recipient).click()
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('[data-test="CreateActivity"]').click()
      })

      // Set title
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.labelled').type(activityToCreate.title)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
    })

    it('Dashboard_Activities_CreateActivity_Display_WarningMessage_Not_SetInformations', function () {
      // Login
      cy.login(TEACHER, dashboardURL)

      // Open create activity modal
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('[data-test="CreateActivity"]').click()
      })
      // Not set informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')
    })

    it('Dashboard_Activities_UpdateActivity_mouseover', function () {
      const existingActivity = this.dashboardData.existingActivity
      const activityToEdit = this.dashboardData.activityToEdit

      // Login with student to chech if he don't see the information
      cy.login(PARENT, dashboardURL)
      getInformation(existingActivity[0]).should('not.exist')

      // Login to update information
      cy.login(TEACHER, dashboardURL)

      // Mouse over on the information
      getInformation(existingActivity[0]).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonEditInformation"]').click({ force: true })
      })
      // Set new informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        // Add all students in recipients
        cy.get('.suggestion-list').contains('li', activityToEdit.recipient).click()
        cy.get('.labelled').clear()
        cy.get('.labelled').type(activityToEdit.title)
        cy.get('.ck-editor')
        cy.type_ckeditor(activityToEdit.content)
        cy.get('[data-test="submitButton"]').click()
      })
      // Check if the modification exist
      getInformation(activityToEdit).should('be.exist')
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Check on information modified
      getInformation(activityToEdit).should('be.exist').click()
      // Check the content
      getInformationDetail(activityToEdit).should('be.exist')

      // Login with a student to see if now he can see the information
      cy.login(PARENT, dashboardURL)
      getInformation(activityToEdit).should('be.exist').click()
      // Check the content
      getInformationDetail(activityToEdit).should('be.exist')
    })

    it('Dashboard_Activities_UpdateActivity_clickActivity', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)

      // Click on information
      getInformation(existingActivity[0]).click()
      // open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivity_allActivity', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000)
      // Click on information
      getInformation(existingActivity[0]).click()
      // Open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivity_Display_WarningMessage_SetInformations', function () {
      const existingActivity = this.dashboardData.existingActivity
      const activityToEdit = this.dashboardData.activityToEdit
      cy.login(TEACHER, dashboardURL)

      // Mouse over on the information
      getInformation(existingActivity[0]).trigger('mouseover').within(() => {
        // Open Update modal
        cy.get('[data-test="buttonEditInformation"]').click({ force: true })
      })

      // Set content
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.ck-editor')
        cy.type_ckeditor(activityToEdit.content)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')

      // Mouse over on the information
      getInformation(existingActivity[0]).trigger('mouseover').within(() => {
        // Open Activity modal
        cy.get('[data-test="buttonEditInformation"]').click({ force: true })
      })
      // Set recipent
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.base-tags-input').click()
        cy.get('.suggestion-list').contains('li', activityToEdit.recipient).click()
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()

      // Mouse over on the information
      getInformation(existingActivity[0]).trigger('mouseover').within(() => {
        // Open activity modal
        cy.get('[data-test="buttonEditInformation"]').click({ force: true })
      })
      // Set title
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('.labelled').type(activityToEdit.title)
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
      // Click on confirm button
      cy.get('[data-test="confirmButton"]').click()
    })

    it('Dashboard_Activities_UpdateActivity_Display_WarningMessage_Not_SetInformations', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)

      // Mouse over on the information
      getInformation(existingActivity[0]).trigger('mouseover').within(() => {
        // Open update modal
        cy.get('[data-test="buttonEditInformation"]').click({ force: true })
      })
      // Not set informations
      cy.get('[data-test="update-news-modal"]').within(() => {
        cy.get('[data-test="closeModal"]').click()
      })
      // Check if warning modal is not visible
      cy.get('[data-test="warning-modal"]').should('not.exist')
      // Check if modal create message is not visible
      cy.get('[data-test="update-news-modal"]').should('not.exist')
    })

    it('Dashboard_Activities_DeleteActivity_mouseover', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)

      // Mouseover and click on delete button
      getInformation(existingActivity[0]).trigger('mouseover').within(() => {
        cy.get('[data-test="buttonDeleteInformation"]').click({ force: true })
      })
      // Confirm the delete
      cy.get('[data-test="confirmButton"]').click()

      // Check if news is delete
      getInformation(existingActivity[0]).should('not.exist')

      // Check if for the parents the news is delete
      cy.login(STUDENT, dashboardURL)
      getInformation(existingActivity[0]).should('not.exist')
    })

    it('Dashboard_Activities_DeleteActivity_clickActivity', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      // Click on information to open details
      getInformation(existingActivity[0]).click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DeleteActivity_allActivity', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      // For wait to page load
      getInformation(existingActivity[0]).should('be.visible')
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Click on information
      getInformation(existingActivity[0]).should('be.visible').click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })
  })
  context('Mobile', function () {
    it('Dashboard_Activities_CreateActivity_Button_HeaderActivity_Mobile', function () {
      cy.viewport('iphone-5')
      // Login
      cy.login(TEACHER, dashboardURL)
      cy.get('[data-test="activity-widget"]').within(() => {
        // Click on button to display modal createActivity
        cy.get('[data-test="CreateActivity"]').click()
      })
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })
    it('Dashboard_Activities_CreateActivity_Button_AllActivity_mobile', function () {
      cy.viewport('iphone-5')
      const existingActivity = this.dashboardData.existingActivity
      // Login
      cy.login(TEACHER, dashboardURL)
      cy.get('[data-test="activity-widget"]').should('be.visible').within(() => {
        // For wait to page load
        getInformation(existingActivity[0]).should('be.visible')
        // Display all activity
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Click on button to display modal createActivity
      cy.get('[data-test="CreateActivity"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivity_clickActivity_mobile', function () {
      cy.viewport('iphone-5')
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)

      // Click on information
      getInformation(existingActivity[0]).click()
      // open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivity_allActivity_mobile', function () {
      cy.viewport('iphone-5')
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      // For page load
      getInformation(existingActivity[0]).should('be.visible')
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Click on information
      getInformation(existingActivity[0]).click()
      // Open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DeleteActivity_clickActivity_mobile', function () {
      cy.viewport('iphone-5')
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      // Click on information to open details
      getInformation(existingActivity[0]).click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DeleteActivity_allActivity_mobile', function () {
      cy.viewport('iphone-5')
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      // For wait to page load
      getInformation(existingActivity[0]).should('be.visible')
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Click on information
      getInformation(existingActivity[0]).should('be.visible').click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })
  })
})
