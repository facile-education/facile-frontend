<template>
  <article>
    <div
      v-if="isLoading"
      class="placeholder"
    >
      <WeprodeSpinner />
    </div>
    <div
      v-else-if="error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="detailedEvent"
      class="detailed-event"
    >
      <div class="first-line">
        <div class="date theme-background-color">
          <div class="day-label theme-text-color">
            {{ eventDay }}
          </div>
          <b class="day-number-label">
            {{ eventDayNumber }}
          </b>
          <div class="month-label">
            {{ eventMonth }}
          </div>
        </div>

        <div class="first-line-right">
          <div class="populations">
            <div
              v-t="'populations'"
              class="label"
            />
            <PopulationList :population-list="detailedEvent.populations" />
          </div>

          <div
            v-if="detailedEvent.readInfos !== undefined"
            class="read-infos"
          >
            <div
              v-t="'readBy'"
              class="label"
            />
            <ReadInfos :read-infos="detailedEvent.readInfos" />
          </div>

          <div class="author">
            {{ $t('by') }} <span
              class="toggle-user-card"
              @click.stop="openUserCardModal"
            >{{ detailedEvent.authorName }}</span>
          </div>

          <h2 v-if="!isInModal">
            {{ detailedEvent.title }}
          </h2>

          <div class="where-and-when">
            <span v-if="detailedEvent.location">
              <img
                src="@/assets/icons/location.svg"
                alt=""
              >
              {{ detailedEvent.location }}
            </span>
            <span>
              <img
                src="@/assets/history.svg"
                alt=""
              >
              {{ formattedRangeDate }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="detailedEvent.description"
        class="description"
        v-html="detailedEvent.description"
      />
      <div
        v-else
        v-t="'descriptionPlaceholder'"
        class="description-placeholder"
      />

      <div
        v-if="detailedEvent.isEditable || detailedEvent.isDeletable"
        class="footer"
      >
        <WeprodeButton
          v-if="detailedEvent.isEditable"
          class="footer-button"
          data-test="updateButton"
          :label="$t('update')"
          @click="openUpdateModal"
        />
        <WeprodeButton
          v-if="detailedEvent.isDeletable"
          class="footer-button"
          data-test="deleteButton"
          :label="$t('delete')"
          @click="confirmDeleteEvent"
        />
      </div>
    </div>
  </article>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveDiaryEventModal
      :init-event="detailedEvent"
      @update-event="updateEvent"
      @close="isUpdateModalDisplayed = false"
    />
  </teleport>
</template>

<script>
import PopulationList from '@components/Base/PopulationList.vue'
import ReadInfos from '@components/Dashboard/ReadInfos/ReadInfos.vue'
import dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'

import { deleteEvent, getEventDetails } from '@/api/dashboard/agenda.service'
import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const SaveDiaryEventModal = defineAsyncComponent(() => import('@components/Dashboard/DiaryWidget/SaveDiaryEventModal.vue'))

export default {
  name: 'DiaryEventDetails',
  components: { ReadInfos, PopulationList, SaveDiaryEventModal, WeprodeButton, WeprodeSpinner },
  props: {
    initEvent: {
      type: Object,
      default: undefined
    },
    isInModal: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update', 'delete'],
  data () {
    return {
      detailedEvent: undefined,
      isLoading: false,
      error: undefined,
      isUpdateModalDisplayed: false
    }
  },
  computed: {
    eventDay () {
      return dayjs(this.detailedEvent.startDate).format('ddd')
    },
    eventDayNumber () {
      return dayjs(this.detailedEvent.startDate).format('DD')
    },
    eventMonth () {
      return dayjs(this.detailedEvent.startDate).format('MMMM')
    },
    formattedRangeDate () {
      const startDate = dayjs(this.detailedEvent.startDate)
      const endDate = dayjs(this.detailedEvent.endDate)
      if (startDate.isSame(endDate, 'day')) { // If start date and end date are the same day
        return this.$t('from') + startDate.format('HH:mm') + this.$t('at') + endDate.format('HH:mm')
      } else if (startDate.isSame(endDate, 'year')) { // If start date and end date are the same year
        return this.$t('fromDay') + startDate.format('dddd DD MMMM') + this.$t('at') + startDate.format('HH:mm') +
          this.$t('to') + endDate.format('dddd DD MMMM') + this.$t('at') + endDate.format('HH:mm')
      } else {
        return this.$t('fromDay') + startDate.format('DD-MM-YY HH:mm') + this.$t('to') + endDate.format('DD-MM-YY HH:mm')
      }
    }
  },
  watch: {
    initEvent: {
      deep: true,
      handler () {
        this.getEventDetails()
      }
    }
  },
  created () {
    this.getEventDetails()
  },
  methods: {
    getEventDetails () {
      this.isLoading = true
      getEventDetails(this.initEvent.eventId).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.detailedEvent = data
        } else {
          this.error = true
          console.error('Error')
        }
      })
    },
    openUpdateModal () {
      this.isUpdateModalDisplayed = true
    },
    updateEvent () {
      this.getEventDetails()
      this.$emit('update')
    },
    confirmDeleteEvent () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('removalConfirmMessage', { target: this.initEvent.title }),
        lastAction: { fct: this.deleteEvent, params: [] }
      })
    },
    deleteEvent () {
      deleteEvent(this.initEvent.eventId).then((data) => {
        if (data.success) {
          this.$emit('delete')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', {
        userId: this.detailedEvent.authorId
      })
    }
  }
}
</script>

<style lang="scss">
.diary-event-details-modal .window-body {
  .description {
    max-height: none;
    overflow-y: initial;
  }

  .footer {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

article {
  height: 100%;
  flex:1;
}

.detailed-event {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.placeholder {
  position: relative;
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}

.first-line {
  --date-width: min(100px, 20vw);
  display: flex;
}

.date{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--date-width);
  text-align: center;
  border-radius: 10px;
  line-height: 1.5em;

  .day-label {
    font-size: 12px;
    text-transform: uppercase;
    opacity: 54%;
  }

  .day-label, .day-number-label, .month-label {
    color: white;
  }

  .month-label {
    font-size: 12px;
    text-transform: capitalize;
    font-weight: bold;
  }
}

.first-line-right {
  width: calc(100% - var(--date-width));
  padding-left: 20px;
}

.populations {
  margin-bottom: 5px;
}

.populations, .read-infos {
  display: flex;
}

.label {
  min-width: 5em;
}

.populations .label {
  margin-top: 5px;
}

.where-and-when {
  span {
    margin-right: 10px;
  }

  img {
    height: 13px;
  }
}

.author {
  margin-top: 0.5em;
  color: $color-new-light-text;
}

h2 {
  margin: 0.25em 0;
}

.description {
  max-height: 30vh;
  overflow-y: auto;
}

.description-placeholder {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer {
  align-self: flex-end;
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: flex-end;

  .footer-button {
    margin-left: 15px;
  }
}
</style>

<i18n locale="fr">
{
  "descriptionPlaceholder": "Aucune description pour cet événement",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "from": "De ",
  "fromDay": "Du ",
  "at": " à ",
  "to": " au ",
  "by": "Par ",
  "populations": "Diffusé à",
  "readBy": "Lu par",
  "update": "Modifier",
  "delete": "Supprimer",
  "removalConfirmMessage": "Veuillez confirmer la suppression de l'évènement \"{target}\""
}
</i18n>
