import axios from 'axios'
import constants from './constants'

export default {
  getSchoolDMWidgetList,
  saveWidget,
  deleteWidget

}
const url = constants.DASHBOARD_MANAGER_URL

function getSchoolDMWidgetList (schoolId) {
  return axios.get(url, {
    params: {
      cmd: 'getAdministrationWidgets',
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function deleteWidget (widgetId) {
  return axios.get(url, {
    params: {
      cmd: 'removeWidget',
      widgetId: widgetId
    }
  }).then(response => response.data)
}

function saveWidget (widget) {
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}
