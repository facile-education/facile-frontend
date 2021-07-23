<template>
  <PentilaWindow
    :modal="true"
    @close="closeModal"
  >
    <template #header>
      <span v-t="title" />
    </template>

    <template #body>
      <div class="nero-form">
        <div class="widget-informations">
          <h5
            v-if="isCreation"
            v-t="'DashboardManager.WidgetEditionModal.typeDropdownLabel'"
          />
          <PentilaDropdown
            v-if="isCreation"
            :list="typeList"
            class="type-dropdown"
            @dropdown-select="onTypeSelect"
          />
          <!-- TODO dropdown model -->
          <div
            :class="{'inline': isCreation}"
            class="widget-name"
          >
            <PentilaInput
              v-model="widget.name"
              :placeholder="$t('DashboardManager.WidgetEditionModal.namePlaceholder') + '*'"
              :maxlength="75"
              cls="form"
              type="text"
            />
          </div>
        </div>

        <div class="widget-content">
        <!-- TODO <rss-widget-directive v-if="isRSS()" config="widget.content.config"></rss-widget-directive>
        <text-widget-directive v-if="isText()" content="widget.content.config.content"></text-widget-directive> -->
        </div>

        <hr class="nero-separator">

        <WidgetBroadcastRuleList
          v-if="widget.config && widget.config.roles"
          :role-list="widget.config.roles"
        />

        <hr class="nero-separator">

        <div v-if="showSchooltagsInput">
          <h5 v-t="'DashboardManager.WidgetEditionModal.targetedSchoolsTitle'" />

          <PentilaTagsInput
            v-model="widget.config.schools"
            :placeholder="$t('DashboardManager.WidgetEditionModal.schoolsPlaceholder')"
            :list="managedSchoolList"
            display-field="schoolName"
            cls="form"
          />
        </div>
        <div>
          <h5
            class="date-title"
            @click="toggleDatesPanel()"
          >
            <i :class="{'fa fa-caret-down': isDateDisplayed, 'fa fa-caret-right': !isDateDisplayed}" />
            {{ $t('DashboardManager.WidgetEditionModal.broadcastDatesTitle') }}
          </h5>
          <div
            v-if="isDateDisplayed"
            class="widget-date"
          >
            <div class="parution-date-widget">
              <label v-t="'DashboardManager.WidgetEditionModal.parutionDateLabel'" />
              TODO date picker
            </div>

            <div class="expiration-date-widget">
              <label v-t="'DashboardManager.WidgetEditionModal.expirationDateLabel'" />
              TODO date picker min date : widget.parutionDate
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('DashboardManager.WidgetEditionModal.saveButtonLabel')"
        @click="save"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import WidgetBroadcastRuleList from '@/components/DashboardManager/WidgetBroadcastRuleList'

export default {
  name: 'WidgetEditionModal',
  components: {
    WidgetBroadcastRuleList
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
      return this.isCreation
        ? 'DashboardManager.WidgetEditionModal.creationModalTitle'
        : 'DashboardManager.WidgetEditionModal.editionModalTitle'
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
