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
            :placeholder="$t('application-manager.application-details.custom-url-placeholder')"
            type="url">
        </div>
      </div>

      <div class="broadcast">
        <p
          v-t="'application-manager.application-details.broadcast-label'"
          v-if="application.isAvailable"/>
        <p
          v-t="'application-manager.application-details.no-broadcast-label'"
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
        <p v-t="'application-manager.application-details.export-label'"/>
        <div class="app-export-buttons">
          <NeroButton
            v-if="application.exportStudent"
            :label="$t('application-manager.application-details.parents-export-button')"
            @click="exportUserList('parent')"/>

          <NeroButton
            v-if="application.exportStudent"
            :label="$t('application-manager.application-details.students-export-button')"
            @click="exportUserList('eleve')"/>

          <NeroButton
            v-if="application.exportTeacher"
            :label="$t('application-manager.application-details.teachers-export-button')"
            @click="exportUserList('prof')"/>
        </div>
      </div>

      <NeroButton
        :title="$t('application-manager.application-details.close-button-tooltip')"
        type="circle"
        icon="fa fa-times"
        @click="closeDetails"/>
      <NeroButton
        :title="$t('application-manager.application-details.broadcast-button-tooltip')"
        type="circle"
        icon="fa fa-wifi"/>
      <NeroButton
        v-if="isAdministrator"
        :title="$t('application-manager.application-details.edit-button-tooltip')"
        type="circle"
        icon="fa fa-pencil-alt"
        @click="toggleEditionModal"/>
      <NeroButton
        :title="$t('application-manager.application-details.configuration-button-tooltip')"
        type="circle"
        icon="fa fa-cog"
        @click="toggleBroadcastModal"/>
      <NeroButton
        v-if="application.hasCustomUrl"
        :title="$t('application-manager.application-details.guide-button-tooltip')"
        type="circle"
        icon="fa fa-book"/>
      <NeroButton
        v-if="application.hasCustomUrl"
        :title="$t('application-manager.application-details.save-button-tooltip')"
        type="circle"
        icon="fa fa-save"/>
      <NeroButton
        v-if="isAdministrator"
        :title="$t('application-manager.application-details.delete-button-tooltip')"
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
  name: 'ApplicationDetails',
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
