<template>
  <div class="external-resource">
    <div v-if="serviceSchoolUrls.length == 0">
      <img
        class="icon"
        src="../assets/images/ExternalResource/icon-external-service.png">
      <h3 v-t="{path: 'ExternalResource.noConfigLabel', args: {resourceName:serviceName}}"/>
      <i18n
        path="ExternalResource.contactLabel"
        tag="p"
        class="content">
        <a
          v-t="'ExternalResource.clickHereLabel'"
          place="link"
          class="link"
          @click="onClickShowIncidents()"/>
      </i18n>
    </div>

    <div v-else>
      <div v-if="serviceSchoolUrls.length > 1">
        <form name="selectUrl">
          <!-- TODO dropdown user schools - select
            class="dropdown"
            name="serviceSchoolUrls"
            ng-model="ConnectorCtrl.selectedUrl"
            @change="onChangeUrl()">
            <option
              ng-repeat="url in ConnectorCtrl.serviceSchoolUrls"
              value="{{url.serviceUrl}}">
              {{ serviceName }} - {{ url.schoolName }}
            </option>
          </select -->
        </form>
        <br>
      </div>

      <div v-if="!isHttps">
        <img
          class="icon"
          src="../assets/images/ExternalResource/icon-external-service.png">
        <h3 v-html="$t('ExternalResource.newTabLabel', {resourceName: serviceName})"/>
        <i18n
          path="ExternalResource.openAgainLabel"
          tag="p"
          class="description">
          <a
            v-t="'ExternalResource.clickHereLabel'"
            place="link"
            class="link"
            @click="openInNewTab"/>
        </i18n>
        <div class="nero-separator"/>
        <p
          class="content"
          v-html="$t('ExternalResource.popupIssueLabel')"/>
      </div>

      <div v-else>
        <i18n
          path="ExternalResource.openInTabLabel"
          tag="p"
          class="description">
          <a
            v-t="'ExternalResource.clickHereLabel'"
            place="link"
            class="link"
            @click="openInNewTab"/>
        </i18n>
        <iframe
          :src="selectedUrl"
          class="frame"/>
      </div>

    </div>
  </div>
</template>

<script>
// TODO check fa chevron down + toggle incident window + dropdown + get info from service
export default {
  export: 'ExternalResource',
  props: {
    resourceKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      resourceTab: undefined,
      serviceSchoolUrls: ['Pronote'],
      serviceName: 'Pronote',
      // selectedUrl: 'https://nero.l-educdenormandie.fr/'
      selectedUrl: 'http://nero.l-educdenormandie.fr/'
    }
  },
  computed: {
    isHttps () {
      if (this.forceNewTab) { // Force new tab
        return false
      } else if (this.selectedUrl.lastIndexOf('https', 0) !== 0) { // Check if url start with https
        return false
      } else if (this.selectedUrl.indexOf('login?service=') !== -1) { // Check if service has https redirection
        return (this.selectedUrl.indexOf('service=https') !== -1)
      } else {
        return true
      }
    }
  },
  methods: {
    openInNewTab () {
      if (this.resourceTab === undefined || this.resourceTab.closed) {
        this.resourceTab = window.open(this.selectedUrl, '_blank')
      } else {
        this.resourceTab.location = this.selectedUrl
      }
    },
    loadConfig () {
      /*
      config.params = {
        cmd: "loadConnectorConfig",
        serviceKey: this.resourceKey
      }
      return : {
        "serviceKey": "pronote",
        "serviceSchoolUrls": [{
          "schoolName":"CLG-CAMILLE SAINT-SAENS-ac-ROUEN",
          "serviceUrl":"https://0760093n.index-education.net/pronote/"
        }, {
          "schoolName":"LG-CAMILLE SAINT-SAENS-ac-ROUEN",
          "serviceUrl":"https://0760093n.index-education.net/pronote/"
        }],
        "success":true,
        "serviceName":"Pronote"}
      */
    },
    onClickShowIncidents () {
      // TODO code
      // this.$store.dispatch('openIncidentModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.external-resource {
  height: 100%;
  max-width: 100%;
  padding: 5px;
  overflow: auto;
  text-align: center;
}

.icon {
  max-width: 60%;
}

.link {
  color: #3083b7;
  text-decoration: underline;
  cursor: pointer;
}

.content {
  width: 510px;
  max-width: 100%;
  margin: auto;
}

.frame {
  width: 100%;
  height: 85vh;
  overflow: auto;
  border: 0;
}
</style>
