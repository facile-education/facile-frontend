<template>
  <section
    class="containerUserCardHHC"
    data-test="UserCardHHC"
  >
    <h2>
      <CustomIcon
        class="hhc-icon"
        :icon-name="'icon-clock'"
      />
      <span>{{ $t('hhcTitle') }}</span>
    </h2>
    <ul class="content">
      <li
        v-for="(item, index) in userSchoolLifeStats"
        :key="index"
      >
        {{ item.number }} {{ slotType(item.type).label }}
      </li>
    </ul>
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import notUsualSlotsConstants from '@/constants/notUsualSlots'
const CustomIcon = defineAsyncComponent(() => import('@components/Base/CustomIcon.vue'))
export default {
  name: 'UserCardHHC',
  components: {
    CustomIcon
  },
  props: {
    userSchoolLifeStats: {
      type: Array,
      required: true
    }
  },
  methods: {
    slotType (slotType) {
      return notUsualSlotsConstants.getSlotTypeByNumber(slotType)
    }
  }

}
</script>

<style lang="scss" scoped>

@import "@design";
.containerUserCardHHC {
  margin-top: 32px;
  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    margin-bottom: 8px;
    @extend %font-regular-l;
  }
  .hhc-icon{
    font-size: 1.5rem;
  }
}
.content {
  margin-left: 16px;
  padding: 0;
  li{
    list-style: none;
    @extend %font-regular-m;
    margin-bottom: 5px;
  }
}
</style>

<i18n locale="fr">
    {
      "hhcTitle": "Horaires hors cadre",
    }
</i18n>
