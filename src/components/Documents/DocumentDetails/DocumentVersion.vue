<template>
  <div class="version">
    <div class="header">
      <h4>{{ version.name }}</h4>
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
      <span
        v-t="('Documents.documentDetails.viewVersion')"
        class="bottom-option"
        data-test="view-button"
        @click="viewVersion"
      />
      <span
        v-t="('Documents.documentDetails.restoreVersion')"
        class="bottom-option"
        data-test="restore-button"
        @click="restoreVersion"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import versionsService from '@/api/documents/version.service'

export default {
  name: 'DocumentVersion',
  props: {
    version: {
      type: Object,
      required: true
    }
  },
  emits: ['refreshVersions'],
  computed: {
    formattedDate () {
      return dayjs(this.version.date, 'YYYY-MM-DD HH:mm:ss').calendar()
    }
  },
  methods: {
    restoreVersion () {
      versionsService.restoreVersion(this.version.id).then((data) => {
        if (data.success) {
          // Update the version list
          this.$emit('refreshVersions')
        } else {
          console.error('Error when restoring version', this.version.version)
        }
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
  margin-top: 7px;

  .header {
    height: 40px;
    display: flex;
    align-items: center;

    h4{
      padding-left: 5px;
    }

    .date{
      margin-left: auto;
      padding-right: 10px;
    }
  }

  .options {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: right;
    padding-right: 10px;

    .bottom-options{
      text-align: right;
      padding-right: 5px;
    }

    .bottom-option{
      color: blue;
      cursor: pointer;
      margin-left: 10px;
    }

    .current-version{
      font-style: italic;
    }
  }

}

</style>
