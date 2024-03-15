import dayjs from 'dayjs'

import { locales as frontLocales } from '@/constants/appConstants.js'

const locales = {
  en: () => import('dayjs/locale/en'),
  fr: () => import('dayjs/locale/fr')
}

const calendar = {
  en: {
    sameDay: 'HH:mm',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY'
  },
  fr: {
    sameDay: 'HH:mm', // The same day ( 2:30 AM )
    nextDay: '[Demain]', // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
    lastDay: '[Hier]', // The day before ( Yesterday at 2:30 AM )
    lastWeek: 'dddd [dernier]', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'DD/MM/YYYY' // Everything else ( 7/10/2011 )
  }
}

const changeDayJsLocale = (localeString) => {
  let language = localeString
  language = getI18nFrontKey(localeString)
  if (!language) {
    language = 'en'
  }

  locales[language]().then(() => {
    dayjs.locale(language)
    dayjs.updateLocale(language, {
      calendar: calendar[language]
    })
  })
}

const getI18nFrontKey = (localeString) => {
  let formattedKey
  if (localeString.indexOf('-') !== -1) {
    formattedKey = localeString.substring(0, 2)
  } else {
    formattedKey = localeString
  }

  // Check is formattedKey is supported by the front
  const locale = frontLocales.find(locale => locale.frontId === formattedKey)

  return locale?.frontId
}

export {
  changeDayJsLocale,
  getI18nFrontKey
}
