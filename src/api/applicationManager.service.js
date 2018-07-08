import axios from 'axios'
import constants from './constants'

export default {
  getApplicationBroadcastScope,
  getApplicationDefaultTargetRoles,
  getSchoolApplications,
  getSchoolClasses
}

function getApplicationBroadcastScope (schoolId, applicationId) {
  const url = constants.BASE_URL + '/api/get_application_broadcast_scope'
  return axios.get(url, {
    params: {
      cmd: 'getDiffusionPerimeter',
      etabId: schoolId,
      serviceId: applicationId
    }
  }).then(response => response.data)
}

function getApplicationDefaultTargetRoles (applicationId) {
  const url = constants.BASE_URL + '/api/get_application_default_roles'
  return axios.get(url, {
    params: {
      cmd: 'getDefaultRoles',
      serviceId: applicationId
    }
  }).then(response => response.data)
}

function getSchoolApplications (schoolId) {
  const url = constants.BASE_URL + '/api/get_schools_services'
  return axios.get(url, {
    params: {
      cmd: 'getSchoolServices',
      schoolId: schoolId
    }
  }).then(response => response.data)
}

function getSchoolClasses (schoolId) {
  const url = constants.BASE_URL + '/api/get_school_classes'
  return axios.get(url, {
    params: {
      cmd: 'getListClasses',
      etabId: schoolId
    }
  }).then(response => response.data)
}

/*
- update broadcast perimeter : POST {
        cmd: "modifyDiffusionPerimeter",
        diffusionPerimeter: JSON.stringify({
          etabId : etabId,
          serviceId : currentApp.serviceId,
          rules : currentApp.ruleIds
        }
- update application url : POST {
        cmd: "updateUrl",
        url: url,
        etabId: etabId,
        serviceId: serviceId
      }
- add application : POST {
        cmd: "addService",
        newService: JSON.stringify({
          serviceName: app.serviceName,  //obligatoire
          serviceKey: app.serviceKey,  //obligatoire
          portletId: app.portletId,  //obligatoire
          serviceCategory: app.serviceCategory, //obligatoire
          image: app.image,
          hasCustomUrl: app.hasCustomUrl,
          hasGlobalUrl: app.hasGlobalUrl,
          globalUrl: app.globalUrl,
          exportUser: app.exportUser,
          exportParent: app.exportParent,
          exportStudent: app.exportStudent,
          exportTeacher:app.exportTeacher,
          roles:app.rolesId,
          etabFilters:app.etabFilters
        }
- update application : POST {
        cmd: "modifyService",
        request: JSON.stringify({
          serviceId:  editedApp.serviceId,
          serviceName: editedApp.serviceName,  //obligatoire
          serviceKey: editedApp.serviceKey,  //obligatoire
          portletId: editedApp.portletId,  //obligatoire
          serviceCategory: editedApp.serviceCategory, //obligatoire
          image: editedApp.image,
          hasCustomUrl: editedApp.hasCustomUrl,
          hasGlobalUrl: editedApp.hasGlobalUrl,
          globalUrl: editedApp.globalUrl,
          exportUser: editedApp.exportUser,
          exportParent: editedApp.exportParent,
          exportStudent: editedApp.exportStudent,
          exportTeacher: editedApp.exportTeacher,
          roles: editedApp.rolesId,
          etabFilters: editedApp.etabFilters
        }
- delete application : {
  cmd: "deleteService",
  serviceId: serviceId,
}
- get categories (Add widget -> obsolete ?) : {
          cmd: "getListCategories"
      }
- export application users : {
          cmd: "exportFichier",
          etabId: etabId,
          userRole: userRole,
          serviceId: serviceId
      }
- update broadcast rules : POST {
          cmd: "updateDiffusion",
          diffusion: diffusion,
          etabId: etabId,
          serviceId: serviceId
      }
*/
