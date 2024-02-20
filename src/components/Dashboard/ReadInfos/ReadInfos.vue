<template>
  <button @click="displayReadInfoModal=true">
    <BaseIcon
      class="check-icon"
      name="check"
    />
    <span> {{ $tc('Dashboard.ReadInfos.usersOn', allReadMembers.length, {n: allReadMembers.length, totalCount: allMembers.length}) }} </span>
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
import { defineAsyncComponent } from 'vue'
const ReadInfoModal = defineAsyncComponent(() => import('@components/Dashboard/ReadInfos/ReadInfoModal.vue'))

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

      // Remove duplicate users based on userId (user can be present in different populations)
      allMembers = allMembers.filter((user, index) => {
        return allMembers.findIndex(u => u.userId === user.userId) === index
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
@import "@design";

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
  @extend %font-regular-m;
}

.check-icon {
  color: green;
  margin-right: 5px;
}
</style>
