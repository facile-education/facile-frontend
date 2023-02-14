<template>
  <section>
    <h2 v-t="service" />
    <PentilaSpinner v-if="isLoading" />
    <div v-else-if="count !== undefined">
      <span>Total : {{ count }}</span>
    </div>
  </section>
</template>

<script>
import { getMessagesCount, getNewsCount } from '@/api/statistics.service'

export default {
  name: 'GlobalStat',
  props: {
    service: {
      type: String,
      required: true
    },
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
      isLoading: false,
      count: undefined
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
      if (this.service === 'messaging') {
        this.isLoading = true
        getMessagesCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.count = data.count
          } else {
            console.error('Error')
          }
        })
      } else if (this.service === 'news') {
        this.isLoading = true
        getNewsCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.count = data.schoolNewsCount // or data.groupNewsCount
          } else {
            console.error('Error')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    position: relative;
  }
</style>

<i18n locale="fr">
{
  "messaging": "Messages envoyés",
  "news": "Actualités"
}
</i18n>
