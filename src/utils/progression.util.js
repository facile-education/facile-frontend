function isCoursNameInItemsList (items, groupName) {
  // Loop over items
  for (let itemIdx = 0; itemIdx < items.length; ++itemIdx) {
    const item = items[itemIdx]
    // Loop over assignments to match cours name
    const assignmentIndex = item.assignments.map(assignment => assignment.groupName).indexOf(groupName)
    if (assignmentIndex !== -1) {
      return true
    }
  }
  return false
}

export default {
  isCoursNameInItemsList
}

export {
  isCoursNameInItemsList
}
