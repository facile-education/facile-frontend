<template>
  <div class="member-pack">
    <div
      class="title"
      @click="toggleCollapse"
    >
      <span>{{ memberList.length + ' ' + title }}</span>
      <img
        :class="isCollapsed ? 'extend': 'collapse'"
        src="@assets/arrow-right.svg"
        :alt="isCollapsed ? $t('unCollapse') : $t('collapse')"
        :title="isCollapsed ? $t('unCollapse') : $t('collapse')"
      >
    </div>

    <div
      v-if="!isCollapsed"
      class="member-list"
    >
      <DetailsTabMember
        v-for="(member, index) in sortedMemberList"
        :key="index"
        :member="member"
      />
    </div>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'
const DetailsTabMember = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/DetailsTab/DetailsTabMember'))

export default {
  name: 'MemberPack',
  components: { DetailsTabMember },
  props: {
    title: {
      type: String,
      required: true
    },
    memberList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isCollapsed: true
    }
  },
  computed: {
    sortedMemberList () {
      return PentilaUtils.Array.sortWithString(this.memberList, false, 'userName')
    }
  },
  methods: {
    toggleCollapse () {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  width: 300px;
  max-width: 95%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .collapse, .extend {
    width: 10px;
    transition:  transform .3s;
    cursor: pointer;
  }

  .extend {
    transform: rotate(0);
  }

  .collapse {
    transform: rotate(90deg);
  }
}

.member-list {
  margin-left: 20px;
}
</style>

<i18n locale="fr" >
{
  "collapse": "replier",
  "unCollapse": "déplier"
}
</i18n>
