<template>
  <div>
    <div
      class="account-label"
      @click="selectAccount">
      <div
        class="caret"
        @click="toggleBoxListDiplay">
        <i
          :class="{'fa-caret-down': showBoxList, 'fa-caret-right': !showBoxList}"
          class="fa"/>
      </div>
      <span>{{ box.emailAddress }}</span>
    </div>
    <ul v-if="showBoxList">
      <li>{{ box.subFolder.inbox.boxeLabel }}</li>
      <li>{{ box.subFolder.draft.boxeLabel }}</li>
      <li>{{ box.subFolder.outbox.boxeLabel }}</li>
      <li>{{ box.subFolder.trash.boxeLabel }}</li>
      <li>{{ box.subFolder.folder.boxeLabel }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BoxItem',
  props: {
    box: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showBoxList: false
    }
  },
  methods: {
    toggleBoxListDiplay () {
      this.showBoxList = !this.showBoxList
    },
    selectAccount () {
      console.log('On select account')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.account-label {
  @extend %nero-menu-item;

  span {
    display: inline-block;
    padding: 5px 0 5px 12px;
  }
}

.caret {
  padding: 5px 0 5px 12px;
  display: inline-block;
}
</style>
