import axios from 'axios'
import constants from './constants'

export default {
  createMessage
}

function createMessage (subjectField, contentField, mail, attachFiles, isUsurpationAllowed) {
  return axios.get(constants.INFORMATION_MANAGER_URL, {
    params: {
      cmd: 'createMessage',
      subjectField: subjectField,
      contentField: contentField,
      mail: mail,
      attachFiles: attachFiles,
      isUsurpastionAllowed: isUsurpationAllowed
    }
  }).then(response => response.data)
}
