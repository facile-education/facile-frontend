<template>
  <WeprodeWindow
    class="create-link-modal"
    :class="{'phone': mq.phone || mq.tablet}"
    :full-screen="mq.phone || mq.tablet"
    data-test="create-link-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span> {{ modalTitle }}</span>
    </template>
    <template #body>
      <WeprodeSpinner
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
  </WeprodeWindow>
</template>

<script>
import UserAccessCategory from '@components/Accesses/AccessVisualization/UserAccessCategory.vue'
import { sortAccesses } from '@utils/accessUtils'

import { getUserAccesses } from '@/api/access.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'AccessModal',
  components: { UserAccessCategory, WeprodeSpinner, WeprodeWindow },
  inject: ['mq'],
  props: {
    initCategoryList: {
      type: Array,
      default: undefined
    },
    concernedRole: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  data () {
    return {
      isLoading: false,
      error: false,
      categoryList: []
    }
  },
  computed: {
    modalTitle () {
      if (this.concernedRole) {
        return this.$t('AccessesOf', { roleLabel: this.concernedRole.displayText.toLowerCase() })
      } else {
        return this.$t('myAccesses')
      }
    },
    sortedCategoryList () {
      return sortAccesses(this.categoryList)
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    if (this.initCategoryList) {
      this.categoryList = this.initCategoryList
    } else {
      this.getUserAccesses()
    }
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
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

<i18n locale="fr">
{
  "myAccesses": "Mes accès",
  "AccessesOf": "Accès d'un.e {roleLabel}",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun accès"
}
</i18n>
