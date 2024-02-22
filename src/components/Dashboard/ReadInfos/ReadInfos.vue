<template>
  <button @click="displayReadInfoModal=true">
    <CustomIcon icon-name="icon-check" />
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'
const ReadInfoModal = defineAsyncComponent(() => import('@components/Dashboard/ReadInfos/ReadInfoModal.vue'))

export default {
  name: 'ReadInfos',
  components: { CustomIcon, ReadInfoModal },
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
  display: flex;
  align-items: center;
  @extend %font-regular-m;
}

.icon-check {
  color: green;
  font-size: 1.3rem;
  margin-right: 5px;
}
</style>
