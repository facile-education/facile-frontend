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
        @update:modelValue="toggleSchoolAdmin"
      />
      <WeprodeCheckbox
        v-else-if="field === 'isNewsDelegate'"
        :model-value="user.isNewsDelegate"
        class="checkbox"
        :disabled="user.isDirection"
        label=""
        @update:modelValue="toggleNewsDelegate"
      />
      <span v-else-if="field === 'affectations'">
        {{ nbAffectations }}
      </span>
      <span v-else>
        {{ user[field] }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRow',
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
}
</style>
