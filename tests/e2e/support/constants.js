const GLOBAL_ADMIN = {
  login: 'pentila',
  password: 'pentila',
  role: 'admin'
}

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
  role: 'school admin',
  firstName: 'Darko',
  lastName: 'Jovanovic'
}

// TODO Replace with doyen who is not school admin
const DOYEN = { // Doyen for the student's group class
  login: 'edu-prevostis',
  password: 'pentila',
  role: 'doyen',
  lastName: 'Prevosti'
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
  role: 'secretary',
  lastName: 'Berishae'
}

const TEACHER = {
  login: 'edu-regada',
  password: 'pentila',
  role: 'teacher',
  firstName: 'Alexandre',
  lastName: 'Regad'
}

const TEACHER2 = {
  login: 'edu-demirass',
  password: 'pentila',
  role: 'teacher',
  firstName: 'Serge',
  lastName: 'De Miras'
}

const STUDENT = {
  login: 'anya.alst',
  password: 'pentila',
  role: 'student',
  firstName: 'ANYA',
  lastName: 'ALOSTA'
}

const PARENT = { // Student's parent
  login: 'drousa', // 'hesmat' for the other student's parent
  password: 'pentila',
  role: 'parent',
  firstName: 'DYALA',
  lastName: 'ROUSAN'
}

const MULTI_STUDENT1 = { // Her parent has 2 children
  login: 'alexia.ln',
  password: 'pentila',
  role: 'student'
}

const MULTI_STUDENT2 = { // Her parent has 2 children
  login: 'lisa.hnc',
  password: 'pentila',
  role: 'student'
}

const MULTI_PARENT = { // This parent has 2 children : MULTI_STUDENT1 and MULTI_STUDENT2
  login: 'vleoni',
  password: 'pentila',
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
