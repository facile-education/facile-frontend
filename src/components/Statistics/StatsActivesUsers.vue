<template>
  <section v-if="nbUsers !== undefined">
    <span class="theme-text-color"> {{ nbUsers + ' ' + (nbUsers > 1 ? $t('activeUsers') : $t('activeUser')) }}</span>
  </section>
</template>

<script>
import { getActiveUsersCount } from '@/api/statistics.service'

export default {
  name: 'StatsActivesUsers',
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
          this.nbUsers = 0
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
span {
  font-size: 2em;
  letter-spacing: 0;
  line-height: 2em;
}
</style>

<i18n locale="fr">
{
  "activeUsers": "utilisateurs actifs",
  "activeUser": "utilisateur actif"
}
</i18n>
