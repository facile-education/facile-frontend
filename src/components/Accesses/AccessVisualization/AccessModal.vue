<template>
  <PentilaWindow
    class="create-link-modal"
    data-test="create-link-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>
    <template #body>
      <PentilaSpinner
        v-if="isLoading"
        style="z-index: 1"
      />
      <div
        v-if="error === true"
        v-t="'errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else-if="categoryList.length === 0"
        v-t="'emptyPlaceholder'"
        class="placeholder"
      />
      <ul v-else>
        <li
          v-for="category in sortedCategoryList"
          :key="category.categoryId"
        >
          <UserAccessCategory :category="category" />
        </li>
      </ul>
    </template>
  </PentilaWindow>
</template>

<script>
import { getUserAccesses } from '@/api/access.service'
import { sortAccesses } from '@utils/accessUtils'
import UserAccessCategory from '@components/Accesses/AccessVisualization/UserAccessCategory.vue'

export default {
  name: 'AccessModal',
  components: { UserAccessCategory },
  emits: ['close'],
  data () {
    return {
      isLoading: false,
      error: false,
      categoryList: []
    }
  },
  computed: {
    sortedCategoryList () {
      return sortAccesses(this.categoryList)
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.getUserAccesses()
  },
  methods: {
    getUserAccesses () {
      this.isLoading = true
      getUserAccesses().then((data) => {
        this.isLoading = false
        if (data.success) {
          this.error = false
          this.categoryList = data.accesses
        } else {
          this.error = true
          console.error('Error')
        }
      }, (err) => {
        this.isLoading = false
        this.error = true
        console.error(err)
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

<i18n locale="fr">
{
  "title": "Mes accès",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun accès"
}
</i18n>
