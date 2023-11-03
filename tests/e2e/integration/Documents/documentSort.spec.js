import { documentURL } from '../../support/constants/urls'
import { HEADMASTER } from '../../support/constants/users'
import { waitDocumentServiceToBeLoaded } from '../../support/utils/documents'

const compare = (field, order, a, b) => {
  if (field === 'size') {
    return order === 'asc' ? a[field] - b[field] : b[field] - a[field]
  } else {
    if (order === 'asc') {
      return a[field].toString().localeCompare(b[field].toString())
    } else {
      return b[field].toString().localeCompare(a[field].toString())
    }
  }
}
const sortEntities = (currentFolder, field, order) => {
  const sortedFolders = [...currentFolder.folders].sort((a, b) => { return compare(field, order, a, b) })
  const sortedFiles = [...currentFolder.files].sort((a, b) => { return compare(field, order, a, b) })
  return [...sortedFolders, ...sortedFiles]
}

describe('Documents_SortDocuments', () => {
  beforeEach(() => {
    cy.fixture('documents.json').as('documentsData')

    cy.login(HEADMASTER, documentURL)
    waitDocumentServiceToBeLoaded()
  })

  it('Documents_SortDocuments_SortDocumentsOnFieldNameClick', function () {
    const currentFolder = this.documentsData.currentPersonalDocumentsStructure
    const ascNameSortedDocuments = sortEntities(currentFolder, 'label', 'asc')
    const descNameSortedDocuments = sortEntities(currentFolder, 'label', 'desc')
    const ascSizeSortedDocuments = sortEntities(currentFolder, 'size', 'asc')
    const descSizeSortedDocuments = sortEntities(currentFolder, 'size', 'desc')
    const ascDateSortedDocuments = sortEntities(currentFolder, 'lastModifiedDate', 'asc')
    const descDateSortedDocuments = sortEntities(currentFolder, 'lastModifiedDate', 'desc')
    const initialSortedDocuments = ascNameSortedDocuments

    // Initial (Alphanumeric asc)
    for (let i = 0; i < initialSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', initialSortedDocuments[i].label)
    }

    // Alphanumeric (desc)
    cy.get('[data-test=fields]').contains('Nom').click()
    cy.contains('[data-test=fields] .field', 'Nom').find('.icon[aria-label="Décroissant"]').should('be.visible')
    for (let i = 0; i < descNameSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', descNameSortedDocuments[i].label)
    }

    // Alphanumeric (asc)
    cy.get('[data-test=fields]').contains('Nom').click()
    cy.contains('[data-test=fields] .field', 'Nom').find('.icon[aria-label="Croissant"]').should('be.visible')
    for (let i = 0; i < ascNameSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', ascNameSortedDocuments[i].label)
    }

    // Size (asc)
    console.log(ascSizeSortedDocuments, descSizeSortedDocuments)
    cy.get('[data-test=fields]').contains('Taille').click()
    cy.contains('[data-test=fields] .field', 'Taille').find('.icon[aria-label="Croissant"]').should('be.visible')
    for (let i = 0; i < ascSizeSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', ascSizeSortedDocuments[i].label)
    }

    // Size (desc)
    cy.get('[data-test=fields]').contains('Taille').click()
    cy.contains('[data-test=fields] .field', 'Taille').find('.icon[aria-label="Décroissant"]').should('be.visible')
    for (let i = 0; i < descSizeSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', descSizeSortedDocuments[i].label)
    }

    // Date (desc)
    cy.get('[data-test=fields]').contains('Dernière modif.').click()
    cy.contains('[data-test=fields] .field', 'Dernière modif.').find('.icon[aria-label="Décroissant"]').should('be.visible')
    for (let i = 0; i < descSizeSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', descDateSortedDocuments[i].label)
    }

    // Date (asc)
    cy.get('[data-test=fields]').contains('Dernière modif.').click()
    cy.contains('[data-test=fields] .field', 'Dernière modif.').find('.icon[aria-label="Croissant"]').should('be.visible')
    for (let i = 0; i < ascSizeSortedDocuments.length; i++) {
      cy.get('[data-cy=document]').eq(i).should('contain', ascDateSortedDocuments[i].label)
    }
  })
})
