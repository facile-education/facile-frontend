<template>
  <div class="details-tab">
    <div
      v-if="group.expirationDate"
      class="expiration-date"
    >
      {{ $t('Groups.GroupDetailsTab.expire') + formattedDate }}
    </div>

    <p
      v-if="group.description !== '' && !group.isGroupRootFolder"
      class="description"
    >
      {{ group.description }}
    </p>

    <div
      v-if="!group.isExpired && !group.isGroupRootFolder"
      class="actions"
    >
      <RouterLink
        :to="documentRoute"
      >
        <img
          src="@assets/icons/folder.svg"
          alt="image"
        >
        <span v-t="'Groups.GroupDetailsTab.accessToDocuments'" />
      </RouterLink>
    </div>

    <div
      class="member-list"
      :class="{'phone': mq.phone}"
    >
      <WeprodeSpinner v-if="memberLoading" />
      <div v-else>
        <div class="member-list-header">
          <img
            src="@assets/icons/users.svg"
            alt="icon_commu"
          >
          <span>
            {{ $tc('Groups.GroupDetailsTab.members', members.length) }}
          </span>
        </div>
        <div class="members-details">
          <MemberPack
            v-if="adminMembers.length > 0"
            :title="$tc('Groups.GroupDetailsTab.admins', adminMembers.length)"
            :member-list="adminMembers"
          />
          <MemberPack
            v-if="teachersMembers.length > 0"
            :title="$tc('Groups.GroupDetailsTab.teachers', teachersMembers.length)"
            :member-list="teachersMembers"
          />
          <MemberPack
            v-if="studentMembers.length > 0"
            :title="$tc('Groups.GroupDetailsTab.students', studentMembers.length)"
            :member-list="studentMembers"
          />
          <MemberPack
            v-if="parentMembers.length > 0"
            :title="$tc('Groups.GroupDetailsTab.parents', parentMembers.length)"
            :member-list="parentMembers"
          />
          <MemberPack
            v-if="othersMembers.length > 0"
            :title="$tc('Groups.GroupDetailsTab.others', othersMembers.length)"
            :member-list="othersMembers"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MemberPack from '@components/Groups/GroupDetailsPanel/DetailsTab/MemberPack'
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import { getCommunityMembers } from '@/api/groups.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'

export default {
  name: 'GroupDetailsTab',
  components: { MemberPack, WeprodeSpinner },
  inject: ['mq'],
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      members: [],
      adminMembers: [],
      parentMembers: [],
      studentMembers: [],
      teachersMembers: [],
      othersMembers: [],
      memberLoading: false
    }
  },
  computed: {
    documentRoute () {
      return '/documents/groups/' + this.group.rootFolderId
    },
    formattedDate () {
      return dayjs(this.group.expirationDate, DATE_EXCHANGE_FORMAT).format('DD MMM YYYY')
    }
  },
  watch: {
    group: {
      handler () {
        this.getMembers()
      }
    }
  },
  created () {
    this.getMembers()
  },
  methods: {
    publishNews () {
      // TODO
    },
    getMembers () {
      this.memberLoading = true
      getCommunityMembers(this.group.groupId).then((data) => {
        this.memberLoading = false
        if (data.success) {
          this.members = data.members
          this.adminMembers.length = 0
          this.teachersMembers.length = 0
          this.studentMembers.length = 0
          this.parentMembers.length = 0
          this.othersMembers.length = 0
          this.members.forEach((member) => {
            if (member.isAdmin) {
              this.adminMembers.push(member)
            }
            if (member.isTeacher) {
              this.teachersMembers.push(member)
            } else if (member.isStudent) {
              this.studentMembers.push(member)
            } else if (member.isParent) {
              this.parentMembers.push(member)
            } else {
              this.othersMembers.push(member)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.details-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.expiration-date {
  margin-top: 20px;
  font-weight: 600;
}

.description {
  margin-top: 20px;
}

.actions {
  margin-top: 20px;
  border-top: 1px solid $color-border;
  border-bottom: 1px solid $color-border;
  padding: 10px 0;

  a {
    display: flex;
    height: 40px;
    align-items: center;
    line-height: 10px;
    font-weight: 600;

    img {
      margin-right: 10px;
      height: 30px;
      width: 30px;
    }
  }
}

.member-list {
  position: relative;
  margin-top: 20px;
  flex: 1;

  &.phone {
    .member-list-header {
      img {
        height: 35px;
        width: 35px;
      }
    }
  }
}

.member-list-header {
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  align-items: center;
  margin-bottom: 3px;

  img {
    margin-right: 10px;
    height: 30px;
    width: 30px;
  }
}

.members-details {
  margin-left: 40px;
}

</style>
