import { getFullName } from '@utils/commons.util'

const CONTACT_TYPE_USER = 1
const CONTACT_TYPE_ORG = 2
const CONTACT_TYPE_GROUP = 3

const addContactFieldsToContactList = (contactList) => {
  // Because contacts fields have not a normalized "text" attribute (TODO: put this logic in backend ?)
  contactList.forEach((contact) => {
    switch (contact.type) {
      case CONTACT_TYPE_USER:
        contact.text = getFullName(contact)
        if (contact.roles) {
          contact.text += ' (' + contact.roles
          if (contact.subjects) {
            contact.text += ' - ' + contact.subjects
          }
          if (contact.classes) {
            contact.text += ' de ' + contact.classes
          }
          contact.text += ')'
        }
        break
      case CONTACT_TYPE_ORG:
        contact.text = contact.name
        break
      case CONTACT_TYPE_GROUP:
        contact.text = contact.name
        break
      default:
        console.error('Unknown contact type: ' + contact.type)
    }
  })
}

export {
  addContactFieldsToContactList
}
