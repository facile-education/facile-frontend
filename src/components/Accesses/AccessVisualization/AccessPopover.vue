<template>
  <div
    class="access-popover"
    :class="{'phone': mq.phone}"
  >
    <div class="popover-content">
      <button
        class="close-button"
        :title="$t('Accesses.AccessPopover.close')"
        :aria-label="$t('Accesses.AccessPopover.close')"
        @click="onClose"
      >
        <CustomIcon
          icon-name="icon-cross-L"
          class="icon"
        />
      </button>
      <WeprodeSpinner
        v-if="isLoading"
        style="z-index: 1"
      />
      <div
        v-if="error === true"
        v-t="'Accesses.AccessPopover.errorPlaceholder'"
        class="placeholder"
      />
      <div
        v-else-if="categoryList && categoryList.length === 0"
        v-t="'Accesses.AccessPopover.emptyPlaceholder'"
        class="placeholder"
      />
      <ul v-else-if="categoryList">
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import { sortAccesses } from '@utils/accessUtils'

import { getUserAccesses } from '@/api/access.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'AccessPopover',
  components: { CustomIcon, UserAccessCategory, WeprodeSpinner },
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      isLoading: false,
      error: false,
      categoryList: undefined
    }
  },
  computed: {
    sortedCategoryList () {
      return this.categoryList ? sortAccesses(this.categoryList) : undefined
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

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: auto;
  margin-top: 20px;
}

.access-popover {
  color: $color-dark-text;
  position: absolute;
  right: 0;
  top: 46px;
  width: min(542px, 90vw);
  background-color: white;
  padding: 0;
  z-index: $popup-z-index;
  border: 1px solid $neutral-40;
  border-radius: 4px;
  min-height: 60px;
  @extend %object-shadow-2;

  &.phone {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    ul {
      max-height: 100%;
    }
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
  display: flex;
  align-items: center;

  .icon {
    font-size: 1.4rem;
    font-weight: bold;
  }
}

ul {
  margin: 0;
  overflow-y: auto;
  padding: 1.5rem;
  list-style-type: none;
  height: 100%;
  min-height: 292px;
  max-height: 600px;
  width: 100%;

  li {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
