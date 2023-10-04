const password = "W€Prode73"

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

// Doyen for the student's group class
const DOYEN = {
  login: 'borrillj',
  password,
  role: 'doyen',
  lastName: 'BORRILL'
}

// Class teacher for the student's class
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

const TEACHER = {
  login: 'edu-regada',
  password,
  role: 'teacher',
  firstName: 'Alexandre',
  lastName: 'Regad'
}

const TEACHER2 = {
  login: 'edu-demirass',
  password,
  role: 'teacher',
  firstName: 'Serge',
  lastName: 'De Miras'
}

const STUDENT = {
  login: 'anya.alst',
  password,
  role: 'student',
  firstName: 'ANYA',
  lastName: 'ALOSTA'
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
