import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getStudentHomeworks,
  getTeacherHomeworksToCorrect,
  setHomeworkDoneStatus,
  createHomework,
  updateHomework,
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

function getTeacherHomeworksToCorrect () {
  return axios.get(constants.JSON_WS_URL + HOMEWORK_PATH + 'get-teacher-homeworks-to-correct', {
    params: {
    }
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

function createHomework (courseId, sourceSessionId, targetSessionId, targetDate, homeworkType, students, blocks) {
  return axios.post(constants.JSON_WS_URL + HOMEWORK_PATH + 'create-homework', PentilaUtils.URL.params({
    courseId,
    sourceSessionId,
    targetSessionId,
    targetDate,
    homeworkType,
    students: JSON.stringify(students),
    blocks: JSON.stringify(blocks)
  })).then(response => response.data)
}

function updateHomework (homeworkId, targetSessionId, targetDate, homeworkType, students, blocks) {
  return axios.post(constants.JSON_WS_URL + HOMEWORK_PATH + 'update-homework', PentilaUtils.URL.params({
    homeworkId,
    targetSessionId,
    targetDate,
    homeworkType,
    students: JSON.stringify(students),
    blocks: JSON.stringify(blocks)
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
