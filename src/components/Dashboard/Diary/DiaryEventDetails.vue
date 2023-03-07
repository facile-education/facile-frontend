<template>
  <article>
    <div
      v-if="isLoading"
      class="placeholder"
    >
      <PentilaSpinner />
    </div>
    <div
      v-if="error === true"
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
            v-if="detailedEvent.isEditable"
            class="read-infos"
          >
            <div
              v-t="'readBy'"
              class="label"
            />
            <ReadInfos :read-infos="detailedEvent.readInfos" />
          </div>

          <div class="author">
            {{ $t('by') + detailedEvent.authorName }}
          </div>

          <h2> {{ detailedEvent.title }}</h2>

          <div class="where-and-when">
            <div
              v-if="detailedEvent.location"
              class="location"
            >
              {{ detailedEvent.location }}
            </div>
            <div class="location">
              {{ formattedRangeDate }}
            </div>
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
        v-if="!isInModal && detailedEvent.isEditable"
        class="footer"
      >
        <PentilaButton
          class="footer-button"
          data-test="updateButton"
          :label="$t('update')"
          @click="updateEvent"
        />
        <PentilaButton
          class="footer-button"
          data-test="deleteButton"
          :label="$t('delete')"
          @click="deleteEvent"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { getEventDetails } from '@/api/dashboard/agenda.service'
import dayjs from 'dayjs'
import PopulationList from '@components/Dashboard/PopulationList.vue'
import ReadInfos from '@components/Dashboard/ReadInfos.vue'

export default {
  name: 'DiaryEventDetails',
  components: { ReadInfos, PopulationList },
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
      error: undefined
    }
  },
  computed: {
    eventDay () {
      return dayjs(this.initEvent.startDate).format('ddd')
    },
    eventDayNumber () {
      return dayjs(this.initEvent.startDate).format('DD')
    },
    eventMonth () {
      return dayjs(this.initEvent.startDate).format('MMMM')
    },
    formattedRangeDate () {
      return dayjs(this.initEvent.startDate).format('DD-MM-YY HH:mm') + ' - ' + dayjs(this.initEvent.endDate).format('DD-MM-YY HH:mm')
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
    updateEvent () {
      this.$emit('update')
    },
    deleteEvent () {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.placeholder {
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

.populations, .read-infos {
  display: flex;
}

.label {
  width: 75px;
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
  "by": "Par ",
  "populations": "Diffusé à",
  "readBy": "Lu par",
  "update": "Modifier",
  "delete": "Supprimer"
}
</i18n>
