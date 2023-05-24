import { url, helpTestMenu, helpSearchResultsMenu, helpAdminResultMenu, categoryToCreate } from '../../support/constants/help'
import { setServiceDiffusion, testArticleContent } from '../../support/utils/helpUtils'
import { GLOBAL_ADMIN, CLASSTEACHER, STUDENT } from '../../support/constants'

const firstSelectedCategory = helpTestMenu[0]
const firstSelectedItem = firstSelectedCategory.items[0]
const test = [...helpAdminResultMenu]
test.push(categoryToCreate)

describe('HelpModal', () => {
  beforeEach(() => {
    cy.login(url)
  })

  it('Test modal loading and article content', () => {
    cy.exec('npm run db:loadTables help_tables.sql')
    cy.clearDBCache()
    cy.login(url)

    // Open and close modal
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').find('[data-test="closeModal"]').click()
    cy.get('[data-test=help-modal]').should('not.exist')
    cy.get('[data-test=open-help-item]').click()
    // Test opening content
    cy.get('[data-test=help-modal]').within(() => {
      // Menu
      cy.get('nav.menu').within(() => {
        // Menu contains all the categories
        cy.get('button').should('have.length', helpTestMenu.length)
        helpTestMenu.forEach((category) => {
          cy.contains('button', category.name)
        })
        // First category is extended because all the visible links belongs to it
        cy.get('a').should('have.length', firstSelectedCategory.items.length)
        firstSelectedCategory.items.forEach((item) => {
          if (item === firstSelectedItem) {
            cy.contains('a', item.name).should('have.class', 'theme-text-color')
          } else {
            cy.contains('a', item.name).should('not.have.class', 'theme-text-color')
          }
        })
      })

      // Selected article
      testArticleContent(firstSelectedItem)
    })
  })

  it('Test navigation in the modal', () => {
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      // Categories
      cy.get('nav.menu').within(() => {
        // Unfold the second menu category
        cy.contains('button', helpTestMenu[1].name).click()
        cy.get('a').should('have.length', helpTestMenu[0].items.length + helpTestMenu[1].items.length)
        // Fold the first menu category
        cy.contains('button', helpTestMenu[0].name).click()
        cy.get('a').should('have.length', helpTestMenu[1].items.length)
      })

      // SelectItems from menu
      cy.contains('h2', firstSelectedItem.name)
      cy.contains('a', helpTestMenu[1].items[0].name).click()
      testArticleContent(helpTestMenu[1].items[0])

      // SelectItems from related link
      cy.contains('button', helpTestMenu[0].name).click()
      cy.contains('a', helpTestMenu[0].items[0].name).click()
      cy.get('aside').contains('a', helpTestMenu[0].items[0].article.related[0]).click()
      cy.contains('h2', helpTestMenu[0].items[0].article.related[0])
    })
  })

  it('Test mobile specificities', () => {
    cy.viewport('iphone-5')
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      // Test Menu toggling
      cy.get('nav.menu').should('not.exist')
      cy.get('[data-test=toggle-menu-icon]').click()
      cy.get('nav.menu').should('be.visible')
      cy.get('[data-test=toggle-menu-icon]').click()
      cy.get('nav.menu').should('not.exist')

      // Test aside part toggling
      cy.get('article').within(() => {
        cy.contains('a', firstSelectedItem.article.related[0]).should('not.exist')
        cy.get('[data-test=toggle-phone-links]').click()
        cy.contains('a', firstSelectedItem.article.related[0]).should('exist')
        cy.get('[data-test=toggle-phone-links]').click()
        cy.contains('a', firstSelectedItem.article.related[0]).should('not.exist')
      })

      // Toggle menu with search input
      cy.get('.help-tools').find('input').type('test', { force: true })
      cy.get('nav.menu').should('be.visible')
      cy.get('.help-tools').find('input').clear()
      cy.get('nav.menu').should('not.exist')
    })
  })

  it('Test search', () => {
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      // Help menu is normal
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', helpTestMenu.length)
        cy.get('a').should('have.length', firstSelectedCategory.items.length)
      })

      // Type something with no results
      cy.get('.help-tools').find('input').type('bhrebifgra', { force: true })
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', 0)
        cy.get('a').should('have.length', 0)
      })

      // Type something better
      cy.get('.help-tools').find('input').clear().type('avec un', { force: true })
      cy.get('nav.menu').within(() => {
        // Check if all the result categories are unfolded and contains the correct items
        cy.get('button').should('have.length', helpSearchResultsMenu.length)
        let nbItems = 0
        helpSearchResultsMenu.forEach((category) => {
          category.items.forEach((item) => {
            nbItems++
            cy.contains('a', item.name)
          })
        })
        cy.get('a').should('have.length', nbItems)
      })

      // Empty search bar to retrieve the original folded menu
      cy.get('.help-tools').find('input').clear()
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', helpTestMenu.length)
        cy.get('a').should('have.length', firstSelectedCategory.items.length)
      })
    })
  })

  it('Test admin specificities (empty sections and admin options)', () => {
    // Reload tables because of the admin creation tests
    cy.exec('npm run db:loadTables help_tables.sql')
    cy.clearDBCache()
    cy.login(url)

    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      // First, test if the admin options are not displayed for ordinary mortals
      // TODO (lots of hover, to see later)
    })

    // Second, test if all empty categories and sections are shown for admin
    cy.login(url, GLOBAL_ADMIN)
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      // Type something with no results to see empty categories
      cy.get('.help-tools').find('input').type('bhrebifgra', { force: true })
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', helpAdminResultMenu.length + 1) // (+1 is for the creation category button)
        cy.get('a').should('have.length', 0)
      })
      cy.get('.help-tools').find('input').clear()
    })

    // Third, test categories and items creation for admin
    // Create category
    cy.get('[data-test=create-category-button]').click()
    cy.get('[data-test=create-category-modal]').within(() => {
      cy.get('input').type(categoryToCreate.name)
      cy.get('.base-dropdown > .button').click()
      cy.get('.base-dropdown > .base-autocomplete').contains(categoryToCreate.service.label).click()
      cy.get('[data-test="submitButton"]').click()
    })
    cy.get('[data-test=create-category-modal]').should('not.exist')
    // Assure the new category's service is broadcast to all users
    setServiceDiffusion(categoryToCreate.service.id, [0])

    // Check category creation
    const newHelpAdminResultMenu = [...helpTestMenu]
    newHelpAdminResultMenu.push(categoryToCreate)
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', newHelpAdminResultMenu.length + 1) // (+1 is for the creation category button)
        cy.get('a').should('have.length', firstSelectedCategory.items.length)
      })

      // Create Item in the new category
      cy.contains('button', categoryToCreate.name).trigger('mouseover').get('[data-test=admin-create-category-button]').click()
    })

    const itemToCreate = categoryToCreate.items[0]
    cy.get('[data-test=create-article-modal]').within(() => {
      cy.get('input').eq(0).type(itemToCreate.name)
      cy.get('input').eq(1).type(itemToCreate.role.label)
      cy.get('.suggestion-list').contains(itemToCreate.role.label).click()
      cy.get('input').eq(0).click() // make disappear the suggestion-list
      cy.get('[data-test="submitButton"]').click()
    })
    cy.get('[data-test=create-article-modal]').should('not.exist')
    // Check item creation
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.contains('button', categoryToCreate.name).click()
        cy.contains('a', itemToCreate.name).click()
      })
    })

    // Test the item diffusion by role
    cy.login(url, itemToCreate.role.concernedUser)
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.contains('button', categoryToCreate.name).click()
        cy.contains('a', itemToCreate.name).click()
      })
    })

    cy.login(url, itemToCreate.role.notConcernedUser)
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', helpTestMenu.length) // (+1 is for the creation category button)
        cy.contains('button', categoryToCreate.name).should('not.exist') // Empty category doesn't appear
      })
    })
  })

  it('Category diffusion by service', () => {
    const teacherRoleId = 11220

    cy.exec('npm run db:loadTables help_tables.sql')
    cy.clearDBCache()
    cy.login(url, GLOBAL_ADMIN)

    cy.get('[data-test=open-help-item]').click()

    // Create a non-empty category (with an item inside)
    cy.get('[data-test=create-category-button]').click()
    cy.get('[data-test=create-category-modal]').within(() => {
      cy.get('input').type(categoryToCreate.name)
      cy.get('.base-dropdown > .button').click()
      cy.get('.base-dropdown > .base-autocomplete').contains(categoryToCreate.service.label).click()
      cy.get('[data-test="submitButton"]').click()
    })
    cy.get('[data-test=create-category-modal]').should('not.exist')

    const secondItemToCreate = categoryToCreate.items[1]
    cy.get('[data-test=help-modal]').within(() => {
      cy.contains('button', categoryToCreate.name).trigger('mouseover').get('[data-test=admin-create-category-button]').click()
    })
    cy.get('[data-test=create-article-modal]').within(() => {
      cy.get('input').eq(0).type(secondItemToCreate.name)
      cy.get('[data-test="submitButton"]').click()
    })
    cy.get('[data-test=create-article-modal]').should('not.exist')
    // Check item creation
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.contains('button', categoryToCreate.name).click()
        cy.contains('a', secondItemToCreate.name).click()
      })
    })

    // Set the category diffusion to only teachers
    setServiceDiffusion(categoryToCreate.service.id, [teacherRoleId])

    // Test the Category diffusion
    cy.login(url, CLASSTEACHER)
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.contains('button', categoryToCreate.name).click() // The category and the item are here
        cy.contains('a', secondItemToCreate.name)
      })
    })

    cy.login(url, STUDENT)
    cy.get('[data-test=open-help-item]').click()
    cy.get('[data-test=help-modal]').within(() => {
      cy.get('nav.menu').within(() => {
        cy.get('button').should('have.length', helpTestMenu.length)
        cy.contains('button', categoryToCreate.name).should('not.exist') // The category doesn't exist
      })
    })
  })
})
