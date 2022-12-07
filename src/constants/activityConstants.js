
const nbActivityPerPage = 20

const activityTypes = [
  // File activity
  { key: 'TYPE_FILE_CREATION', value: 1 },
  { key: 'TYPE_FILE_MODIFICATION', value: 2 },
  { key: 'TYPE_FILE_MOVE', value: 3 },
  { key: 'TYPE_FILE_DELETION', value: 4 },
  // Folder activity
  { key: 'TYPE_FOLDER_CREATION', value: 5 },
  { key: 'TYPE_FOLDER_MODIFICATION', value: 6 },
  { key: 'TYPE_FOLDER_MOVE', value: 7 },
  { key: 'TYPE_FOLDER_DELETION', value: 8 },
  // Membership activity
  { key: 'TYPE_ADD_MEMBERSHIP', value: 9 },
  { key: 'TYPE_REMOVE_MEMBERSHIP', value: 10 },
  // Schoollife activity
  { key: 'TYPE_PENDING_RENVOI', value: 11 },
  { key: 'TYPE_SCHOOL_RENVOI', value: 12 },
  // News activity
  { key: 'TYPE_NEWS', value: 13 },
  // Homework and session activity
  { key: 'TYPE_HOMEWORK', value: 14 },
  { key: 'TYPE_SESSION', value: 15 }
]

export {
  nbActivityPerPage,
  activityTypes
}
