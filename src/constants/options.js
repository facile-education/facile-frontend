import i18n from '@/i18n.js'
import { icons } from '@/constants/icons'

const documentSpaceOptions = [
  {
    name: 'new',
    title: i18n.global.t('Commons.new'),
    icon: icons.options.new,
    position: 0,
    hasSeparator: true,
    subMenu: [
      {
        name: 'newFolder',
        title: i18n.global.t('Documents.options.newFolder'),
        icon: icons.folder,
        position: 0,
        hasSeparator: true
      },
      {
        name: 'newODT',
        title: i18n.global.t('Documents.options.newODT'),
        icon: icons.extensions.odt,
        position: 1,
        hasSeparator: false
      },
      {
        name: 'newODS',
        title: i18n.global.t('Documents.options.newODS'),
        icon: icons.extensions.ods,
        position: 1,
        hasSeparator: false
      },
      {
        name: 'newODP',
        title: i18n.global.t('Documents.options.newODP'),
        icon: icons.extensions.odp,
        position: 1,
        hasSeparator: false
      },
      {
        name: 'newGeogebra',
        title: i18n.global.t('Documents.options.newGeogebra'),
        icon: icons.extensions.ggb,
        position: 0,
        hasSeparator: false
      },
      {
        name: 'newMindMap',
        title: i18n.global.t('Documents.options.newMindMap'),
        icon: icons.extensions.mind,
        position: 1,
        hasSeparator: false
      },
      {
        name: 'newScratch',
        title: i18n.global.t('Documents.options.newScratch'),
        icon: icons.extensions.sb3,
        position: 2,
        hasSeparator: false
      },
      {
        name: 'newAudio',
        title: i18n.global.t('Documents.options.newAudio'),
        icon: icons.extensions.mp3,
        position: 3,
        hasSeparator: false
      },
      {
        name: 'newHTML',
        title: i18n.global.t('Documents.options.newHTML'),
        icon: icons.extensions.html,
        position: 4,
        hasSeparator: false
      }
    ]
  },
  {
    name: 'import',
    title: i18n.global.t('Documents.options.import'),
    icon: icons.options.upload,
    position: 1,
    hasSeparator: false,
    subMenu: [
      {
        name: 'uploadFolder',
        title: i18n.global.t('Documents.options.uploadFolder'),
        icon: icons.folder,
        position: 0,
        hasSeparator: true
      },
      {
        name: 'uploadFiles',
        title: i18n.global.t('Documents.options.uploadFiles'),
        icon: icons.file,
        position: 1,
        hasSeparator: false
      }
    ]
  }
]

const fileOptions = [
  {
    name: 'rename',
    title: i18n.global.t('Documents.options.rename'),
    icon: icons.options.rename,
    position: 0,
    hasSeparator: true
  },
  {
    name: 'duplicate',
    title: i18n.global.t('Documents.options.duplicate'),
    icon: icons.options.duplicate,
    position: 1,
    hasSeparator: true
  },
  {
    name: 'move',
    title: i18n.global.t('Documents.options.move'),
    icon: icons.options.move,
    position: 2,
    hasSeparator: true
  },
  {
    name: 'download',
    title: i18n.global.t('Documents.options.download'),
    icon: icons.options.download,
    position: 3,
    hasSeparator: true
  },
  {
    name: 'delete',
    title: i18n.global.t('Documents.options.delete'),
    icon: icons.options.delete,
    position: 4,
    hasSeparator: true
  },
  {
    name: 'copyWebdavUrl',
    title: i18n.global.t('Documents.options.copyWebdavUrl'),
    icon: icons.options.copyWebdavUrl,
    position: 5,
    hasSeparator: true
  },
  {
    name: 'details',
    title: i18n.global.t('Documents.options.details'),
    icon: icons.options.details,
    position: 6,
    hasSeparator: true
  },
  {
    name: 'managePermissions',
    title: i18n.global.t('Documents.options.managePermissions'),
    icon: icons.options.permissions,
    position: 7,
    hasSeparator: false
  }
]

const folderOptions = [
  {
    name: 'rename',
    title: i18n.global.t('Documents.options.rename'),
    icon: icons.options.rename,
    position: 0,
    hasSeparator: true
  },
  {
    name: 'duplicate',
    title: i18n.global.t('Documents.options.duplicate'),
    icon: icons.options.duplicate,
    position: 1,
    hasSeparator: true
  },
  {
    name: 'move',
    title: i18n.global.t('Documents.options.move'),
    icon: icons.options.move,
    position: 2,
    hasSeparator: true
  },
  {
    name: 'download',
    title: i18n.global.t('Documents.options.download'),
    icon: icons.options.download,
    position: 3,
    hasSeparator: true
  },
  {
    name: 'delete',
    title: i18n.global.t('Documents.options.delete'),
    icon: icons.options.delete,
    position: 4,
    hasSeparator: true
  },
  {
    name: 'copyWebdavUrl',
    title: i18n.global.t('Documents.options.copyWebdavUrl'),
    icon: icons.options.copyWebdavUrl,
    position: 5,
    hasSeparator: true
  },
  {
    name: 'details',
    title: i18n.global.t('Documents.options.details'),
    icon: icons.options.details,
    position: 6,
    hasSeparator: true
  },
  {
    name: 'managePermissions',
    title: i18n.global.t('Documents.options.managePermissions'),
    icon: icons.options.permissions,
    position: 7,
    hasSeparator: false
  }
]

const currentFolderOptions = [
  {
    name: 'rename',
    title: i18n.global.t('Documents.options.rename'),
    icon: icons.options.rename,
    position: 0,
    hasSeparator: true
  },
  {
    name: 'download',
    title: i18n.global.t('Documents.options.download'),
    icon: icons.options.download,
    position: 3,
    hasSeparator: true
  },
  {
    name: 'copyWebdavUrl',
    title: i18n.global.t('Documents.options.copyWebdavUrl'),
    icon: icons.options.copyWebdavUrl,
    position: 5,
    hasSeparator: true
  }
]

const groupOptions = []

export {
  documentSpaceOptions,
  fileOptions,
  folderOptions,
  groupOptions,
  currentFolderOptions
}
