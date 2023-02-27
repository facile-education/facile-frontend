<template>
  <section>
    <DiaryHeader
      :nb-new-events="nbNewEvents"
      @createEvent="refresh"
    />
    <div
      v-if="isLoading"
      class="placeholder"
    >
      <PentilaSpinner />
    </div>
    <div
      v-if="minDate === undefined || error === true"
      v-t="'errorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="eventList.length === 0"
      v-t="'emptyPlaceholder'"
      class="placeholder"
    />
    <div
      v-else
      class="events"
    >
      <div class="period">
        {{ periodLabel }}
      </div>
      <DiaryEventItem
        v-for="(event, index) in eventList"
        :key="index"
        :event="event"
      />
      <div class="footer">
        <button
          v-t="'showMore'"
          class="show-more"
          @click="showMore"
        />
      </div>
    </div>
  </section>
</template>

<script>
import DiaryHeader from '@components/Dashboard/Diary/DiaryHeader.vue'
import DiaryEventItem from '@components/Dashboard/Diary/DiaryEventItem.vue'
import { nbDiaryEventInWidget } from '@/constants/dashboardConstants'
import { getEvents } from '@/api/dashboard/agenda.service'
import dayjs from 'dayjs'

export default {
  name: 'DiaryWidget',
  components: { DiaryHeader, DiaryEventItem },
  data () {
    return {
      unReadOnly: false,
      eventList: [],
      nbNewEvents: 0,
      isLoading: false,
      error: false
    }
  },
  computed: { // TODO: Confirm behaviour
    periodLabel () {
      return 'Février'
    },
    minDate () {
      // return this.$store.state.cdt.configuration.startDateSchool // TODO: or schoolYear date? => to define
      return dayjs().subtract(1, 'year')
    }
  },
  watch: {
    minDate: {
      immediate: true,
      handler () {
        if (this.minDate !== undefined) {
          this.loadDiaryEvents()
        }
      }
    }
  },
  created () {
    if (this.minDate === undefined) {
      this.$store.dispatch('cdt/getConfiguration')
    }
  },
  methods: {
    refresh () {
      if (this.minDate) {
        this.loadDiaryEvents()
      } else {
        console.error('Cannot refresh diary events without a minDate')
      }
    },
    loadDiaryEvents () {
      this.isLoading = true
      getEvents(this.minDate, nbDiaryEventInWidget, this.unReadOnly).then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.eventList = data.events
          this.nbNewEvents = data.nbNewEvents
        } else {
          this.error = true
          console.error('Error')
        }
      })
    },
    showMore () {
      // TODO
      console.log('TODO:  display Modal')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun évenement",
  "showMore": "Voir tous les évenements"
}
</i18n>
