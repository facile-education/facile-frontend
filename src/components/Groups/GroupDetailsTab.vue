<template>
  <div class="details-tab">
    <div class="expiration-date">
      {{ $t('expire') + formattedDate }}
    </div>

    <div
      v-if="group.description !== ''"
      class="description"
    >
      {{ group.description }}
    </div>

    <div
      v-if="!group.isExpired"
      class="actions"
    >
      <button @click="publishNews">
        <img
          src="@assets/publish_news.svg"
          alt=""
        >
        <span v-t="'publishNew'" />
      </button>
      <button @click="accessDocuments">
        <img
          src="@assets/fichier_bis.svg"
          alt=""
        >
        <span v-t="'accessToDocuments'" />
      </button>
    </div>

    <div class="member-list">
      <PentilaSpinner v-if="memberLoading" />
      <div v-else>
        <div class="member-list-header">
          <img
            src="@/assets/icon_commu-black.svg"
            alt="icon_commu"
          >
          <span>
            {{ members.length + ' ' + (members.length > 1 ? $t('members') : $t('member')) }}
          </span>
        </div>
        <div class="members-details">
          <MemberPack
            :title="adminMembers.length > 1 ? $t('admins') : $t('admin')"
            :member-list="adminMembers"
          />
          <MemberPack
            :title="teachersMembers.length > 1 ? $t('teachers') : $t('teacher')"
            :member-list="teachersMembers"
          />
          <MemberPack
            :title="othersMembers.length > 1 ? $t('others') : $t('other')"
            :member-list="othersMembers"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getCommunityMembers } from '@/api/groups.service'
import MemberPack from '@components/Groups/MemberPack'

export default {
  name: 'GroupDetailsTab',
  components: { MemberPack },
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
      teachersMembers: [],
      othersMembers: [],
      memberLoading: false
    }
  },
  computed: {
    formattedDate () {
      return dayjs(this.group.expirationDate).format('DD MMM YYYY')
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
      console.log('TODO')
    },
    accessDocuments () {
      this.$router.push('/documents/groups/' + this.group.rootFolderId)
    },
    getMembers () {
      this.memberLoading = true
      getCommunityMembers(this.group.groupId).then((data) => {
        this.memberLoading = false
        if (data.success) {
          this.members = data.members
          this.adminMembers = []
          this.teachersMembers = []
          this.othersMembers = []
          this.members.forEach((member) => {
            if (member.isAdmin) {
              this.adminMembers.push(member)
            } else if (member.isTeacher) {
              this.teachersMembers.push(member)
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

    button {
      display: flex;
      height: 40px;
      background-color: transparent;
      border: none;
      align-items: center;
      line-height: 10px;
      cursor: pointer;
      font-weight: 600;

      img {
        margin-right: 20px;
        height: 30px;
        width: 30px;
      }
    }
  }

  .member-list {
    position: relative;
    margin-top: 20px;
    overflow: auto;
    flex: 1;

    .member-list-header {
      display: flex;
      font-size: 1rem;
      font-weight: 600;
      align-items: center;

      img {
        margin-right: 20px;
      }
    }

    .members-details {
      margin-left: 75px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "expire": "Expire le ",
  "publishNew": "Publier une actualité",
  "accessToDocuments": "Accéder aux documents",
  "member": "Membre",
  "members": "Membres",
  "admin": "Administrateur",
  "admins": "Administrateurs",
  "teacher": "Enseignant",
  "teachers": "Enseignants",
  "other": "Autre",
  "others": "Autres"
}
</i18n>
