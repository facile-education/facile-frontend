import axios from 'axios'
import constants from './constants'
import PentilaUtils from 'pentila-utils'

export default {
  addScreenShot,
  createMessage
}

const url = 'TODO'

function addScreenShot (image) {
  return axios.post(constants.JSON_WS_URL + url, PentilaUtils.URL.params({
    cmd: 'screenshot',
    img: image
  })).then(response => response.data)
}

function createMessage (isSuggestion, service, contentField, mail, attachFiles, isUsurpationAllowed) {
  return axios.get(constants.JSON_WS_URL + url, {
    params: {
      cmd: 'createMessage',
      isSuggestion: isSuggestion,
      service: service,
      content: contentField,
      mail: mail,
      attachFiles: attachFiles,
      isUsurpationAllowed: isUsurpationAllowed
    }
  }).then(response => response.data)
}
