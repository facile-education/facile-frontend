function sortAccesses (categoryList) {
  // First: sort categories
  categoryList.sort((a, b) => { return a.position > b.position })
  // Then, sort accesses in categories
  categoryList.forEach(category => {
    category.accessList.sort((a, b) => { return a.position > b.position })
  })

  return categoryList
}

export {
  sortAccesses
}
