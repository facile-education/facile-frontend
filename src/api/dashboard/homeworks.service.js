import axios from 'axios'

import constants from '@/api/constants'

export {
  getHomeworks,
  setHomeworkDoneStatus
}

const CDT_PATH = '/schedule.'
const HOMEWORKS_CTX = 'homework/'

function getHomeworks (studentId, minDate, undoneOnly) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + HOMEWORKS_CTX + 'get-homeworks', {
    params: {
      studentId,
      minDate,
      undoneOnly
    }
  }).then(response => response.data)
}

function setHomeworkDoneStatus (homeworkId, isDone) {
  return axios.get(constants.JSON_WS_URL + CDT_PATH + HOMEWORKS_CTX + 'set-homework-done', {
    params: {
      homeworkId,
      isDone
    }
  }).then(response => response.data)
}
