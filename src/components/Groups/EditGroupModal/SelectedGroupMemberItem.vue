<template>
  <div
    class="selected-group-member-item"
  >
    <div class="name">
      <div> {{ fullName }}</div>
      <button
        v-if="!isCurrentMember && isCurrentGroupAdmin"
        @click="removeUser"
      >
        <CustomIcon
          icon-name="icon-cross-L"
          class="icon"
        />
      </button>
    </div>
    <div class="is-admin">
      <WeprodeToggleSwitch
        v-model="adminValue"
        :title="$t('admin')"
        :disabled="isCurrentMember || !isCurrentGroupAdmin"
        @update:modelValue="toggleAdminStatus"
      />
      <span>{{ $t(adminValue.toString()) }}</span>
    </div>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

import WeprodeToggleSwitch from '@/components/Base/Weprode/WeprodeToggleSwitch.vue'

export default {
  name: 'SelectedGroupMemberItem',
  components: { CustomIcon, WeprodeToggleSwitch },
  props: {
    member: {
      type: Object,
      required: true
    },
    isCurrentMember: {
      type: Boolean,
      required: true
    },
    isCurrentGroupAdmin: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggleAdmin', 'remove'],
  data () {
    return {
      adminValue: this.member.isAdmin
    }
  },
  computed: {
    fullName () {
      return `${this.member.lastName} ${this.member.firstName}`
    }
  },
  watch: {
    member: {
      deep: true,
      handler (value) {
        this.adminValue = value.isAdmin
      }
    }
  },
  methods: {
    toggleAdminStatus () {
      this.$emit('toggleAdmin')
    },
    removeUser () {
      // todo
      this.$emit('remove')
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
    }

    button {
      margin: 0;
      padding: 0;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      background: transparent;

      .icon {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }

  }

  .is-admin {
    display: flex;
    align-items: center;

    span {
      width: 30px;
      margin-left: 10px;
    }
  }

}
</style>
<i18n locale="fr">
{
  "false": "Non",
  "true": "Oui",
  "admin": "Administrateur",
  "delete": "Supprimer l'utilisateur"
}
</i18n>
