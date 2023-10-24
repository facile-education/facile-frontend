<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :hidden-footer="true"
    :draggable="true"
    :max-width="1000"
    data-test="readInfoModal"
    @close="onClose"
  >
    <template #header>
      <h1>{{ $tc('header', allReadMembers.length, {n: allReadMembers.length, totalCount: allMembers.length}) }}</h1>
    </template>

    <template #body>
      <ul :class="{'phone': mq.phone}">
        <li
          v-for="(population, index) in sortedPopulations"
          :key="index"
        >
          <ReadInfoModalPopulation :population="population" />
        </li>
      </ul>
    </template>
  </WeprodeWindow>
</template>

<script>
import ReadInfoModalPopulation from '@components/Dashboard/ReadInfos/ReadInfoModalPopulation.vue'
import WeprodeUtils from '@utils/weprode.utils'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'ReadInfoModal',
  components: { ReadInfoModalPopulation, WeprodeWindow },
  inject: ['mq'],
  props: {
    readInfos: {
      type: Array,
      required: true
    }
  },
  emits: ['close'],
  computed: {
    allMembers () {
      let allMembers = []
      this.readInfos.forEach((population) => {
        allMembers = [...allMembers, ...population.members]
      })

      // Remove duplicate users based on userId (user can be present in different populations)
      allMembers = allMembers.filter((user, index) => {
        return allMembers.findIndex(u => u.userId === user.userId) === index
      })
      return allMembers
    },
    allReadMembers () {
      return this.allMembers.filter(member => member.hasRead === true)
    },
    sortedPopulations () {
      return WeprodeUtils.sortArrayWithString(this.readInfos, false, 'populationName')
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/design/index";

h1 {
  margin: 0;
  font-size: 1em;
  line-height: 1.25em;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    border-bottom: 1px solid $color-border;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>

<i18n locale="fr">
{
  "header": "Lu par {n} destinataire sur {totalCount} | Lu par {n} destinataire sur {totalCount} | Lu par {n} destinataires sur {totalCount}"
}
</i18n>
