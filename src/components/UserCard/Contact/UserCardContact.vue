<template>
  <div class="contactInfos">
    <div class="left">
      <p>{{ mail }}</p>
      <p v-if="homePhone">{{ homePhone }} (maison)</p>
      <p v-if="mobilePhone">{{ mobilePhone }} (perso)</p>
      <p v-if="proPhone">{{ proPhone }} (pro)</p>
      <p v-if="address">{{ adress }}</p>
    </div>
    <WeprodeButton
      class="contact-button"
      :cls="''"
      :title="$t('contact')"
    >
      <img
        class="contact-icon"
        src="@/assets/icons/messaging_sent.svg"
        :alt="$t('contact')"
      >
      <span v-t="'Contacter'" />
    </WeprodeButton>
  </div>
</template>

<script>

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'
export default {
  name: 'UserCardContact',
  components: { WeprodeButton },
  props: {
    mail: {
      type: String,
      required: true
    },
    homePhone: {
      type: String
    },
    mobilePhone: {
      type: String
    },
    proPhone: {
      type: String
    },
    address: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>

  @import "@design";
.contactInfos{
    display: flex;
    justify-content: space-between;
    align-items: center;
    p{
    margin: 0;
    @extend %font-regular-m
    }
    .contact-button {
    margin-left: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--Neutral-60, #9E9E9E);
    padding: 6px 8px;

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
</style>

<i18n locale="fr">
  {
    "contact": "Contacter cet utilisateur",
  }
  </i18n>
