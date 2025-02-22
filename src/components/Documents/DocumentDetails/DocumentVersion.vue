<template>
  <div
    class="version"
    data-test="file-version"
  >
    <div class="header">
      <h4>{{ version.name }}</h4>
      <div
        v-if="version.viewCount !== undefined || version.downloadCount !== undefined"
        class="group-data"
      >
        <div
          class="view-count"
          :title="$t('Documents.documentFields.viewCount')"
        >
          <div>{{ version.viewCount }}</div>
          <img
            class="icon"
            src="@assets/icons/eye.svg"
            alt=""
          >
        </div>

        <div
          class="download-count"
          :title="$t('Documents.documentFields.downloadCount')"
        >
          <div>{{ version.downloadCount }}</div>
          <CustomIcon
            class="icon"
            icon-name="icon-download"
          />
        </div>
      </div>
      <div class="date">
        {{ formattedDate }}
      </div>
    </div>

    <span
      v-if="version.isCurrentVersion"
      v-t="('Documents.documentDetails.lastVersion')"
      class="current-version"
    />

    <div
      v-else
      class="options"
    >
      <WeprodeButton
        class="bottom-option"
        data-test="view-button"
        @click="viewVersion"
      >
        <img
          src="../../../assets/icons/eye.svg"
          alt=""
        >
        {{ $t('Documents.documentDetails.viewVersion') }}
      </WeprodeButton>
      <WeprodeButton
        v-if="document.permissions.UPDATE"
        v-t="('Documents.documentDetails.restoreVersion')"
        class="bottom-option"
        data-test="restore-button"
        @click="restoreVersion"
      />
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import versionsService from '@/api/documents/version.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'

export default {
  name: 'DocumentVersion',
  components: { CustomIcon, WeprodeButton },
  props: {
    document: {
      type: Object,
      required: true
    },
    version: {
      type: Object,
      required: true
    }
  },
  emits: ['refreshVersions', 'openVersion'],
  computed: {
    formattedDate () {
      return dayjs(this.version.date, DATE_EXCHANGE_FORMAT).calendar()
    }
  },
  methods: {
    restoreVersion () {
      this.$store.dispatch('currentActions/addAction', { name: 'restoreVersion' })
      versionsService.restoreVersion(this.version.id).then((data) => {
        this.$store.dispatch('currentActions/removeAction', { name: 'restoreVersion' })
        if (data.success) {
          // Update the version list
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Documents.DocumentVersion.restoredVersion'), type: 'success' })
          this.$emit('refreshVersions')
        } else {
          console.error('Error when restoring version', this.version.version)
        }
      }, (err) => {
        console.error(err)
        this.$store.dispatch('currentActions/removeAction', { name: 'restoreVersion' })
      })
    },
    // Open the version in readOnly mode
    viewVersion () {
      this.$emit('openVersion', this.version.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.version{
  background-color: white;
  border-top: 1px solid $color-border;
  min-height: 80px;

  .header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4{
      margin-left: 10px;
      font-size: 20px;
    }

    .group-data {
      width: 50px;
      display: flex;
      justify-content: space-between;

      .view-count, .download-count {
        display: flex;
        margin: 0 5px;
        .icon {
          margin-left: 5px;
        }
        .icon-download {
          font-size: 1.3rem;
        }

      }
    }

    .date{
      font-size: 14px;
      color: #646464;
      padding-right: 10px;
    }
  }

  .current-version{
    font-size: 14px;
    color: #646464;
    margin-left: 10px;
  }

  .options {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;

    .bottom-options {
      text-align: right;
      padding-right: 5px;
    }

    .bottom-option {
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
      font-weight: 500;
      height: 25px;
      display: flex;
      align-items: center;

      img {
        margin-right: 5px;
      }
    }
  }

}

</style>
