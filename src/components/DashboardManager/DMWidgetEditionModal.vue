<template>
  <NeroWindow
    :modal="true"
    @close="closeModal">
    <span
      v-t="title"
      slot="header"/>

    <div
      slot="body"
      class="nero-form">

      <div class="widget-informations">
        <h5
          v-t="'DashboardManager.DMWidgetEditionModal.typeDropdownLabel'"
          v-if="isCreation"/>
        <NeroDropdown
          v-if="isCreation"
          :list="typeList"
          class="type-dropdown"
          @dropdown-select="onTypeSelect"/>
        <!-- TODO width dropdown 100% -->
        <div
          :class="{'inline': isCreation}"
          class="widget-name">
          <NeroInput
            v-model="widget.name"
            :placeholder="$t('DashboardManager.DMWidgetEditionModal.namePlaceholder') + '*'"
            :maxlength="75"
            cls="form"
            type="text"/>
        </div>
      </div>

      <div class="widget-content">
        <!-- TODO <rss-widget-directive v-if="isRSS()" config="widget.content.config"></rss-widget-directive>
        <text-widget-directive v-if="isText()" content="widget.content.config.content"></text-widget-directive> -->
      </div>

      <hr class="nero-separator">

      <DMWidgetBroadcastRuleList
        v-if="widget.config && widget.config.roles"
        :role-list="widget.config.roles"/>

      <hr class="nero-separator">

      <div v-if="showSchooltagsInput">
        <h5 v-t="'DashboardManager.DMWidgetEditionModal.targetedSchoolsTitle'"/>

        <NeroTagsInput
          v-model="widget.config.schools"
          :placeholder="$t('DashboardManager.DMWidgetEditionModal.schoolsPlaceholder')"
          :list="managedSchoolList"
          display-field="schoolName"
          cls="form"/>
      </div>
      <div>
        <h5
          class="date-title"
          @click="toggleDatesPanel()">
          <i :class="{'fa fa-caret-down': isDateDisplayed, 'fa fa-caret-right': !isDateDisplayed}"/>
          {{ $t('DashboardManager.DMWidgetEditionModal.broadcastDatesTitle') }}
        </h5>
        <div
          v-if="isDateDisplayed"
          class="widget-date">

          <div class="parution-date-widget">
            <label v-t="'DashboardManager.DMWidgetEditionModal.parutionDateLabel'"/>
            TODO date picker
          </div>

          <div class="expiration-date-widget">
            <label v-t="'DashboardManager.DMWidgetEditionModal.expirationDateLabel'"/>
            TODO date picker min date : widget.parutionDate
          </div>
        </div>
      </div>
    </div>

    <NeroButton
      slot="footer"
      :label="$t('DashboardManager.DMWidgetEditionModal.saveButtonLabel')"
      @click="save"/>
  </NeroWindow>
</template>

<script>
import DMWidgetBroadcastRuleList from '@/components/DashboardManager/DMWidgetBroadcastRuleList'
import NeroButton from '@/components/NeroButton'
import NeroDropdown from '@/components/NeroDropdown'
import NeroInput from '@/components/NeroInput'
import NeroTagsInput from '@/components/NeroTagsInput'
import NeroWindow from '@/components/NeroWindow'

export default {
  name: 'DMWidgetEditionModal',
  components: {
    DMWidgetBroadcastRuleList,
    NeroButton,
    NeroDropdown,
    NeroInput,
    NeroTagsInput,
    NeroWindow
  },
  data () {
    return {
      isDateDisplayed: false,
      widget: {}
    }
  },
  computed: {
    isCreation () {
      return (this.widget.widgetId === undefined)
    },
    managedSchoolList () {
      return this.$store.state.administration.schoolList
    },
    showSchooltagsInput () {
      return (this.managedSchoolList.length > 1)
    },
    title () {
      return this.isCreation ? 'DashboardManager.DMWidgetEditionModal.creationModalTitle'
        : 'DashboardManager.DMWidgetEditionModal.editionModalTitle'
    },
    typeList () {
      return this.$store.getters['dashboardManager/typeList']
    }
  },
  created () {
    this.widget = JSON.parse(JSON.stringify(this.$store.state.dashboardManager.editedWidget))
  },
  methods: {
    closeModal () {
      this.$store.dispatch('dashboardManager/closeEditionModal')
    },
    onTypeSelect () {
      // TODO action
    },
    save () {
      this.$store.dispatch('dashboardManager/saveWidget', this.widget)
    },
    toggleDatesPanel () {
      this.isDateDisplayed = !this.isDateDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.type-dropdown {
  width: 33%;
  margin-right: 2%;
}

.widget-name {
  &.inline {
    display: inline-block;
    width: 65%;
  }
}
</style>
