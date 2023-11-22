import { dashboardURL } from '../../support/constants/urls'
import { DOYEN, MULTI_PARENT, PARENT, STUDENT, TEACHER, TEACHER2 } from '../../support/constants/users'
import { getInformation, getInformationDetail, loadActivity, setActivityWithContent } from '../../support/utils/dashboard'

describe('Dashboard_Activity', () => {
  context('StaticDataDumpActivities', function () {
    beforeEach(() => {
      setActivityWithContent()
      cy.fixture('dashboard.json').as('dashboardData')
      cy.loadTables('schoollife/schoollife_tables.sql')
    })
    it('Dashboard_Activities_DisplayActivityDisplayLimiteNumberActivities', function () {
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

    it('Dashboard_Activities_DisplayActivityClickOnDocumentRedirectionStudentParent', function () {
      // Login with student
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Redirection document
      cy.get('.doc-activity').within(() => {
        cy.contains('i', 'document.odt').click()
      })
      cy.get('[data-test="file-display-modal"]').should('be.visible')

      // Login with parent
      cy.login(MULTI_PARENT, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Redirection document
      cy.get('.doc-activity').within(() => {
        cy.contains('i', 'note.html').click()
      })
      cy.get('[data-test="file-display-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DisplayActivityClickOnDocumentSpaceRedirection', function () {
      const existingActivity = this.dashboardData.existingActivity
      const DocumentSpace = existingActivity[1]
      // Login
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Redirection document
      cy.get('.doc-activity').within(() => {
        cy.contains('i', DocumentSpace.title).click()
      })
      cy.url().should('eq', 'https://dev-ent-gve.com/documents/groups/546901')
      cy.get('.documents').should('be.visible')
    })

    it('Dashboard_Activities_DisplayActivityDisplay_Placeholder', function () {
      // Load dump empty
      cy.loadTables('dashboard/dashboard_tables_activity_empty.sql')
      // Login
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
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
      loadActivity('get-dashboard-activity')

      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').scrollIntoView()
        cy.contains('button', 'Voir toutes les activités').click()
        cy.get('.activities').should('have.class', 'infinite-scroll')
        getInformation(information).should('be.visible')
        getInformation(group).should('be.visible')
        getInformation(documentInGroup).should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivitiesDisplayInRightOrder', function () {
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
      loadActivity('get-dashboard-activity')
      // Click to see all activities
      cy.contains('button', 'Voir toutes les activités').scrollIntoView()
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

    it('Dashboard_Activities_DisplayActivityClickOnGroupRedirectionByProfil', function () {
      const existingActivity = this.dashboardData.existingActivity
      const groupStudent = existingActivity[1]
      const groupTeacher = existingActivity[7]

      // Login with teacher
      cy.login(TEACHER2, dashboardURL)
      loadActivity('get-dashboard-activity')

      cy.contains('.membership-activity', groupTeacher.title).within(() => {
        cy.contains('i', groupTeacher.title).click()
      })
      cy.get('.group-list').should('be.visible')

      // Login with student
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')

      cy.contains('.membership-activity', groupStudent.title).within(() => {
        cy.contains('i', groupStudent.title).click()
      })
      cy.get('.group-list').should('not.exist')
    })

    it('Dashboard_Activities_DisplayActivityClickOnHomeworkRedirection', function () {
      const existingActivity = this.dashboardData.existingActivity
      const homeWork1 = existingActivity[5]
      // Login
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')

      // Redirection homework
      cy.contains('.activity-item', homeWork1.content).click()
      cy.get('.homework-tab').should('be.visible')
    })

    it('Dashboard_Activities_DisplayActivityClickOnFiringRedirectionByProfil', function () {
      const renvoiForAuthor = this.dashboardData.existingActivity[3]
      const renvoiForOthers = this.dashboardData.existingActivity[4]

      // Login with author
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Redirection firing for the author
      cy.contains('.activity-item', renvoiForAuthor.content).click()
      cy.get('.pending-firing-modal').should('be.visible')

      // Login with doyen
      cy.login(DOYEN, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Redirection firing for the doyen
      cy.contains('.activity-item', renvoiForOthers.content).click()
      cy.get('.pending-firing-modal').should('not.exist')
    })

    it('Dashboard_Activities_DisplayActivitiesRenvoiVisibilityByProfil', function () {
      const renvoiForAuthor = this.dashboardData.existingActivity[3]
      const renvoiForOthers = this.dashboardData.existingActivity[4]

      // Login with author
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

      cy.get('[data-test="activity-widget"]').within(() => {
        // Check the position of activities
        cy.contains('.activity-item', renvoiForAuthor.content).should('be.exist')
      })

      // Login with class doyen
      cy.login(DOYEN, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').within(() => {
        // Check the position of activities
        cy.contains('.activity-item', renvoiForOthers.content).should('be.exist')
      })
    })

    it('Dashboard_Activities_DisplayActivitiesGroupActivityParent', function () {
      const documentActivity = this.dashboardData.existingActivity[8]
      // Login with author
      cy.login(MULTI_PARENT, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('.doc-activity').contains(documentActivity.document).should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivitiesFilterInAllActivities', function () {
      const existingActivity = this.dashboardData.existingActivity
      const information = existingActivity[0]
      const group = existingActivity[1]
      const documentInGroup = existingActivity[2]
      const homeWork1 = existingActivity[5]
      const homeWork2 = existingActivity[6]
      const homeWorkDate = this.dashboardData.existingHomework[0]

      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
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

        cy.contains('.activity-item', information.title).should('be.visible')
        cy.contains('.activity-item', documentInGroup.content).should('not.exist')
        cy.contains('.activity-item', homeWork1.content).should('not.exist')
        cy.contains('.activity-item', homeWork2.content).should('not.exist')

        // Filtrer by documents
        cy.get('.filters').within(() => {
          // Remove informations filter
          cy.contains('button', 'Informations').click()
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
          cy.contains('button', 'Cours et devoirs').click()
        })
        getInformation(information).should('not.exist')
        cy.contains('.activity-item', group.content).should('not.exist')
        cy.contains('.activity-item', documentInGroup.content).should('not.exist')
        cy.contains('.activity-item', homeWork1.content).should('be.visible')
        cy.contains('.activity-item', homeWork2.content).should('be.visible')
      })
    })

    it('Dashboard_Activities_DisplayActivitiesDisplayFilterMenu', function () {
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('.activity-filter').contains('button', 'Filtrer').click()
        // Check if filter panel is visible
        cy.get('.filters').should('be.visible')
      })
    })
  })

  context('NewsActivity', function () {
    beforeEach(() => {
      cy.fixture('dashboard.json').as('dashboardData')
      cy.loadTables('schoollife/schoollife_tables.sql')
      cy.loadTables('dashboard/dashboard_tables_activity_News.sql')
    })
    it('Dashboard_Activities_DisplayActivitiesFuturRelease', function () {
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

    it('Dashboard_Activities_DisplayActivityCheckInformationReadRecipientInfo', function () {
      const existingActivity = this.dashboardData.existingActivity

      // Login with author
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

      cy.get('[data-test="activity-widget"]').within(() => {
        getInformation(existingActivity[0]).click()
      })
      cy.get('[data-test="news-details-modal"]').within(() => {
        // No one read this event
        cy.get('.read-infos').should('contain', '0 destinataire')
      })

      // Login recipient
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Student read this event
      getInformation(existingActivity[0]).click()

      // Login with author
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

      getInformation(existingActivity[0]).click()
      cy.get('[data-test="news-details-modal"]').within(() => {
        // No one read this event
        cy.get('.read-infos').should('contain', '1 destinataire')
        // Open recipients infos
        cy.get('.read-infos > button').click()
      })
      cy.get('[data-test="readInfoModal"]').within(() => {
        cy.get('.population').click()
        cy.contains('.read-info-user', `${STUDENT.lastName} ${STUDENT.firstName}`).should('not.contain', 'Non lu')
      })
    })

    it('Dashboard_Activities_DisplayActivityCheckInformationContent', function () {
      const existingActivity = this.dashboardData.existingActivity

      // Login recipient
      cy.login(STUDENT, dashboardURL)
      loadActivity('get-dashboard-activity')
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

    it('Dashboard_Activities_CreateActivityButtonHeaderActivity', function () {
      const activityToCreate = this.dashboardData.ActivityToCreate

      // Login
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').within(() => {
        // Click to oopen createActivity modal
        cy.get('[data-test="CreateActivity"]').click()
      })
      loadActivity('get-news-details')
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
        cy.get('.activities').should('be.visible')
        // Display all activity
        cy.contains('button', 'Voir toutes les activités').click()
        cy.get('.activities').should('be.visible')
        getInformation(activityToCreate).should('be.visible').click()
      })
      // Verify the content
      getInformationDetail(activityToCreate)
    })

    it('Dashboard_Activities_CreateActivityButtonAllActivity', function () {
      // Login
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').should('be.visible').within(() => {
        // Display all activity
        cy.contains('button', 'Voir toutes les activités').click()
      })
      // Click on button to display modal createActivity
      cy.get('[data-test="CreateActivity"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_CreateActivity_DisplayWarningMessageSetInformations', function () {
      const activityToCreate = this.dashboardData.ActivityToCreate

      // Login
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

      // Open Create activity modal
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.get('[data-test="CreateActivity"]').click()
      })
      loadActivity('get-news-details')
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

    it('Dashboard_Activities_CreateActivityDisplayWarningMessageNotSetInformations', function () {
      // Login
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

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
      loadActivity('get-dashboard-activity')
      getInformation(existingActivity[0]).should('not.exist')

      // Login to update information
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

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
      loadActivity('get-dashboard-activity')
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

    it('Dashboard_Activities_UpdateActivityclickActivity', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

      // Click on information
      getInformation(existingActivity[0]).click()
      // open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivityAllActivity', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      loadActivity('get-dashboard-activity')
      // Click on information
      getInformation(existingActivity[0]).click()
      // Open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivityDisplayWarningMessageSetInformations', function () {
      const existingActivity = this.dashboardData.existingActivity
      const activityToEdit = this.dashboardData.activityToEdit
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

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

    it('Dashboard_Activities_UpdateActivityDisplayWarningMessageNotSetInformations', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

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

    it('Dashboard_Activities_DeleteActivityMouseover', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')

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

    it('Dashboard_Activities_DeleteActivityClickActivity', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Click on information to open details
      getInformation(existingActivity[0]).click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DeleteActivityAllActivity', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      loadActivity('get-dashboard-activity')
      // Click on information
      getInformation(existingActivity[0]).should('be.visible').click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })
  })
  context('Mobile', function () {
    beforeEach(() => {
      cy.fixture('dashboard.json').as('dashboardData')
      cy.loadTables('dashboard/dashboard_tables_activity_News.sql')
      cy.viewport('iphone-5')
    })
    it('Dashboard_Activities_CreateActivityButtonHeaderActivityMobile', function () {
      // Login
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').within(() => {
        // Click on button to display modal createActivity
        cy.get('[data-test="CreateActivity"]').click()
      })
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })
    it('Dashboard_Activities_CreateActivityButtonAllActivityMobile', function () {
      // Login
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      cy.get('[data-test="activity-widget"]').should('be.visible').within(() => {
        // Display all activity
        cy.contains('button', 'Voir toutes les activités').click()
      })
      loadActivity('get-dashboard-activity')
      // Click on button to display modal createActivity
      cy.get('[data-test="CreateActivity"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivityClickActivityMobile', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Click on information
      getInformation(existingActivity[0]).click()
      // open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_UpdateActivityAllActivityMobile', function () {
      const existingActivity = this.dashboardData.existingActivity
      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Display all activity
      cy.get('[data-test="activity-widget"]').within(() => {
        cy.contains('button', 'Voir toutes les activités').click()
      })
      loadActivity('get-dashboard-activity')
      // Click on information
      getInformation(existingActivity[0]).click()
      // Open update modal
      cy.get('[data-test="updateButton"]').click()
      // Check if modal is visible
      cy.get('[data-test="update-news-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DeleteActivityClickActivityMobile', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
      // Click on information to open details
      getInformation(existingActivity[0]).click()
      // Click on delete button
      cy.get('[data-test="deleteButton"]').click()
      // Check if in the warning modal content there is the news title
      cy.get('[data-test="warning-modal"]').should('be.visible')
    })

    it('Dashboard_Activities_DeleteActivityAllActivityMobile', function () {
      const existingActivity = this.dashboardData.existingActivity

      cy.login(TEACHER, dashboardURL)
      loadActivity('get-dashboard-activity')
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
