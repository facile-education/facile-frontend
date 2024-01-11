const ODT_TYPE = 'odt'
const ODS_TYPE = 'ods'
const ODP_TYPE = 'odp'
const AUDIO_TYPE = 'mp3'
const HTML_TYPE = 'html'
const MINDMAP_TYPE = 'mind'
const GEOGEBRA_TYPE = 'ggb'
const SCRATCH_TYPE = 'sb3'

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

const JSON_WS_URL = BASE_API_URL + '/api/jsonws'

const LOGOUT_URL = BASE_API_URL + '/c/portal/logout'

const P_AUTH_URL = BASE_API_URL + '/p_auth_token.jsp'

const MOBILE_TOKEN_URL = BASE_API_URL + '/mobile_token.jsp'
const DATE_EXCHANGE_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'
const LOCAL_STORAGE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default {
  BASE_API_URL,
  LOGOUT_URL,
  JSON_WS_URL,
  P_AUTH_URL,
  ODT_TYPE,
  ODS_TYPE,
  ODP_TYPE,
  AUDIO_TYPE,
  HTML_TYPE,
  MINDMAP_TYPE,
  GEOGEBRA_TYPE,
  SCRATCH_TYPE,
  MOBILE_TOKEN_URL
}

export {
  DATE_EXCHANGE_FORMAT,
  LOCAL_STORAGE_DATE_FORMAT
}
