<template>
  <section v-if="nbUsers !== undefined">
    <span class="theme-text-color">
      <CustomIcon :icon-name="'icon-user-24'" />
      <AnimatedCounter
        v-if="nbUsers > 0"
        :target="nbUsers"
        :animation-duration="300"
      />
      <span
        v-if="mq.phone || mq.tablet"
        class="label"
      >
        {{ $tc('Statistics.StatsActivesUsers.activeUsersShort', nbUsers) }}
      </span>
      <span
        v-else
        class="label"
      >
        {{ $tc('Statistics.StatsActivesUsers.activeUsers', nbUsers) }}
      </span>
    </span>
  </section>
</template>

<script>
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'
import CustomIcon from '@components/Base/CustomIcon.vue'

import { getActiveUsersCount } from '@/api/statistics.service'

export default {
  name: 'StatsActivesUsers',
  components: { CustomIcon, AnimatedCounter },
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
@import "@design";

.theme-text-color {
  display: flex;
  align-items: center;

  @extend %font-heading-s;
}

@media screen and (max-width: 840px) and (min-width: 450px) {
  .theme-text-color {
    font-size: 1.5em;
  }

  img {
    height: 25px;
  }
}

.icon-user-24 {
  margin-right: 8px;
}

.label {
  margin-left: 10px;
}
</style>
