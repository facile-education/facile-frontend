<template>
  <div>
    <div class="widget">
      <div
        :title="widget.name"
        :class="{'theme-background-color top': hasSmallDisplay, 'left': !hasSmallDisplay}"
        class="title">
        <h5>{{ widget.name }}</h5>
      </div>

      <div class="content">
        <div
          :class="{'full-width': !displayConfigButton}"
          class="description">
          <p v-t="{path: 'DashboardManager.DMWidgetItem.typeLabel', args: {type: widget.type}}"/>

          <p
            v-t="{path: 'DashboardManager.DMWidgetItem.broadcastedLabel', args: {profiles: broadcastedRoleListLabel}}"
            v-if="broadcastedRoleList.length > 0"
            :title="broadcastedRoleListLabel"/>
          <p
            v-t="'DashboardManager.DMWidgetItem.notBroadcastedLabel'"
            v-else/>

          <p
            v-t="{path: 'DashboardManager.DMWidgetItem.createdLabel', args: {date: formattedDate, creator: widget.author}}"
            v-if="isWidgetInstance"/>
          <p
            v-t="'DashboardManager.DMWidgetItem.personnelWidgetLabel'"
            v-if="isWidgetPersonnel"/>
        </div>

        <div
          v-if="displayConfigButton"
          class="actions">
          <NeroButton
            :label="hasSmallDisplay ? '' : $t('DashboardManager.DMWidgetItem.editButtonLabel')"
            :icon="hasSmallDisplay ? 'fa fa-cog' : ''"
            @click="onEditWidget"/>
          <NeroButton
            :label="hasSmallDisplay ? '' : $t('DashboardManager.DMWidgetItem.removeButtonLabel')"
            :icon="hasSmallDisplay ? 'fa fa-trash' : ''"
            cls="cancel"
            @click="onRemoveWidget"/>
        </div>
      </div>
    </div>
    <hr
      v-if="displaySeparator"
      class="nero-separator">
  </div>
</template>

<script>
import moment from 'moment'
import NeroButton from '@/components/NeroButton'

export default {
  name: 'DMWidgetItem',
  components: {
    NeroButton
  },
  props: {
    widget: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedDate () {
      // TODO use utils
      return moment(this.widget.creationDate, 'YYYY-MM-DD').format('L')
    },
    broadcastedRoleList () {
      return this.widget.config.roles.filter(function (item) {
        return item.isBroadcasted
      })
    },
    broadcastedRoleListLabel () {
      var roleNameList = []
      for (var idx = 0; idx < this.broadcastedRoleList.length; ++idx) {
        roleNameList.push(this.broadcastedRoleList[idx].roleLabel)
      }
      return roleNameList.join(', ')
    },
    displayConfigButton () {
      return (
        (this.isSchoolInstance && this.$store.state.currentUser.isLocalAdmin) ||
        (this.isENTAdminInstance && this.$store.state.currentUser.isENTAdmin) ||
        this.$store.state.currentUser.isAdministrator)
    },
    displaySeparator () {
      var widgetList = this.$store.state.dashboardManager.widgetList
      if (this.index < (widgetList.length - 1)) {
        if ((this.isSchoolInstance && this.$store.state.currentUser.isLocalAdmin) ||
          (this.isENTAdminInstance && this.$store.state.currentUser.isENTAdmin)) {
          if (this.widget.scope !== widgetList[this.index + 1].scope) {
            return true
          }
        }
      }
      return false
    },
    isENTAdminInstance () {
      return this.widget.scope === this.$store.state.dashboardManager.scopeList['ENT_ADMIN_INSTANCE']
    },
    isSchoolInstance () {
      return this.widget.scope === this.$store.state.dashboardManager.scopeList['SCHOOL_INSTANCE']
    },
    isWidgetInstance () {
      return (this.isSchoolInstance || this.isENTAdminInstance)
    },
    isWidgetPersonnel () {
      return (this.widget.scope === this.$store.state.dashboardManager.scopeList['USER'] ||
        this.widget.scope === this.$store.state.dashboardManager.scopeList['USER_SCHOOL'])
    },
    hasSmallDisplay () {
      return (this.$device.phone || (this.$device.tablet && this.$store.state.nero.menuExpanded))
    }
  },
  methods: {
    onEditWidget () {
      this.$store.dispatch('dashboardManager/openEditionModal', this.widget)
    },
    onRemoveWidget () {
      var confirmModalParams = {
        buttonLabel: this.$t('DashboardManager.DMWidgetItem.DeleteConfirmModal.buttonLabel'),
        message: this.$t('DashboardManager.DMWidgetItem.DeleteConfirmModal.message'),
        onConfirm: this.removeWidget,
        title: this.$t('DashboardManager.DMWidgetItem.DeleteConfirmModal.title')
      }
      this.$store.dispatch('nero/updateAndShowConfirmModal', confirmModalParams)
    },
    removeWidget () {
      console.log('Confirm delete : ' + this.widget.name)
      this.$store.dispatch('dashboardManager/deleteWidget', this.widget)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';
$buttons-panel-width: 80px;

.nero-small {
  $small-buttons-panel-width: 40px;

  .widget {
    height: auto;
  }

  .content {
    padding: 5px 8px;
    width: 100%;
  }

  .description {
    width: calc(100% - #{$small-buttons-panel-width});
  }

  .actions {
    width: $small-buttons-panel-width;
  }
}

.widget {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 0;
  height: 85px;
  position: inherit;
  display: block;
  background-color: #f1f1f1;

  @extend %nero-shadow;
}

.title {
  vertical-align: top;

  &.left {
    display: inline-block;
    background: #b7b7b7;
    border-radius: 10px 0 0 10px;
    text-align: center;
    line-height: 42px;
    width: 30%;
    height: 100%;
  }

  &.top {
    border-radius: 10px 10px 0 0;

    h5 {
      margin: 0;
      padding: 2px 8px;
    }
  }

  h5 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.content {
  vertical-align: top;
  display: inline-block;
  height: 100%;
  width: 70%;
  font-size: 0.8em;
  padding: 10px 10px;

  p {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.description, .actions {
  display: inline-block;
  vertical-align: top;
}

.description {
  width: calc(100% - #{$buttons-panel-width});

  &.full-width {
    width: 100%;
  }
}

.actions {
  width: $buttons-panel-width;
  height: 100%;

  button {
    width: 100%;
    display: block;
    margin: 4px 0;
  }
}
</style>
