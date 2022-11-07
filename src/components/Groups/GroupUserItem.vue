<template>
  <div
    class="group-user-item"
    :class="{'selected' : isSelected}"
    @click.stop="toggleUserSelection"
  >
    <PentilaCheckbox
      :model-value="isSelected"
      label=""
      class="checkbox"
      @click.stop
      @update:modelValue="toggleUserSelection"
    />
    <div> {{ user.nom }}</div>
    <div> {{ user.roles }} </div>
    <div> {{ user.schoolName }} </div>
  </div>
</template>

<script>
export default {
  name: 'GroupUserItem',
  props: {
    user: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggleUserSelection'],
  isSelected: {
    handler () {
      this.test = this.isSelected
    }
  },
  computed: {
    // formattedSchoolLabel () {
    //   let label = ''
    //   if (this.user.schools) {
    //     this.user.schools.forEach((school) => {
    //       label += school.schoolName + ' '
    //     })
    //   }
    //   return label
    // }
  },
  methods: {
    toggleUserSelection () {
      console.log('toggleUserSelection')
      this.$emit('toggleUserSelection')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.group-user-item {
  display: flex;
  align-items: center;
  border-top: 1px solid #d4d4d4;
  height: 50px;
  min-height: 50px;
  cursor: pointer;

  &.selected {
    background-color: $color-selected-sub-message;
  }

  .checkbox {
    margin-top: -20px;
  }

  div {
    width: 100px;
    font-size: 12px;
  }
}

</style>
