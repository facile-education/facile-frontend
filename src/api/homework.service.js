import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getStudentHomeworks,
  getStudentUndoneCount,
  getTeacherHomeworksToCorrect,
  setHomeworkDoneStatus,
  getStudentsDoneStatus,
  createHomework,
  updateHomework,
  deleteHomework,
  dropHomeworkFile,
  correctFile
}

const HOMEWORK_PATH = '/course.homework/'

function getStudentHomeworks (studentId, minDateStr, maxDateStr, undoneOnly) {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'get-student-homeworks', {
    params: {
      studentId,
      minDateStr,
      maxDateStr,
      undoneOnly
    }
  }).then(response => response.data)
}

function getStudentUndoneCount (studentId, minDateStr = '', maxDateStr = '') {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'count-undone-homeworks', {
    params: {
      studentId,
      minDateStr,
      maxDateStr
    }
  }).then(response => response.data)
}

function getTeacherHomeworksToCorrect () {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'get-teacher-homeworks-to-correct', {
    params: {}
  }).then(response => response.data)
}

function setHomeworkDoneStatus (homeworkId, isDone) {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'set-homework-done', {
    params: {
      homeworkId,
      isDone
    }
  }).then(response => response.data)
}
function getStudentsDoneStatus (homeworkId) {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'get-students-done-status', {
    params: {
      homeworkId
    }
  }).then(response => response.data)
}

function createHomework (courseId, sourceSessionId, homework, publicationDate, isDraft) {
  return axios.post(constants.JSON_WS_URL + HOMEWORK_PATH + 'create-homework', PentilaUtils.URL.params({
    courseId,
    title: homework.title,
    sourceSessionId,
    targetSessionId: homework.targetSessionId,
    targetDateStr: homework.toDate,
    homeworkType: homework.homeworkType.type,
    estimatedTime: homework.homeworkDuration ? homework.homeworkDuration.time : 0,
    students: homework.isWholeClass ? '' : JSON.stringify(homework.selectedStudents),
    blocks: JSON.stringify(homework.blocks),
    publicationDateStr: publicationDate.format('YYYY-MM-DD HH:mm'),
    isDraft
  })).then(response => response.data)
}

function updateHomework (homework, publicationDate, isDraft) {
  return axios.post(constants.JSON_WS_URL + HOMEWORK_PATH + 'update-homework', PentilaUtils.URL.params({
    homeworkId: homework.homeworkId,
    title: homework.title,
    targetSessionId: homework.targetSessionId,
    targetDateStr: homework.toDate,
    estimatedTime: homework.homeworkDuration ? homework.homeworkDuration.time : 0,
    homeworkType: homework.homeworkType.type,
    students: homework.isWholeClass ? '' : JSON.stringify(homework.selectedStudents),
    blocks: JSON.stringify(homework.blocks),
    publicationDateStr: publicationDate.format('YYYY-MM-DD HH:mm'),
    isDraft
  })).then(response => response.data)
}

function deleteHomework (homeworkId) {
  return axios.post(constants.JSON_WS_URL + HOMEWORK_PATH + 'delete-homework', PentilaUtils.URL.params({
    homeworkId
  })).then(response => response.data)
}

function dropHomeworkFile (homeworkId, fileEntryId) {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'drop-homework-file', {
    params: {
      homeworkId,
      fileEntryId
    }
  }).then(response => response.data)
}

function correctFile (homeworkId, studentId, comment) {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'correct-file', {
    params: {
      homeworkId,
      studentId,
      comment
    }
  }).then(response => response.data)
}
