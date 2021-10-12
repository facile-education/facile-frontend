import i18n from '@/i18n.js'
import { icons } from '@/constants/icons'

const documentSpaceOptions = [
  {
    name: 'newFolder',
    title: i18n.global.t('Documents.options.newFolder'),
    icon: icons.options.newFolder,
    position: 1,
    hasSeparator: true
  },
  {
    name: 'import',
    title: i18n.global.t('Documents.options.import'),
    icon: icons.options.import,
    position: 2,
    hasSeparator: false
  }
  // TODO add create files options
]

const fileOptions = [
  {
    name: 'rename',
    title: i18n.global.t('Documents.options.rename'),
    icon: icons.options.rename,
    position: 3,
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
    position: 0,
    hasSeparator: true
  },
  {
    name: 'download',
    title: i18n.global.t('Documents.options.download'),
    icon: icons.options.download,
    position: 5,
    hasSeparator: true
  },
  {
    name: 'delete',
    title: i18n.global.t('Documents.options.delete'),
    icon: icons.options.delete,
    position: 4,
    hasSeparator: false
  }
]

const folderOptions = [
  {
    name: 'rename',
    title: i18n.global.t('Documents.options.rename'),
    icon: icons.options.rename,
    position: 2,
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
    position: 0,
    hasSeparator: true
  },
  {
    name: 'download',
    title: i18n.global.t('Documents.options.download'),
    icon: icons.options.download,
    position: 5,
    hasSeparator: true
  },
  {
    name: 'delete',
    title: i18n.global.t('Documents.options.delete'),
    icon: icons.options.delete,
    position: 3,
    hasSeparator: false
  }
]

export {
  documentSpaceOptions,
  fileOptions,
  folderOptions
}
