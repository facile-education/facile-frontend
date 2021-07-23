<template>
  <div>
    <div
      v-if="isTeacher"
      v-t="'CommunicationManager.InternalRoleTab.teacherLabel'"
    />
    <div
      v-if="isPersonal"
      v-t="'CommunicationManager.InternalRoleTab.personalLabel'"
    />
    <div
      v-if="isCollectivity"
      v-t="'CommunicationManager.InternalRoleTab.collectivityLabel'"
    />
    <div
      v-for="right in sortedRightList"
      v-else
      :key="right"
    >
      <PentilaCheckbox
        :value="getValue(right)"
        :label="$t('CommunicationManager.InternalRoleTab.' + removePrefix(right))"
        @input="onInput(right)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternalRoleTab',
  props: {
    role: {
      type: Object,
      required: true
    },
    rightList: {
      type: Object,
      required: true
    }
  },
  emits: ['input'],
  computed: {
    isCollectivity () {
      return (this.rolePrefix === 'n7_')
    },
    isPersonal () {
      return (this.rolePrefix === 'n4_')
    },
    isTeacher () {
      return (this.rolePrefix === 'n3_')
    },
    rolePrefix () {
      // return role prefix (ex: n7)
      return 'n' + this.role.roleCode.split('_')[1] + '_'
    },
    sortedRightList () {
      // student > children > parent > teacher > personal
      return this.selectedRoleRightList.slice().sort((itemA, itemB) => {
        itemA = itemA.toLowerCase()
        itemB = itemB.toLowerCase()
        if (itemA.indexOf('student') > -1 || itemB.indexOf('student') > -1) {
          if (itemA.indexOf('student') > -1 && itemB.indexOf('student') > -1) {
            return (itemB.indexOf('all') > -1) ? -1 : 1
          }
          return (itemA.indexOf('student') > -1) ? -1 : 1
        } else if (itemA.indexOf('children') > -1 || itemB.indexOf('children') > -1) {
          return (itemA.indexOf('children') > -1) ? -1 : 1
        } else if (itemA.indexOf('parent') > -1 || itemB.indexOf('parent') > -1) {
          if (itemA.indexOf('parent') > -1 && itemB.indexOf('parent') > -1) {
            return (itemB.indexOf('all') > -1) ? -1 : 1
          }
          return (itemA.indexOf('parent') > -1) ? -1 : 1
        } else if (itemA.indexOf('teacher') > -1 || itemB.indexOf('teacher') > -1) {
          if (itemA.indexOf('teacher') > -1 && itemB.indexOf('teacher') > -1) {
            return (itemB.indexOf('all') > -1) ? -1 : 1
          }
          return (itemA.indexOf('teacher') > -1) ? -1 : 1
        } else if (itemA.indexOf('personal') > -1 || itemB.indexOf('personal') > -1) {
          return (itemA.indexOf('personal') > -1) ? -1 : 1
        }
        return 1
      })
    },
    selectedRoleRightList () {
      const results = []
      if (this.rolePrefix && this.rightList) {
        let item
        for (item in this.rightList) {
          if (item.startsWith(this.rolePrefix)) {
            results.push(item)
          }
        }
      }
      return results
    }
  },
  methods: {
    getValue (right) {
      return this.rightList[right]
    },
    onInput (right) {
      this.$emit('input', right)
    },
    removePrefix (right) {
      return right.replace(this.rolePrefix, '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
