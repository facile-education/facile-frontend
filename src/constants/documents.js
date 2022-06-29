import i18n from '@/i18n'

const defaultFields = [
  {
    position: 0, // the field place from left to right.
    name: 'name',
    label: i18n.global.t('Documents.documentFields.name'),
    defaultDisplay: true,
    isPermanent: true,
    sort: {
      type: 'name'
    }
  },
  {
    position: 1,
    name: 'size',
    label: i18n.global.t('Documents.documentFields.size'),
    defaultDisplay: true,
    sort: {
      type: 'size'
    }
  },
  {
    position: 2,
    name: 'date',
    label: i18n.global.t('Documents.documentFields.lastModifiedDate'),
    defaultDisplay: true,
    sort: {
      type: 'lastModifiedDate'
    }
  }
]

export { defaultFields }
