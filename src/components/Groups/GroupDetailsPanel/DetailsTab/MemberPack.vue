<template>
  <div class="member-pack">
    <div
      class="title"
      tabindex="0"
      :title="isCollapsed ? $t('Groups.MemberPack.unCollapse') : $t('Groups.MemberPack.collapse')"
      :aria-label="isCollapsed ? $t('Groups.MemberPack.unCollapse') : $t('Groups.MemberPack.collapse')"
      @click="toggleCollapse"
      @keyup.enter="toggleCollapse"
    >
      <span class="count">{{ memberList.length }}</span>
      <span>{{ ' ' + title }}</span>
      <CustomIcon
        :class="isCollapsed ? 'extend': 'collapse'"
        :icon-name="'icon-chevron-right-s'"
      />
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
import CustomIcon from '@components/Base/CustomIcon.vue'
import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'
const DetailsTabMember = defineAsyncComponent(() => import('@components/Groups/GroupDetailsPanel/DetailsTab/DetailsTabMember'))

export default {
  name: 'MemberPack',
  components: { CustomIcon, DetailsTabMember },
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
      return WeprodeUtils.sortArrayWithString(this.memberList, false, 'lastName')
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

  &:hover {
    cursor: pointer;
  }
}

.count {
  width: 30px;
  text-align: center;
}

span {
  margin-right: 5px;
}

.collapse, .extend {
  width: 8px;
  transition:  transform .3s;
  cursor: pointer;
  margin-left: 5px;
}

.icon-chevron-right-s {
  font-size: 1.12rem;
  width: 1.12rem;
}

.extend {
  transform: rotate(0);
}

.collapse {
  transform: rotate(90deg);
}

.member-list {
  margin-left: 35px;
}
</style>
