<template>
  <div>
    <div
      v-click-outside="closeDetails"
      class="details">
      <div class="main">
        <img
          :src="application.image"
          class="logo">

        <div class="name">
          <h5>
            {{ application.serviceName }}
          </h5>
          <input
            v-if="application.hasCustomUrl"
            :model="application.serviceUrl"
            :placeholder="$t('ApplicationManager.AMApplicationDetails.customUrlPlaceholder')"
            type="url">
        </div>
      </div>

      <div class="broadcast">
        <p
          v-t="'ApplicationManager.AMApplicationDetails.broadcastLabel'"
          v-if="application.isAvailable"/>
        <p
          v-t="'ApplicationManager.AMApplicationDetails.noBroadcastLabel'"
          v-else/>
        <ul
          v-if="application.isAvailable"
          class="list-rules">
          <li
            v-for="(rule, index) in application.rules"
            :key="index">
            <i class="fa fa-circle"/>
            <p> {{ rule }}</p>
          </li>
        </ul>
      </div>

      <div v-if="hasExport">
        <p v-t="'ApplicationManager.AMApplicationDetails.exportLabel'"/>
        <div class="app-export-buttons">
          <NeroButton
            v-if="application.exportStudent"
            :label="$t('ApplicationManager.AMApplicationDetails.parentsExportButton')"
            @click="exportUserList('parent')"/>

          <NeroButton
            v-if="application.exportStudent"
            :label="$t('ApplicationManager.AMApplicationDetails.studentsExportButton')"
            @click="exportUserList('eleve')"/>

          <NeroButton
            v-if="application.exportTeacher"
            :label="$t('ApplicationManager.AMApplicationDetails.teachersExportButton')"
            @click="exportUserList('prof')"/>
        </div>
      </div>

      <NeroButton
        :title="$t('ApplicationManager.AMApplicationDetails.closeButtonTooltip')"
        type="circle"
        icon="fa fa-times"
        @click="closeDetails"/>
      <NeroButton
        :title="$t('ApplicationManager.AMApplicationDetails.broadcastButtonTooltip')"
        type="circle"
        icon="fa fa-wifi"/>
      <NeroButton
        v-if="isAdministrator"
        :title="$t('ApplicationManager.AMApplicationDetails.editButtonTooltip')"
        type="circle"
        icon="fa fa-pencil-alt"
        @click="toggleEditionModal"/>
      <NeroButton
        :title="$t('ApplicationManager.AMApplicationDetails.configurationButtonTooltip')"
        type="circle"
        icon="fa fa-cog"
        @click="toggleBroadcastModal"/>
      <NeroButton
        v-if="application.hasCustomUrl"
        :title="$t('ApplicationManager.AMApplicationDetails.guideButtonTooltip')"
        type="circle"
        icon="fa fa-book"/>
      <NeroButton
        v-if="application.hasCustomUrl"
        :title="$t('ApplicationManager.AMApplicationDetails.saveButtonTooltip')"
        type="circle"
        icon="fa fa-save"/>
      <NeroButton
        v-if="isAdministrator"
        :title="$t('ApplicationManager.AMApplicationDetails.deleteButtonTooltip')"
        type="circle"
        cls="cancel"
        icon="fa fa-trash"/>
    </div>
  </div>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import clickoutside from '@/directives/clickoutside'

export default {
  name: 'AMApplicationDetails',
  components: {
    NeroButton
  },
  directives: {
    'click-outside': clickoutside
  },
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasExport () {
      return (this.application.exportParent ||
        this.application.exportStudent ||
        this.application.exportTeacher)
    },
    isAdministrator () {
      return this.$store.state.currentUser.isAdministrator
    }
  },
  created () {
    // TODO fetch rules
    this.$store.dispatch('getApplicationBroadcastScope')
    this.$store.dispatch('updateApplication', this.application)
  },
  methods: {
    closeDetails () {
      this.$emit('closeDetails')
    },
    toggleBroadcastModal () {
      this.$store.dispatch('openBroadcastModal')
    },
    toggleEditionModal () {
      this.$store.dispatch('openEditionModal')
    },
    exportUserList (type) {
      // TODO
      console.log('launch export for ' + type)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.details {
  width: 345px;
  height: 246px;
  position: absolute;
  background: #f1f1f1;
  z-index: 3;
  border-radius: $border-radius;
  @extend %nero-shadow;
}

.logo {
  width: 70px;
  height: 70px;
  display: inline-block;
}

.main {
  display: inline-block;
  width: 89%;
  padding: 10px;
}

.name {
  margin-top: 6px;
  display: inline-block;
  vertical-align: top;
  width: 64%;

  h5 {
    margin: 0;
  }
}
</style>
