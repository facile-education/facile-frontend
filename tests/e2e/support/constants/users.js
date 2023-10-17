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
  login: 'lemarchantm',
  password,
  role: 'teacher',
  firstName: 'Mitzi',
  lastName: 'LE MARCHANT'
}

const CLASSTEACHER2 = { // An other class teacher than LE MARCHANT (0911R1)
  login: 'whitemanc',
  password,
  role: 'teacher',
  firstName: 'Clemence',
  lastName: 'WHITEMAN'
}

const SECRETARY = {
  login: 'laminmann',
  password,
  role: 'secretary',
  firstName: 'Noelyn',
  lastName: 'LAMINMAN'
}

const TEACHER = { // TEACHER of STUDENT
  login: 'nollir',
  password,
  role: 'teacher',
  firstName: 'Rosana',
  lastName: 'NOLLI'
}

const TEACHER2 = {
  login: 'breydinr',
  password,
  role: 'teacher',
  firstName: 'Rafaello',
  lastName: 'BREYDIN'
}

const STUDY_SUPERVISOR = {
  login: 'wallacem',
  password,
  role: 'teacher',
  firstName: 'Morgan',
  lastName: 'WALLACE'
}

const DETENTION_SUPERVISOR = {
  login: 'tawj',
  password,
  role: 'teacher',
  firstName: 'Jamie',
  lastName: 'TAW'
}

const DEPANNAGE_SUPERVISOR = { // tuesday 16:20 17:05
  login: 'pachecos',
  password,
  role: 'student',
  firstName: 'Sidney',
  lastName: 'PACHECO'
}

const STUDENT = { // 0933R3
  login: 'penelope.rbr',
  password,
  role: 'student',
  firstName: 'Pénélope',
  lastName: 'RIBEIRO'
}

const PARENT = { // Student's parent
  login: 'uribei', // 'hesmat' for the other student's parent
  password,
  role: 'parent',
  firstName: 'Ursula',
  lastName: 'Ribeiro'
}

const MULTI_STUDENT1 = { // Her parent has 2 children
  login: 'eleanora.cmncn',
  password,
  role: 'student',
  firstName: 'Eleanora',
  lastName: 'COMENCINI'
}

const MULTI_STUDENT2 = { // Her parent has 2 children
  login: 'barbara.cpr',
  password,
  role: 'student',
  firstName: 'Barbara',
  lastName: 'COOPER'
}

const MULTI_PARENT = { // This parent has 2 children : MULTI_STUDENT1 and MULTI_STUDENT2
  login: 'pcomen',
  password,
  role: 'parent',
  firstName: 'Percival',
  lastName: 'Comencini'
}

const SOCIAL_COUNSELOR = { // Social councelor of student (0933)
  login: 'krahlt',
  password,
  role: 'parent',
  firstName: 'Tomasine',
  lastName: 'KRAHL'
}

const PSYCHOLOGIST = { // psychologist of student (0933)
  login: 'glasnerd',
  password,
  role: 'parent',
  firstName: 'Donnajean',
  lastName: 'GLASNER'
}

export {
  GLOBAL_ADMIN,
  HEADMASTER,
  SCHOOL_ADMIN,
  DOYEN,
  TEACHER,
  TEACHER2,
  DEPANNAGE_SUPERVISOR,
  DETENTION_SUPERVISOR,
  STUDY_SUPERVISOR,
  CLASSTEACHER,
  CLASSTEACHER2,
  STUDENT,
  SECRETARY,
  PARENT,
  SOCIAL_COUNSELOR,
  PSYCHOLOGIST,
  MULTI_STUDENT1,
  MULTI_STUDENT2,
  MULTI_PARENT
}
