import dayjs from 'dayjs'

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
  if (localeString.indexOf('-') !== -1) {
    language = getI18nFrontKey(localeString)
  }

  locales[language]().then(() => {
    dayjs.locale(language)
    dayjs.updateLocale(language, {
      calendar: calendar[language]
    })
  })
}

const getI18nFrontKey = (localeString) => {
  return localeString.substring(0, 2)
}

export {
  changeDayJsLocale,
  getI18nFrontKey
}
