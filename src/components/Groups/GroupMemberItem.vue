<template>
  <div
    class="group-member-item"
    :class="{'selected' : isSelected}"
    @click="toggleMemberSelection"
  >
    <PentilaCheckbox
      v-model="test"
      class="checkbox"
    />
    <div> {{ member.userName }}</div>
    <div> {{ member.roles }} </div>
    <div> {{ formattedSchoolLabel }} </div>
  </div>
</template>

<script>
export default {
  name: 'GroupMemberItem',
  props: {
    member: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggleMemberSelection'],
  data () {
    return {
      test: false
    }
  },
  computed: {
    formattedSchoolLabel () {
      let label = ''
      if (this.member.schools) {
        this.member.schools.forEach((school) => {
          label += school.schoolName + ' '
        })
      }
      return label
    }
  },
  methods: {
    toggleMemberSelection () {
      this.$emit('toggleMemberSelection')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.group-member-item {
  display: flex;
  align-items: center;
  border-top: 1px solid #d4d4d4;
  height: 50px;

  &.selected {
    background-color: #0B5FFF;
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
