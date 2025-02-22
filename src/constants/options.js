import { icons } from '@/constants/icons'

const documentSpaceOptions = [
  {
    name: 'new',
    i18nKey: 'Commons.new',
    icon: icons.options.new,
    position: 0,
    hasSeparator: false,
    subMenu: [
      {
        name: 'newFolder',
        i18nKey: 'Documents.options.newFolder',
        icon: icons.folder,
        position: 0,
        hasSeparator: true
      },
      {
        name: 'uploadFolder',
        i18nKey: 'Documents.options.uploadFolder',
        icon: icons.folder,
        position: 1,
        hasSeparator: false
      },
      {
        name: 'uploadFiles',
        i18nKey: 'Documents.options.uploadFiles',
        icon: icons.file,
        position: 2,
        hasSeparator: true
      },
      {
        name: 'newODT',
        i18nKey: 'Documents.options.newODT',
        icon: icons.extensions.odt,
        position: 3,
        hasSeparator: false
      },
      {
        name: 'newODS',
        i18nKey: 'Documents.options.newODS',
        icon: icons.extensions.ods,
        position: 4,
        hasSeparator: false
      },
      {
        name: 'newODP',
        i18nKey: 'Documents.options.newODP',
        icon: icons.extensions.odp,
        position: 5,
        hasSeparator: false
      },
      {
        name: 'newGeogebra',
        i18nKey: 'Documents.options.newGeogebra',
        icon: icons.extensions.ggb,
        position: 6,
        hasSeparator: false
      },
      {
        name: 'newMindMap',
        i18nKey: 'Documents.options.newMindMap',
        icon: icons.extensions.mind,
        position: 7,
        hasSeparator: false
      },
      {
        name: 'newScratch',
        i18nKey: 'Documents.options.newScratch',
        icon: icons.extensions.sb3,
        position: 8,
        hasSeparator: false
      },
      {
        name: 'newAudio',
        i18nKey: 'Documents.options.newAudio',
        icon: icons.extensions.mp3,
        position: 9,
        hasSeparator: false
      },
      {
        name: 'newHTML',
        i18nKey: 'Documents.options.newHTML',
        icon: icons.extensions.html,
        position: 10,
        hasSeparator: false
      }
    ]
  }
]

const mobileDocumentSpaceOptions = [
  {
    name: 'new',
    i18nKey: 'Commons.new',
    icon: icons.options.new,
    position: 0,
    hasSeparator: true,
    subMenu: [
      {
        name: 'newFolder',
        i18nKey: 'Documents.options.newFolder',
        icon: icons.folder,
        position: 0,
        hasSeparator: true
      },
      {
        name: 'uploadFiles',
        i18nKey: 'Documents.options.mobileUploadFiles',
        icon: icons.file,
        position: 1,
        hasSeparator: true
      },
      {
        name: 'newODT',
        i18nKey: 'Documents.options.newODT',
        icon: icons.extensions.odt,
        position: 2,
        hasSeparator: false
      },
      {
        name: 'newODS',
        i18nKey: 'Documents.options.newODS',
        icon: icons.extensions.ods,
        position: 3,
        hasSeparator: false
      },
      {
        name: 'newODP',
        i18nKey: 'Documents.options.newODP',
        icon: icons.extensions.odp,
        position: 4,
        hasSeparator: false
      },
      {
        name: 'newGeogebra',
        i18nKey: 'Documents.options.newGeogebra',
        icon: icons.extensions.ggb,
        position: 5,
        hasSeparator: false
      },
      {
        name: 'newMindMap',
        i18nKey: 'Documents.options.newMindMap',
        icon: icons.extensions.mind,
        position: 6,
        hasSeparator: false
      },
      {
        name: 'newScratch',
        i18nKey: 'Documents.options.newScratch',
        icon: icons.extensions.sb3,
        position: 7,
        hasSeparator: false
      },
      {
        name: 'newAudio',
        i18nKey: 'Documents.options.newAudio',
        icon: icons.extensions.mp3,
        position: 8,
        hasSeparator: false
      },
      {
        name: 'newHTML',
        i18nKey: 'Documents.options.newHTML',
        icon: icons.extensions.html,
        position: 9,
        hasSeparator: false
      }
    ]
  }
]

const fileOptions = documentSpaceOptions.concat([
  {
    name: 'open',
    i18nKey: 'Documents.options.open',
    icon: icons.options.openFile,
    position: 0,
    hasSeparator: true
  },
  {
    name: 'rename',
    i18nKey: 'Documents.options.rename',
    icon: icons.options.rename,
    position: 1,
    hasSeparator: true
  },
  {
    name: 'duplicate',
    i18nKey: 'Documents.options.duplicate',
    icon: icons.options.duplicate,
    position: 2,
    hasSeparator: true
  },
  {
    name: 'move',
    i18nKey: 'Documents.options.move',
    icon: icons.options.move,
    position: 3,
    hasSeparator: true
  },
  {
    name: 'download',
    i18nKey: 'Documents.options.download',
    icon: icons.options.download,
    position: 4,
    hasSeparator: true
  },
  {
    name: 'delete',
    i18nKey: 'Documents.options.delete',
    icon: icons.options.delete,
    position: 5,
    hasSeparator: true
  },
  {
    name: 'details',
    i18nKey: 'Documents.options.details',
    icon: icons.options.details,
    position: 7,
    hasSeparator: true
  },
  {
    name: 'managePermissions',
    i18nKey: 'Documents.options.managePermissions',
    icon: icons.options.permissions,
    position: 8,
    hasSeparator: true
  },
  {
    name: 'copyUrl',
    i18nKey: 'Documents.options.copyUrl',
    icon: icons.options.copyUrl,
    position: 9,
    hasSeparator: false
  }
])

const folderOptions = documentSpaceOptions.concat([
  {
    name: 'rename',
    i18nKey: 'Documents.options.rename',
    icon: icons.options.rename,
    position: 0,
    hasSeparator: true
  },
  {
    name: 'duplicate',
    i18nKey: 'Documents.options.duplicate',
    icon: icons.options.duplicate,
    position: 1,
    hasSeparator: true
  },
  {
    name: 'move',
    i18nKey: 'Documents.options.move',
    icon: icons.options.move,
    position: 2,
    hasSeparator: true
  },
  {
    name: 'delete',
    i18nKey: 'Documents.options.delete',
    icon: icons.options.delete,
    position: 4,
    hasSeparator: true
  },
  {
    name: 'details',
    i18nKey: 'Documents.options.details',
    icon: icons.options.details,
    position: 6,
    hasSeparator: true
  },
  {
    name: 'managePermissions',
    i18nKey: 'Documents.options.managePermissions',
    icon: icons.options.permissions,
    position: 7,
    hasSeparator: true
  },
  {
    name: 'copyUrl',
    i18nKey: 'Documents.options.copyUrl',
    icon: icons.options.copyUrl,
    position: 8,
    hasSeparator: false
  }
])

const currentFolderOptions = [
  {
    name: 'rename',
    i18nKey: 'Documents.options.rename',
    icon: icons.options.rename,
    position: 0,
    hasSeparator: true
  }
]

const groupOptions = documentSpaceOptions.concat([
  {
    name: 'managePermissions',
    i18nKey: 'Documents.options.managePermissions',
    icon: icons.options.permissions,
    position: 0,
    hasSeparator: true
  }
])

const spaceSelectionOptions = [
  {
    name: 'documents',
    i18nKey: 'Documents.options.documents',
    icon: '',
    position: 0,
    hasSeparator: true
  },
  {
    name: 'groups',
    i18nKey: 'Documents.options.groups',
    icon: '',
    position: 1,
    hasSeparator: true
  }
]

export {
  documentSpaceOptions,
  mobileDocumentSpaceOptions,
  spaceSelectionOptions,
  fileOptions,
  folderOptions,
  groupOptions,
  currentFolderOptions
}
