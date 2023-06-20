import axios from 'axios'
import PentilaUtils from 'pentila-utils'

import constants from '@/api/constants'

export {
  getScheduleConfiguration,
  saveScheduleConfiguration,
  getSchoolSlotConfiguration,
  saveSchoolSlotConfiguration
}

const SCHEDULEMANAGER_PATH = '/schedule.'
const SCHEDULEMANAGER_CTX = 'scheduleconfiguration/'
const SLOTCONFIGURATION_CTX = 'slotconfiguration/'

function getScheduleConfiguration () {
  return axios.get(constants.JSON_WS_URL + SCHEDULEMANAGER_PATH + SCHEDULEMANAGER_CTX + 'get-schedule-configuration', {
    params: {
    }
  }).then(response => response.data)
}

function saveScheduleConfiguration (startDate, semesterDate, endDate, holidays, h1Weeks, h2Weeks) {
  return axios.post(constants.JSON_WS_URL + SCHEDULEMANAGER_PATH + SCHEDULEMANAGER_CTX + 'save-schedule-configuration',
    PentilaUtils.URL.params({
      startDateStr: startDate,
      semesterDateStr: semesterDate,
      endDateStr: endDate,
      holidays,
      h1Weeks,
      h2Weeks
    })
  ).then(response => response.data)
}

function getSchoolSlotConfiguration (schoolId) {
  return axios.get(constants.JSON_WS_URL + SCHEDULEMANAGER_PATH + SLOTCONFIGURATION_CTX + 'get-school-slot-configuration', {
    params: {
      schoolId
    }
  }).then(response => response.data)
}

function saveSchoolSlotConfiguration (schoolId, slots) {
  return axios.post(constants.JSON_WS_URL + SCHEDULEMANAGER_PATH + SLOTCONFIGURATION_CTX + 'save-schedule-configuration',
    PentilaUtils.URL.params({
      schoolId,
      slots
    })
  ).then(response => response.data)
}
