import { getFullName } from '@utils/commons.util'

import { CONTACT_TYPE_GROUP, CONTACT_TYPE_ORG, CONTACT_TYPE_USER } from '@/constants/messagingConstants'

const addContactFieldsToContactList = (contactList, hasDetails = true) => {
  // Because contacts fields have not a normalized "text" attribute (TODO: put this logic in backend ?)
  contactList.forEach((contact) => {
    switch (contact.type) {
      case CONTACT_TYPE_USER:
        contact.id = contact.userId
        contact.text = getFullName(contact)
        if (contact.roles) {
          contact.text += ' (' + contact.roles
          if (contact.subjects && hasDetails) {
            contact.text += ' - ' + contact.subjects
          }
          if (contact.classes && hasDetails) {
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
