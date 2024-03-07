import dayjs from 'dayjs'
import fr from 'dayjs/locale/fr'

import { isLocaleFR } from '@/constants/appConstants.js'

const changeDayJsLocale = (localeString) => {
  console.log('changeDayJsLocale ' + localeString)

  if (isLocaleFR(localeString)) {
    console.log('set fr locale')
    dayjs.locale(fr)
  } else {
    console.log('set en locale')
    dayjs.locale('en')
  }
}

export {
  changeDayJsLocale
}
