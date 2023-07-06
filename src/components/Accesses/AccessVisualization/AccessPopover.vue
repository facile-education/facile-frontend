<template>
  <div
    class="access-popover"
    :class="{'phone': mq.phone}"
  >
    <div class="popover-content">
      <button
        class="close-button"
        :title="$t('close')"
        :aria-label="$t('close')"
        @click="onClose"
      >
        <img
          src="@/assets/big-cross-black.svg"
          alt="close"
        >
      </button>
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
    </div>
  </div>
</template>

<script>
import UserAccessCategory from '@components/Accesses/AccessVisualization/UserAccessCategory.vue'
import { sortAccesses } from '@utils/accessUtils'

import { getUserAccesses } from '@/api/access.service'

export default {
  name: 'AccessPopover',
  components: { UserAccessCategory },
  inject: ['mq'],
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
    this.getUserAccesses()
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        if (!this.isInformationModalDisplayed && !this.isPreferencesDisplayed && !this.isSupportModalDisplayed) {
          this.$emit('close')
        }
      }
    },
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
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.access-popover {
  color: $color-dark-text;
  position: absolute;
  right: 0;
  top: 46px;
  width: min(542px, 90vw);
  height: 292px;
  background-color: white;
  padding: 0;
  z-index: $popup-z-index;
  border: 1px solid $neutral-40;
  @extend %object-shadow-2;

  &.phone {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
}

.popover-content {
  position: relative;
  height: 100%;
  width: 100%;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;

  img {
    height: 1rem;
  }
}

ul {
  margin: 0;
  overflow-y: auto;
  padding: 1.5rem;
  list-style-type: none;
  height: 100%;
  width: 100%;

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
  "AccessesOf": "Accès des {roleLabel}",
  "errorPlaceholder": "Oups, une erreur est survenue...",
  "emptyPlaceholder": "Aucun accès"
}
</i18n>
