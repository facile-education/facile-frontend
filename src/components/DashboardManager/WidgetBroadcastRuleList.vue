<template>
  <div class="widget-broadcast">
    <h5 v-t="'DashboardManager.WidgetEditionModal.broadcastRulesTitle'" />

    <WidgetBroadcastRoleItem
      v-for="role in mainRoleList"
      :key="role.roleId"
      :is-broadcasted.sync="role.isBroadcasted"
      :is-mandatory.sync="role.isMandatory"
      :label="role.roleLabel"
    />

    <div
      class="personal-header"
      @click="togglePersonalPanel()"
    >
      <p class="personal-label">
        <i
          :class="{'fa fa-caret-down': isPersonnalPanelDisplayed, 'fa fa-caret-right': !isPersonnalPanelDisplayed}"
          class="theme-text-color"
        />
        {{ $t('DashboardManager.WidgetEditionModal.personalLabel') }}
      </p>

      <NeroToggleSwitch
        :value="isBroadcastedToAllPersonal"
        :class="{'partial': isAllPersonalTogglePartial}"
        class="toggle"
        @input="toggleBroadcastForPersonalRoleList"
      />

      <label
        v-if="isCountDisplayed"
        class="counter"
      >
        {{ personalBroadcastCount }}
      </label>
    </div>

    <div v-if="isPersonnalPanelDisplayed">
      <WidgetBroadcastRoleItem
        v-for="personalRole in personalRoleList"
        :key="personalRole.roleId"
        :is-broadcasted.sync="personalRole.isBroadcasted"
        :is-mandatory.sync="personalRole.isMandatory"
        :label="personalRole.roleLabel"
      />
    </div>
  </div>
</template>

<script>
import WidgetBroadcastRoleItem from '@/components/DashboardManager/WidgetBroadcastRoleItem'
import NeroToggleSwitch from '@/components/Nero/NeroToggleSwitch'

export default {
  name: 'WidgetBroadcastRuleList',
  components: {
    WidgetBroadcastRoleItem,
    NeroToggleSwitch
  },
  // TODO copy roleList to update it
  props: {
    roleList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isPersonnalPanelDisplayed: false,
      isBroadcastedToAllPersonal: false
    }
  },
  computed: {
    isAllPersonalTogglePartial () {
      return (this.personalBroadcastCount > 0) &&
        (this.personalBroadcastCount < this.personalRoleList.length)
    },
    isCountDisplayed () {
      return (this.personalBroadcastCount < this.personalRoleList.length)
    },
    mainRoleList () {
      return this.roleList.filter((item) => {
        if (item.roleName.indexOf('Personnel') !== -1) {
          return false
        }
        return true
      })
    },
    personalRoleList () {
      return this.roleList.filter((item) => {
        if (item.roleName.indexOf('Personnel') !== -1) {
          return true
        }
        return false
      })
    },
    personalBroadcastCount () {
      var count = 0
      for (var idx = 0; idx < this.personalRoleList.length; ++idx) {
        if (this.personalRoleList[idx].isBroadcasted) ++count
      }
      return count
    }
  },
  watch: {
    personalBroadcastCount (value, oldValue) {
      if (value === 1 && oldValue === 0) this.isBroadcastedToAllPersonal = true
      else if (value === 0 && oldValue === 1) this.isBroadcastedToAllPersonal = false
    }
  },
  created () {
    this.isBroadcastedToAllPersonal = (this.personalBroadcastCount > 0)
  },
  methods: {
    toggleBroadcastForPersonalRoleList (value) {
      for (var idx = 0; idx < this.personalRoleList.length; ++idx) {
        this.personalRoleList[idx].isBroadcasted = value
      }
      this.isBroadcastedToAllPersonal = value
    },
    togglePersonalPanel () {
      this.isPersonnalPanelDisplayed = !this.isPersonnalPanelDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.personal-header {
  position: relative;
  background: $toolbar-background-color; // #e4e4e4;
  border-radius: $border-radius;
  padding: 5px;
  cursor: pointer;
  @extend %nero-shadow;

  .personal-label {
    display: inline-block;
    margin: 0;
    width: 50%;
  }

  .counter {
    position: absolute;
    right: 5px;
    background: #d0cfcf;
    padding: 2px 9px;
    border-radius: 10px;
  }
}
</style>
