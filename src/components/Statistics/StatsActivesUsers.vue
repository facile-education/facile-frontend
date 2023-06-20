<template>
  <section v-if="nbUsers !== undefined">
    <span class="theme-text-color">
      <img
        src="@/assets/user.svg"
        alt=""
      >
      <AnimatedCounter
        v-if="nbUsers > 0"
        :target="nbUsers"
        :animation-duration="300"
      />
      <span
        v-if="mq.phone || mq.tablet"
        class="label"
      >
        {{ $tc('activeUsersShort', nbUsers) }}
      </span>
      <span
        v-else
        class="label"
      >
        {{ $tc('activeUsers', nbUsers) }}
      </span>
    </span>
  </section>
</template>

<script>
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'

import { getActiveUsersCount } from '@/api/statistics.service'

export default {
  name: 'StatsActivesUsers',
  components: { AnimatedCounter },
  inject: ['mq'],
  props: {
    startTime: {
      type: Object,
      required: true
    },
    endTime: {
      type: Object,
      required: true
    },
    selectedSchool: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      nbUsers: undefined
    }
  },
  watch: {
    startTime () {
      this.getData()
    },
    endTime () {
      this.getData()
    },
    selectedSchool () {
      this.getData()
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      getActiveUsersCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
        if (data.success) {
          this.nbUsers = data.count
        } else {
          console.error('Error')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-text-color {
  font-size: 2em;
  letter-spacing: 0;
  line-height: 1.5em;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 840px) and (min-width: 450px) {
  .theme-text-color {
    font-size: 1.5em;
  }

  img {
    height: 25px;
    margin-bottom: 3px;
  }
}

img {
  margin-right: 15px;
  margin-bottom: 6px;
}

.label {
  margin-left: 10px;
}
</style>

<i18n locale="fr">
{
  "activeUsers": "Aucun utilisateur unique sur la période | utilisateur unique sur la période | utilisateurs uniques sur la période",
  "activeUsersShort": "Aucun utilisateur unique | utilisateur unique | utilisateurs uniques"
}
</i18n>
