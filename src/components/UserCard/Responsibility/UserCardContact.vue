<template>
  <div class="contact-infos">
    <div
      class="top"
      :class="{'phone': mq.phone}"
    >
      <a
        href="#"
        class="theme-text-color toggle-user-card"
        @click="updateUserCardModal(userInfos)"
      >
        {{ `${userInfos.firstName} ${userInfos.lastName}` }}
      </a>
      <WeprodeButton
        v-if="!isCreateMessageModalDisplayed && userInfos.email"
        class="contact-button"
        data-test="SendMessage"
        :cls="''"
        :title="$t('UserCard.UserCardContact.contact')"
        :class="{'phone': mq.phone}"
        @click="$emit('contact')"
      >
        <img
          class="contact-icon"
          src="@assets/icons/sent.svg"
          :alt="$t('UserCard.UserCardContact.contact')"
        >
        <span v-t="'Contacter'" />
      </WeprodeButton>
    </div>
    <div class="bottom">
      <p>{{ userInfos.email }}</p>
      <p v-if="userInfos.homePhone">
        {{ userInfos.homePhone }} {{ `(${$t('UserCard.UserCardContact.homePhone')})` }}
      </p>
      <p v-if="userInfos.mobilePhone">
        {{ userInfos.mobilePhone }} (perso)
      </p>
      <p v-if="userInfos.proPhone">
        {{ userInfos.proPhone }} (pro)
      </p>
      <p v-if="userInfos.address">
        {{ userInfos.address }}
      </p>
    </div>
  </div>
</template>

<script>

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
export default {
  name: 'UserCardContact',
  components: { WeprodeButton },
  inject: ['mq'],
  props: {
    userInfos: {
      type: Object,
      required: true
    }
  },
  emits: ['contact'],
  computed: {
    isCreateMessageModalDisplayed () {
      return this.$store.state.messaging.isCreateMessageModalDisplayed
    }
  },
  methods: {
    updateUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', user)
    }
  }
}
</script>

<style lang="scss" scoped>

@import "@design";
.top{
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  &.phone{
    flex-direction: column;
  }
  a{
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
  }
  .contact-button {
    margin-left: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid $neutral-60;
    padding: 6px 8px;
    background-color: #FFF;
    margin-right: 16px;
  &.phone{
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 0;
  }
  span {
    margin: 0 8px;
    @extend %font-regular-m
  }
  .contact-icon {
    width: 15px;
    height: 15px;
  }
}
}
.bottom{
  p {
    margin: 0;
    @extend %font-regular-m;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
