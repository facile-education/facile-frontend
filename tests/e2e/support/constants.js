const HEADMASTER = {
  login: 'didiosa',
  password: 'pentila',
  role: 'headmaster',
  firstName: 'Salvatore',
  lastName: 'Di Dio'
}

const SCHOOL_ADMIN = {
  login: 'edu-jovanovicd',
  password: 'pentila',
  role: 'school admin'
}

// TODO Replace with doyen who is not school admin
const DOYEN = { // Doyen for the student's group class
  login: 'edu-prevostis',
  password: 'pentila',
  role: 'doyen'
}

const CLASSTEACHER = { // Class teacher for the student's class
  login: 'edu-mendezi',
  password: 'pentila',
  role: 'classTeacher',
  firstName: 'Isabel',
  lastName: 'Mendez'
}

const SECRETARY = {
  login: 'berishaer',
  password: 'pentila',
  role: 'secretary'
}

const TEACHER = {
  login: 'edu-regada',
  password: 'pentila',
  role: 'teacher',
  firstName: 'Alexandre',
  lastName: 'Regad'
}

const STUDENT = {
  login: 'anya.alst',
  password: 'pentila',
  role: 'student'
}

const PARENT = { // Student's parent
  login: 'drousa', // 'hesmat' for the other student's parent
  password: 'pentila',
  role: 'parent'
}

export {
  HEADMASTER,
  SCHOOL_ADMIN,
  DOYEN,
  TEACHER,
  CLASSTEACHER,
  STUDENT,
  SECRETARY,
  PARENT
}
