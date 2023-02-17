<template>
  <section>
    <h2 v-t="service" />
    <PentilaSpinner v-if="isLoading" />
    <div
      v-else-if="count !== undefined"
      class="content"
    >
      <AnimatedCounter
        class="value"
        :target="count"
      />
      <div
        v-t="service"
        class="label"
      />
    </div>
  </section>
</template>

<script>
import { getMessagesCount, getNewsCount } from '@/api/statistics.service'
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'

export default {
  name: 'GlobalStat',
  components: { AnimatedCounter },
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
    },
    color: {
      type: String,
      default: '#000000'
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
  mounted () {
    this.$el.style.color = this.color
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
            this.count = data.groupNewsCount
          } else {
            console.error('Error')
          }
        })
      } else if (this.service === 'schoolNews') {
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
@import "@design";

section {
  position: relative;
  min-width: min(300px, 100vw);
  white-space: nowrap;
}

h2 {
  color: black;
}

.content {
  height: 227px;
  width: 100%;
  border: 1px solid $color-border;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .value {
    font-size: 5em;
    height: 70px;
    vertical-align: bottom;
  }

  .label {
    font-size: 1.188em;
  }
}
</style>

<i18n locale="fr">
{
  "messaging": "Messages envoyés",
  "news": "Actualités",
  "schoolNews": "Annonces de l'établissement"
}
</i18n>
