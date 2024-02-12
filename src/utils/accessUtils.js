import Types from '@/constants/accessConstants'

function sortAccesses (categoryList) {
  // First: sort categories
  categoryList.sort((a, b) => { return a.position - b.position })
  // Then, sort accesses in categories
  categoryList.forEach(category => {
    category.accessList.sort((a, b) => { return a.position - b.position })
  })

  return categoryList
}

function getThumbnailUrl (access, store) {
  if (access !== undefined && access.thumbnailUrl !== '') {
    return access.thumbnailUrl + '&p_auth=' + store.state.user.pauth
  } else if (access !== undefined) {
    // Pick default image depending on accesse's type
    switch (access.type) {
      case Types.TYPE_EXTERNAL_URL:
        return require('@assets/icons/documents/link.svg')
      case Types.TYPE_COLLABORATIVE_FOLDER:
        return require('@assets/icons/documents/folder.svg')
      case Types.TYPE_SHARED_FILE:
        return require('@assets/icons/documents/file.svg')
      default:
        console.error('Unknown type: ' + access.type)
        break
    }
    return ''
  }
}

export {
  sortAccesses,
  getThumbnailUrl
}
