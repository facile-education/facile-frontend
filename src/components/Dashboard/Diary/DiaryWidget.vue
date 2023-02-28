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
      v-if="error === true"
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
    fromDate () {
      return dayjs()
    }
  },
  created () {
    this.loadDiaryEvents()
  },
  methods: {
    refresh () {
      this.loadDiaryEvents()
    },
    loadDiaryEvents () {
      this.isLoading = true
      getEvents(this.fromDate, nbDiaryEventInWidget, this.unReadOnly).then((data) => {
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
@import "@design";

section {
  border: 1px solid;
  width: min(355px, 100vw);
}

.footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;

  button {
    margin-right: 4px;
    border: 1px solid $color-border;
    border-radius: 4px;
    height: 29px;
    cursor: pointer;
    padding: 9px 10px;
    background-color: white;
  }
}
</style>

<i18n locale="fr">
{
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun événement",
  "showMore": "Voir tous les événements"
}
</i18n>
