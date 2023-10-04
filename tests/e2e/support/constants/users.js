const password = 'W€Prode73'

const GLOBAL_ADMIN = {
  login: 'pentila',
  password,
  role: 'admin'
}

const HEADMASTER = {
  login: 'hueo',
  password,
  role: 'headmaster',
  firstName: 'Orlan',
  lastName: 'HUE'
}

const SCHOOL_ADMIN = {
  login: 'ropkess',
  password,
  role: 'school admin',
  firstName: 'Stanislaus',
  lastName: 'ROPKES'
}

// Doyen for the student's class (0933)
const DOYEN = {
  login: 'lemarchantm',
  password,
  role: 'teacher',
  firstName: 'Mitzi',
  lastName: 'LE MARCHANT'
}

// Class teacher for the student's class (0933)
const CLASSTEACHER = {
  login: 'edu-mendezi',
  password,
  role: 'classTeacher',
  firstName: 'Isabel',
  lastName: 'Mendez'
}

const SECRETARY = {
  login: 'berishaer',
  password,
  role: 'secretary',
  lastName: 'Berishae'
}

const TEACHER = { // TEACHER of STUDENT
  login: 'nollir',
  password,
  role: 'teacher',
  firstName: 'Rosana',
  lastName: 'NOLLI'
}

const TEACHER2 = {
  login: 'lemarchantm',
  password,
  role: 'teacher',
  firstName: 'Mitzi',
  lastName: 'LE MARCHANT'
}

const STUDENT = { // 0933R3
  login: 'penelope.rbr',
  password,
  role: 'student',
  firstName: 'Pénélope',
  lastName: 'RIBEIRO'
}

const PARENT = { // Student's parent
  login: 'drousa', // 'hesmat' for the other student's parent
  password,
  role: 'parent',
  firstName: 'DYALA',
  lastName: 'ROUSAN'
}

const MULTI_STUDENT1 = { // Her parent has 2 children
  login: 'eleanora.cmncn',
  password,
  role: 'student'
}

const MULTI_STUDENT2 = { // Her parent has 2 children
  login: 'barbara.cpr',
  password,
  role: 'student'
}

const MULTI_PARENT = { // This parent has 2 children : MULTI_STUDENT1 and MULTI_STUDENT2
  login: 'pcomen',
  password,
  role: 'parent'
}

export {
  GLOBAL_ADMIN,
  HEADMASTER,
  SCHOOL_ADMIN,
  DOYEN,
  TEACHER,
  TEACHER2,
  CLASSTEACHER,
  STUDENT,
  SECRETARY,
  PARENT,
  MULTI_STUDENT1,
  MULTI_STUDENT2,
  MULTI_PARENT
}
