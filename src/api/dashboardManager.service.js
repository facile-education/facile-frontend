import axios from 'axios'
import constants from './constants'

export default {
  getSchoolDMWidgetList,
  saveWidget,
  deleteWidget
}

function getSchoolDMWidgetList (schoolId) {
  const url = constants.BASE_URL + '/api/get_managed_widget_list'
  return axios.get(url, {
    params: {
      cmd: 'getAdministrationWidgets',
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function deleteWidget (widgetId) {
  const url = constants.BASE_URL + '/api/delete_widget'
  return axios.get(url, {
    params: {
      cmd: 'removeWidget',
      widgetId: widgetId
    }
  }).then(response => response.data)
}

function saveWidget (widget) {
  const url = constants.BASE_URL + '/api/save_widget'
  return axios.post(url, {
    cmd: 'saveWidget',
    widget: JSON.stringify(widget)
  }).then(response => response.data)
}
