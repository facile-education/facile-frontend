import axios from 'axios'
import constants from './constants'

export default {
  getMessageList,
  getBoxList,
  getAutoResponses,
  getInternalMessagingConfiguration,
  hasExternalCommunicationRights,
  getMailAccounts
}

function getMessageList () {
  const url = constants.BASE_URL + '/api/get_user_message_list'
  return axios.get(url, {
    params: {
      cmd: 'getSchoolList',
      isAscending: '',
      nbMessagesDisplayed: '',
      search: '',
      startIM: '',
      startMail: ''
    }
  }).then(response => response.data)
}

function getBoxList () {
  const url = constants.BASE_URL + '/api/get_mess_boxes'
  return axios.get(url, {
    params: {
      cmd: 'getAllBoxes'
    }
  }).then(response => response.data)
}

function getInternalMessagingConfiguration () {
  const url = constants.BASE_URL + '/api/get_mess_configuration'
  return axios.get(url, {
    params: {
      cmd: 'getInternalMessagingConfiguration'
    }
  }).then(response => response.data)
}

function hasExternalCommunicationRights () {
  const url = constants.BASE_URL + '/api/get_mess_has_ext_rights'
  return axios.get(url, {
    params: {
      cmd: 'hasUserExternalCommunicationRights'
    }
  }).then(response => response.data)
}

function getMailAccounts () {
  const url = constants.BASE_URL + '/api/get_mess_ext_accounts'
  return axios.get(url, {
    params: {
      cmd: 'getUserMailAccounts'
    }
  }).then(response => response.data)
}

function getAutoResponses () {
  const url = constants.BASE_URL + '/api/get_mess_auto_resp'
  return axios.get(url, {
    params: {
      cmd: 'getUserAutoResponse'
    }
  }).then(response => response.data)
}
