<template>
  <section>
    <h2 v-t="service" />
    <div
      v-if="isLoading"
      class="loading-placeholder"
    >
      <WeprodeSpinner />
    </div>
    <div
      v-else-if="error === true"
      v-t="'error'"
      class="error-placeholder"
    />
    <div
      v-else-if="count !== undefined"
      class="content"
    >
      <AnimatedCounter
        class="value"
        :target="count"
      />
    </div>
  </section>
</template>

<script>
import AnimatedCounter from '@components/Base/AnimatedCounter.vue'

import { getMessagesCount, getNewsCount } from '@/api/statistics.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'GlobalStat',
  components: { AnimatedCounter, WeprodeSpinner },
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
      error: false,
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
            this.error = false
            this.count = data.count
          } else {
            this.error = true
            console.error('Error')
          }
        })
      } else if (this.service === 'news') {
        this.isLoading = true
        getNewsCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.error = false
            this.count = data.groupNewsCount
          } else {
            this.error = true
            console.error('Error')
          }
        })
      } else if (this.service === 'schoolNews') {
        this.isLoading = true
        getNewsCount(this.selectedSchool.schoolId, this.startTime, this.endTime).then((data) => {
          this.isLoading = false
          if (data.success) {
            this.error = false
            this.count = data.schoolNewsCount // or data.groupNewsCount
          } else {
            this.error = true
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
  max-width: 450px;
  flex: 1;
  white-space: nowrap;
}

h2 {
  color: black;
  font-weight: normal;
}

.loading-placeholder, .error-placeholder, .content {
  border: 1px solid $color-border;
  border-radius: 10px;
  height: 200px;
  width: 100%;
}

.loading-placeholder {
  position: relative;
}

.error-placeholder{
  color: black;
  font-size: 1.25em;
}

.content, .error-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .value {
    font-size: 5em;
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
  "error": "Oups, une erreur est survenue...",
  "schoolNews": "Annonces de l'établissement"
}
</i18n>
