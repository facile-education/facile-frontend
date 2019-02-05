<template>
  <div
    class="candidate theme-hover-text-color"
    :class="{'selected': isDelegate, 'theme-text-color': isDelegate}"
    @click="onClick"
  >
    <img
      :src="candidate.portraitURL"
      class="user-thumbnail"
    >
    {{ candidate.userLastName }} {{ candidate.userFirstName }}
    <i
      v-if="isDelegate"
      class="check fa fa-check"
    />
  </div>
</template>

<script>
export default {
  name: 'NewsDelegationCandidate',
  props: {
    candidate: {
      type: Object,
      required: true
    }
  },
  computed: {
    isDelegate () {
      var delegateList = this.$store.state.news.delegateList
      for (var i = 0; i < delegateList.length; ++i) {
        if (delegateList[i].userId === this.candidate.userId) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    onClick () {
      if (!this.isDelegate) {
        this.$store.commit('news/addToDelegateList', this.candidate)
      } else {
        this.$store.commit('news/removeFromDelegateList', this.candidate)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.candidate {
  cursor: pointer;
  position: relative;
  padding: 3px;
}

.selected {
  font-weight: bolder;
}

.user-thumbnail {
  display: inline-block;
  vertical-align: middle;
  margin: auto;
  max-height: 20px;
  max-width: 20px;
  border-radius: 50%;
}

.check {
  position: absolute;
  right: 5px;
  top: 3px;
}
</style>
