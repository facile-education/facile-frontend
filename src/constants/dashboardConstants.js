
const nbActivityPerPage = 10

const activityTypes = {
  // File activity
  TYPE_FILE_CREATION: 1,
  TYPE_FILE_MODIFICATION: 2,
  TYPE_FILE_MOVE: 3,
  TYPE_FILE_DELETION: 4,

  // Folder activity
  TYPE_FOLDER_CREATION: 5,
  TYPE_FOLDER_MODIFICATION: 6,
  TYPE_FOLDER_MOVE: 7,
  TYPE_FOLDER_DELETION: 8,

  // Membership activity
  TYPE_ADD_MEMBERSHIP: 9,
  TYPE_REMOVE_MEMBERSHIP: 10,

  // Schoollife activity
  TYPE_PENDING_RENVOI: 11,
  TYPE_SCHOOL_RENVOI: 12
}

export {
  nbActivityPerPage,
  activityTypes
}
