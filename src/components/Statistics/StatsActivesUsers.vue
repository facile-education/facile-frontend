<template>
  <section v-if="nbUsers !== undefined">
    <span class="theme-text-color">
      <img
        src="@/assets/user.svg"
        alt=""
      >
      <AnimatedCounter
        :target="nbUsers"
        :animation-duration="300"
      />
      <span class="label">
        {{ nbUsers > 1 ? $t('activeUsers') : $t('activeUser') }}
      </span>
    </span>
  </section>
</template>

<script>
import { getActiveUsersCount } from '@/api/statistics.service'
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'

export default {
  name: 'StatsActivesUsers',
  components: { AnimatedCounter },
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
  line-height: 2em;
  display: flex;
}

@media screen and (max-width: 840px) and (min-width: 450px) {
  .theme-text-color {
    font-size: 1.5em;
  }
}

img {
  margin-right: 15px;
}

.label {
  margin-left: 10px;
}
</style>

<i18n locale="fr">
{
  "activeUsers": "utilisateurs actifs",
  "activeUser": "utilisateur actif"
}
</i18n>
