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

export {
  toPascalCase,
  mergeContextMenus,
  removeMenuOptionIfExist,
  formatSize
}
