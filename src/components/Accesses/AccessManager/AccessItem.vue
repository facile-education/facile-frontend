<template>
  <div class="access">
    <h3>
      {{ access.title }}
    </h3>
  </div>

  <teleport
    v-if="isUpdateModalDisplayed"
    to="body"
  >
    <SaveAccessModal
      :category-list="categoryList"
      :init-access="access"
      @updateAccess="updateAccess"
      @close="isUpdateModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import SaveAccessModal from '@components/Accesses/AccessManager/SaveAccessModal.vue'

export default {
  name: 'AccessItem',
  components: { SaveAccessModal },
  props: {
    access: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isUpdateModalDisplayed: false
    }
  },
  computed: {
    categoryList () {
      return this.$store.state.accessManager.categoryList
    }
  },
  methods: {
    updateAccess () {
      console.log('todo')
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  height: 50px;
  background-color: cornflowerblue;
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
