import axios from 'axios'
import constants from './constants'

export default {
  getPortletList
}

const SERVICEMANAGER_PATH = '/gestionApplications-portlet.'
const SERVICE_CTX = '/'

function getPortletList () {
  return axios.get(constants.JSON_WS_URL + SERVICEMANAGER_PATH + SERVICE_CTX + 'get-portlets', {
    params: {
    }
  }).then(response => response.data)
}
