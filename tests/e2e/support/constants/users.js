const password = 'W€Prode73'

const GLOBAL_ADMIN = {
  login: 'admin',
  password,
  role: 'admin'
}

const HEADMASTER = {
  login: 'hueo',
  password,
  role: 'headmaster',
  firstName: 'Orlan',
  lastName: 'HUE',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
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
  lastName: 'LE MARCHANT',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}

// Class teacher for the student's class (0933)
const CLASSTEACHER = {
  login: 'lemarchantm',
  password,
  role: 'teacher',
  firstName: 'Mitzi',
  lastName: 'LE MARCHANT',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
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
  lastName: 'LAMINMAN',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
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
  role: 'teacher',
  firstName: 'Sidney',
  lastName: 'PACHECO'
}

const STUDENT = { // 0933R3
  login: 'penelope.rbr',
  password,
  role: 'student',
  firstName: 'Pénélope',
  lastName: 'RIBEIRO',
  isVisibleParent: true,
  isVisiblePersonnels: true
}

const PARENT = { // Student's parent
  login: 'uribei', // 'hesmat' for the other student's parent
  password,
  role: 'parent',
  firstName: 'Ursula',
  lastName: 'Ribeiro',
  isVisibleStudent: true
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

const PSYCHOLOGIST = { // psychologist of student (0933)
  login: 'glasnerd',
  password,
  role: 'parent',
  firstName: 'Donnajean',
  lastName: 'GLASNER'
}

const TECHNICAL_ASSISSTANT = {
  lastName: 'BETTANEY',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}

const LIBRARIAN = {
  lastName: 'ROSENFELD',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}

const ACCOUNTING_CASHIER = {
  lastName: 'GLYNN',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}
const ORIENTATION_COUNSELOR = {
  lastName: 'PIDEON',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}

const SOCIAL_COUNSELOR = { // Social councelor of student (0933)
  login: 'krahlt',
  password,
  role: 'parent',
  firstName: 'Tomasine',
  lastName: 'KRAHL',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}

const NURSE = {
  lastName: 'BELLSHAM',
  isVisibleStudent: true,
  isVisibleParent: true,
  isVisiblePersonnels: true
}

const STUDENT_IN_CLASS = { // Student in class for student penelope
  lastName: 'BATTELLI',
  isVisibleStudent: true,
  isVisibleParent: false,
  isVisiblePersonnels: true
}

const STUDENT_NOT_IN_CLASS = { // Student not in class for student penelope
  lastName: 'BATTELLI',
  isVisibleStudent: false,
  isVisibleParent: false,
  isVisiblePersonnels: true
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
  MULTI_PARENT,
  TECHNICAL_ASSISSTANT,
  LIBRARIAN,
  ACCOUNTING_CASHIER,
  ORIENTATION_COUNSELOR,
  NURSE,
  STUDENT_IN_CLASS,
  STUDENT_NOT_IN_CLASS
}
