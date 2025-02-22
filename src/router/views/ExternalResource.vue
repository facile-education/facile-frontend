<template>
  <ServicesWrapper
    :is-title-visible="false"
  >
    <div class="external-resource">
      <div v-if="serviceSchoolUrls.length == 0 && selectedUrl === undefined">
        <img
          class="icon"
          src="@/assets/images/icon-external-service.png"
          alt=""
        >
        <h3 v-t="{path: 'ExternalResource.noConfigLabel', args: {resourceName:serviceName}}" />
        <I18n
          keypath="ExternalResource.contactLabel"
          tag="p"
          class="content"
        >
          <a
            v-t="'ExternalResource.clickHereLabel'"
            place="link"
            class="link"
            @click="onClickShowIncidents()"
          />
        </I18n>
      </div>

      <div v-else>
        <div v-if="serviceSchoolUrls.length > 1">
          <WeprodeDropdown
            v-model="selectedSchool"
            :list="serviceSchoolUrls"
            display-field="schoolName"
            @update:model-value="selectSchool"
          />
        </div>

        <div v-if="!isHttps">
          <img
            class="icon"
            src="@assets/images/icon-external-service.png"
            alt=""
          >
          <h3>{{ $t('ExternalResource.newTabLabel', {resourceName: serviceName}) }}</h3>
          <I18n
            keypath="ExternalResource.openAgainLabel"
            tag="p"
            class="description"
          >
            <a
              v-t="'ExternalResource.clickHereLabel'"
              place="link"
              class="link"
              @click="openInNewTab"
            />
          </I18n>
          <p class="content">
            {{ $t('ExternalResource.popupIssueLabel') }}
          </p>
        </div>

        <div v-else>
          <I18n
            keypath="ExternalResource.openInTabLabel"
            tag="p"
            class="description"
          >
            <a
              v-t="'ExternalResource.clickHereLabel'"
              place="link"
              class="link"
              @click="openInNewTab"
            />
          </I18n>
          <iframe
            :src="selectedUrl"
            title="external resource"
            class="frame"
          />
        </div>
      </div>
    </div>
    <teleport to="body">
      <AssistanceModal
        v-if="isSupportModalDisplayed"
        @close="isSupportModalDisplayed = false"
      />
    </teleport>
  </ServicesWrapper>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Translation as I18n } from 'vue-i18n'

import { getResourceUrls } from '@/api/applicationManager.service'
import WeprodeDropdown from '@/components/Base/Weprode/WeprodeDropdown.vue'

import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

const AssistanceModal = defineAsyncComponent(() => import('@/components/Assistance/AssistanceModal'))

export default {
  export: 'ExternalResource',
  components: {
    AssistanceModal,
    I18n,
    WeprodeDropdown,
    ServicesWrapper
  },
  props: {
    resourceKey: {
      type: String,
      default: ''
    }
  },
  emits: ['update:layout'],
  data () {
    return {
      forceNewTab: false,
      isSupportModalDisplayed: false,
      resourceTab: undefined,
      serviceSchoolUrls: [],
      serviceName: this.$t('Menu.' + this.$route.name),
      selectedSchool: undefined,
      selectedUrl: ''
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
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  created () {
    // fetch service url(s)
    getResourceUrls(this.$route.meta.id).then((data) => {
      if (data.success) {
        console.log(data, typeof data.url)
        if (typeof data.url === 'string') {
          this.selectedUrl = data.url

          if (!this.isHttps) {
            this.openInNewTab()
          }
        } else {
          this.selectSchool(data.url[0])
          this.serviceSchoolUrls = data.url
        }
      } else {
        console.error('Error while getting resource urls', data)
      }
    })
  },
  methods: {
    openInNewTab () {
      if (this.resourceTab === undefined || this.resourceTab.closed) {
        this.resourceTab = window.open(this.selectedUrl, '_blank')
      } else {
        this.resourceTab.location = this.selectedUrl
      }
    },
    onClickShowIncidents () {
      this.isSupportModalDisplayed = true
    },
    selectSchool (school) {
      this.selectedUrl = school.url

      if (!this.isHttps) {
        this.openInNewTab()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

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
  color: $neutral-80;
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
