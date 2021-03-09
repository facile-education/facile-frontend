// import PentilaUtils from 'pentila-utils'

// const USER_PREFIX = '/user/' + PentilaUtils.Cookies.getCookie('SCREEN_NAME')
// const DEFAULT_APP = '/nero'

const JSON_WS_URL = '/api/secure/jsonws'

// TODO get URL / applications in a dynamic way / understand why dashboard (and others) cannot be called with default app
// const APPLICATION_MANAGER_URL = '/group/4133613/gestion-applications?p_p_id=gestionApps_WAR_gestionApplicationsportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_gestionApps_WAR_gestionApplicationsportlet'
const DASHBOARD_MANAGER_URL = '/group/4445511/admin-tableau-de-bord?p_p_id=gestionDashboard_WAR_gestionDashboardportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_gestionDashboard_WAR_gestionDashboardportlet'
const COMMUNICATION_MANAGER_URL = '/group/3726289/administrationtools?p_p_id=administrationTools_WAR_administrationToolsportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_administrationTools_WAR_administrationToolsportlet'

// PP Urls
const APPLICATION_MANAGER_URL = '/group/79867532/gestionapplications?p_p_id=gestionApps_WAR_gestionApplicationsportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_gestionApps_WAR_gestionApplicationsportlet'

// TODO remove NODE server when useless
const BASE_URL = 'http://193.48.120.116:3333'

export default {
  APPLICATION_MANAGER_URL,
  BASE_URL,
  COMMUNICATION_MANAGER_URL,
  DASHBOARD_MANAGER_URL,
  JSON_WS_URL
}
