<template>
  <div
    v-if="displayAutocomplete"
    class="autocomplete">
    <ul class="suggestion-list">
      <li
        v-for="(item,index) in list"
        :key="index">
        text {{ index }}<i class="user-info"/></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NeroAutocomplete',
  props: {
    filter: {
      type: String,
      default: ''
    },
    minLength: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      list: [{}, {}, {}, {}]
    }
  },
  computed: {
    displayAutocomplete () {
      return (this.filter.length >= this.minLength)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
