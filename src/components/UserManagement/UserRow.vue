<template>
  <div
    class="user-row"
    :class="{'hoverable': isHoverable}"
  >
    <div
      v-for="(field, index) in fields"
      :key="index"
      class="field"
    >
      <WeprodeCheckbox
        v-if="field === 'isSchoolAdmin'"
        :model-value="user.isSchoolAdmin"
        class="checkbox"
        :disabled="user.isDirection || user.userId === currentUser.userId"
        label=""
        @update:model-value="toggleSchoolAdmin"
      />
      <WeprodeCheckbox
        v-else-if="field === 'isNewsDelegate'"
        :model-value="user.isNewsDelegate"
        class="checkbox"
        :disabled="user.isDirection"
        label=""
        @update:model-value="toggleNewsDelegate"
      />
      <span v-else-if="field === 'affectations'">
        {{ nbAffectations }}
      </span>
      <span v-else>
        {{ user[field] }}
      </span>
    </div>
    <a
      href="#"
      style="color: black;"
      class="toggle-user-card"
      @click.stop="openUserCardModal"
    >
      <CustomIcon
        class=".icon-user-24"
        :icon-name="'icon-user-24'"
      />
    </a>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import WeprodeCheckbox from '@/components/Base/Weprode/WeprodeCheckbox.vue'

const CustomIcon = defineAsyncComponent(() => import('@components/Base/CustomIcon.vue'))
export default {
  name: 'UserRow',
  components: { WeprodeCheckbox, CustomIcon },
  props: {
    fields: {
      type: Array,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    isHoverable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggleSchoolAdmin', 'toggleNewsDelegate'],
  computed: {
    currentUser () {
      return this.$store.state.user
    },
    nbAffectations () {
      return this.user.affectations === undefined ? 0 : this.user.affectations.length
    }
  },
  methods: {
    toggleSchoolAdmin () {
      this.$emit('toggleSchoolAdmin')
    },
    toggleNewsDelegate () {
      this.$emit('toggleNewsDelegate')
    },
    openUserCardModal () {
      this.$store.dispatch('userCard/initUserCard', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.user-row {
  height: 40px;
  width: 100%;
  border-top: 1px solid $color-border;
  display: flex;
  align-items: center;

  &.hoverable {
    cursor: pointer;

    &:hover {
      background-color: $color-hover-bg;
    }
  }

  .field {
    flex: 1;
    margin: auto;
  }
  .toggle-user-card {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    font-size: 1.4rem;
    border: solid 1px;
    padding: 2px;
    border-radius: 5px;
    &:hover{
      text-decoration: none;
    }
  }
}
</style>
