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
        <div class="date theme-text-color">
          <div class="day-label">
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
            <div v-t="'populations'" />
            <PopulationList :population-list="detailedEvent.populations" />
          </div>

          <ReadInfos
            v-if="detailedEvent.isEditable"
            :read-infos="detailedEvent.readInfos"
          />

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
    }
  },
  data () {
    return {
      detailedEvent: undefined,
      isLoading: false,
      error: undefined
    }
  },
  computed: {
    eventDay () {
      return dayjs(this.initEvent.startDate).format('dd')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  height: 20vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25em;
}

.detailed-event {
}

.first-line {
  --date-width: 60px;
  display: flex;
}

.date{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: var(--date-width);
  text-align: center;

  .day-label {
    font-size: 12px;
    text-transform: uppercase;
  }

  .month-label {
    font-size: 12px;
    text-transform: capitalize;
  }
}

.first-line-right {
  width: calc(100% - var(--date-width));
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
</style>

<i18n locale="fr">
{
  "descriptionPlaceholder": "Aucune description pour cet événement",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "by": "Par ",
  "populations": "Diffusé à"
}
</i18n>
