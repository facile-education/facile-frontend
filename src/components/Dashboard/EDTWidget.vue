<template>
  <div
    class="edt-widget"
  >
    <div
      class="header"
    >
      <span>{{ $t('edt') }}</span>
    </div>
    <div class="body">
      <h3>EDT widget</h3>
      <div class="arrows">
        <div
          class="arrow"
          @click="goBefore"
        >
          <img
            src="@assets/arrow-left.svg"
            :alt="$t('goBefore')"
            :title="$t('goBefore')"
          >
        </div>
        <div
          class="arrow"
          @click="goAfter"
        >
          <img
            src="@assets/arrow-right.svg"
            :alt="$t('goAfter')"
            :title="$t('goAfter')"
          >
        </div>
      </div>

      <div
        v-for="session in sessions"
        :key="session.sessionId"
        class="session"
      >
        <p>1 session</p>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserSchedule } from '@/api/dashboard.service'
export default {
  name: 'EDTWidget',
  props: {
  },
  data () {
    return {
      sessions: [],
      currentDate: dayjs()
    }
  },
  computed: {
  },
  created () {
    this.getUserSchedule(true)
  },
  methods: {
    formatDate (date) {
      return date.format('YYYY-MM-DD HH:mm')
    },
    goBefore () {
      this.getUserSchedule(false)
    },
    goAfter () {
      this.getUserSchedule(true)
    },
    getUserSchedule (goForward) {
      // TODO : manage parents watching their child's schedule
      getUserSchedule(this.$store.state.user.userId, this.formatDate(this.currentDate), goForward).then(
        (data) => {
          if (data.success) {
            this.sessions = data.eventList
            this.currentDate = dayjs(data.date, 'YYYY-MM-DD HH:mm')
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.edt-widget {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-height: 600px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .header {
    margin: 0;
    padding: 10px 10px;
  }

.body {
    padding: 10px 15px;
    .arrows {
      display: flex;
      justify-content: space-evenly;
      .arrow {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "edt": "EDT",
  "goBefore": "Jour précédent",
  "goAfter": "Jour suivant"
}
</i18n>
