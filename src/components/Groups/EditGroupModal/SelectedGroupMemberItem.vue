<template>
  <div
    class="selected-group-member-item"
  >
    <div class="name">
      <div> {{ member.userName ? member.userName : member.nom }}</div>
      <img
        v-if="!isCurrentMember && isCurrentGroupAdmin"
        class="close-button"
        src="@assets/big-cross-black.svg"
        :alt="$t('delete')"
        :title="$t('delete')"
        @click="removeUser"
      >
    </div>
    <div class="is-admin">
      <PentilaToggleSwitch
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
export default {
  name: 'SelectedGroupMemberItem',
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

    img {
      height: 14px;
      width: 14px;
      cursor: pointer;
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
