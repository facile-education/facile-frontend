<template>
  <button @click="displayReadInfoModal=true">
    <BaseIcon
      class="check-icon"
      name="check"
    />
    <span> {{ $tc('usersOn', allReadMembers.length, {n: allReadMembers.length, totalCount: allMembers.length}) }} </span>
  </button>

  <teleport
    v-if="displayReadInfoModal"
    to="body"
  >
    <ReadInfoModal
      :read-infos="readInfos"
      @close="displayReadInfoModal=false"
    />
  </teleport>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import ReadInfoModal from '@components/Dashboard/ReadInfos/ReadInfoModal.vue'

// import { defineAsyncComponent } from 'vue'
// const ReadInfoModal = defineAsyncComponent(() => import('@components/Dashboard/ReadInfoModal.vue'))

export default {
  name: 'ReadInfos',
  components: { ReadInfoModal, BaseIcon },
  props: {
    readInfos: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      displayReadInfoModal: false
    }
  },
  computed: {
    allMembers () {
      let allMembers = []
      this.readInfos.forEach((population) => {
        allMembers = [...allMembers, ...population.members]
      })
      return allMembers
    },
    allReadMembers () {
      return this.allMembers.filter(member => member.hasRead === true)
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.check-icon {
  color: green;
  margin-right: 5px;
}
</style>

<i18n locale="fr">
{
  "readBy": "Lu par ",
  "usersOn": "{n} destinataire sur {totalCount} | {n} destinataire sur {totalCount} | {n} destinataires sur {totalCount}"
}
</i18n>
