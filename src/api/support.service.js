import axios from 'axios'
import constants from './constants'
import NeroUtils from '@/utils/nero.utils'

export default {
  addScreenShot,
  createMessage
}

const url = constants.INFORMATION_MANAGER_URL

function addScreenShot (image) {
  return axios.post(url, NeroUtils.URL.params({
    cmd: 'screenshot',
    img: image
  })).then(response => response.data)
}

function createMessage (subjectField, contentField, mail, attachFiles, isUsurpationAllowed) {
  return axios.get(url, {
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
