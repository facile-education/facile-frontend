import dayjs from 'dayjs'

function toPascalCase (string) {
  return string.replace(/(\w)(\w*)/g,
    (g0, g1, g2) => { return g1.toUpperCase() + g2.toLowerCase() })
}

function mergeContextMenus (listContextMenu) {
  if (listContextMenu.length === 0) return []
  const CMResult = listContextMenu[0]
  for (let i = 1; i < listContextMenu.length; ++i) {
    for (let j = 0; j < CMResult.length; ++j) {
      let find = false
      for (let k = 0; k < listContextMenu[i].length; ++k) {
        if (CMResult[j].name === listContextMenu[i][k].name) {
          find = true
        }
      }
      if (!find) {
        CMResult.splice(j, 1)
        j--
      }
    }
  }
  return CMResult
}

function removeMenuOptionIfExist (menuOptions, name) {
  let indexOption = -1
  for (let i = 0; i < menuOptions.length; ++i) {
    if (menuOptions[i].name === name) {
      indexOption = i
      break
    }
  }
  if (indexOption !== -1) {
    // Delete the option
    menuOptions.splice(indexOption, 1)
    // Reindex the position property
    for (let i = indexOption; i < menuOptions.length; ++i) {
      menuOptions[i].position -= 1
    }
  }
}

function formatSize (size) {
  if (Math.trunc(size / 1024) === 0) {
    return size + ' o'
  } else if ((Math.trunc(size / (1024 * 1024)) === 0)) {
    return Math.trunc(size / 1024) + ' ko'
  } else if ((Math.trunc(size / (1024 * 1024 * 1024)) === 0)) {
    return Math.trunc(size / (1024 * 1024)) + ' Mo'
  } else {
    return Math.trunc(size / (1024 * 1024 * 1024)) + ' Go'
  }
}

function fileNameWithoutExtension (name) {
  if (name.split('.').length === 1) {
    return name
  }
  return name.split('.').slice(0, -1).join('.')
}

/**
 * Compare entities on fields 'name', 'size', 'lastModifiedDate', 'creationDate', 'date' or 'deleteDate'
 **/
function compare (sortType, isOrderAsc) {
  return function (a, b) {
    if (sortType === 'name') {
      if (isOrderAsc) {
        return (fileNameWithoutExtension(a[sortType])).localeCompare(fileNameWithoutExtension(b[sortType])) // lexicographical sort (string sort)
      } else {
        return (fileNameWithoutExtension(b[sortType])).localeCompare(fileNameWithoutExtension(a[sortType]))
      }
    } else if (sortType === 'size') {
      if (isOrderAsc) {
        return a[sortType] - b[sortType]
      } else {
        return b[sortType] - a[sortType]
      }
    } else if (sortType === 'lastModifiedDate' ||
      sortType === 'creationDate' ||
      sortType === 'date' ||
      sortType === 'deleteDate') {
      // return (a[sortType]).localeCompare(b[sortType]) // works because date are at format YYYY-MM-DD HH:mm:ss
      const dateA = dayjs(a[sortType], 'YYYY-MM-DD HH:mm:ss') // note that lastModifiedDate might be is sending date
      const dateB = dayjs(b[sortType], 'YYYY-MM-DD HH:mm:ss')
      if (isOrderAsc) {
        return dateA.diff(dateB)
      } else {
        return dateB.diff(dateA)
      }
    } else {
      console.error('error: trying to compare ', a[sortType], ' and ', b[sortType],
        'with type ', sortType)
    }
  }
}

export {
  toPascalCase,
  mergeContextMenus,
  removeMenuOptionIfExist,
  formatSize,
  fileNameWithoutExtension,
  compare
}
