<template>
  <div
    class="selected-group-member-item"
  >
    <div class="name">
      <div> {{ member.userName }}</div>
      <img
        class="close-button"
        src="@assets/big-cross-black.svg"
        :alt="$t('close')"
        :title="$t('close')"
        @click="removeUser()"
      >
    </div>
    <PentilaCheckbox
      v-model="test"
      class="checkbox"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectedGroupMemberItem',
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  emits: ['toggleMemberSelection'],
  data () {
    return {
      test: false
    }
  },
  methods: {
    removeUser () {
      // todo
    }
  }
}
</script>

<style lang="scss" scoped>

.selected-group-member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding-left: 10px;

  .checkbox {
    margin-top: -20px;
  }

  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid  #d4d4d4;
    border-radius: 6px;
    height: 35px;
    padding: 10px;

    div {
      width: 200px;
      font-weight: 600;
      color: blue;
    }

    img {
      height: 16px;
      width: 16px;
    }
  }

}
</style>
