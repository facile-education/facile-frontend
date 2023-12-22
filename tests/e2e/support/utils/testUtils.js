const exactString = (string) => {
  return new RegExp('^' + string + '$', 'g') // to use with "contain" assertion to fetch the entire string
}

const isInList = (list, item) => {
  return list.indexOf(item) !== -1
}

const selectDropdownItem = (wrappedDropdown, itemName) => {
  wrappedDropdown.within(() => {
    cy.get('button').click()
    cy.contains('.suggestion-list > li', itemName).click()
  })
}

const selectContextMenuOption = (optionName) => {
  cy.get('[data-test="context-menu"]').contains('li', optionName).click()
}

const selectAutocompleteItem = (wrappedAutocomplete, itemName, timeOut = undefined, requestToWait = undefined) => {
  wrappedAutocomplete.within(() => {
    cy.get('input').clear()
    cy.get('input').type(itemName)
    if (timeOut) {
      cy.tick(timeOut)
    }
    if (requestToWait) {
      cy.wait(requestToWait)
    }
    cy.contains('.suggestion-list > li', itemName).click()
  })
}

export {
  exactString,
  isInList,
  selectDropdownItem,
  selectAutocompleteItem,
  selectContextMenuOption
}
