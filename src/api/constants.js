// const BASE_URL = 'http://localhost:3333'
const USER_PREFIX = '/user/pentila'

const APPLICATION_MANAGER_URL = USER_PREFIX + '/gestion-applications?p_p_id=gestionApps_WAR_gestionApplicationsportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_gestionApps_WAR_gestionApplicationsportlet'
const DASHBOARD_MANAGER_URL = USER_PREFIX + '/admin-tableau-de-bord?p_p_id=gestionDashboard_WAR_gestionDashboardportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_gestionDashboard_WAR_gestionDashboardportlet'
const DASHBOARD_URL = USER_PREFIX + '/tableau-de-bord?p_p_id=dashboard_WAR_dashboardportlet&p_p_lifecycle=2&p_p_state=exclusive&p_p_mode=view&p_p_cacheability=cacheLevelPage&controlPanelCategory=portlet_dashboard_WAR_dashboardportlet'
const PREFERENCES_URL = USER_PREFIX + '/nero?p_p_id=preferenceHomePage_WAR_preferenceportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage'

// TODO remove NODE server when useless
const BASE_URL = 'http://193.48.120.116:3333'

export default {
  APPLICATION_MANAGER_URL,
  BASE_URL,
  DASHBOARD_MANAGER_URL,
  DASHBOARD_URL,
  PREFERENCES_URL
}
