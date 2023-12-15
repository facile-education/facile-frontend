const exactString = (string) => {
  return new RegExp('^' + string + '$', 'g') // to use with "contain" assertion to fetch the entire string
}

const selectDropdownItem = (dropdownSelector, itemName) => {
  cy.get(dropdownSelector + ' > button').click()
  cy.get(dropdownSelector).contains('.suggestion-list > li', itemName).click()
}

const selectAutocompleteItem = (autocompleteSelector, itemName) => {
  cy.get(autocompleteSelector).find('input').clear()
  cy.get(autocompleteSelector).find('input').type(itemName)
  cy.get(autocompleteSelector).contains('.suggestion-list > li', itemName).click()
}

export {
  exactString,
  selectDropdownItem,
  selectAutocompleteItem
}
