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
      <span>{{ $t('UserCard.UserCardHHC.hhcTitle') }} <span v-if="isUserSchoolLifeStatsEmpty">: Aucun</span></span>
    </h2>
    <ul
      class="content"
      :class="{ 'mobile': mq.phone}"
    >
      <li
        v-for="(item, index) in filteredUserSchoolLifeStats"
        :key="index"
        :class="{ 'inactive': item.number === 0 }"
      >
        <span>{{ item.number }}</span>
        {{ slotType(item.type).label }}
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
  inject: ['mq'],
  props: {
    userSchoolLifeStats: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredUserSchoolLifeStats () {
      return this.userSchoolLifeStats.filter(item => item.type !== 5)
    },
    isUserSchoolLifeStatsEmpty () {
      return this.filteredUserSchoolLifeStats.every(item => item.number === 0)
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
  margin: 16px;
  display: flex;
  justify-content: space-between;
  padding: 0;
  &.mobile{
    margin: 16px 0;
  }
  li{
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    @extend %font-regular-l;
    margin-bottom: 5px;
    &.inactive{
      opacity: 40%;
    }
    span{
      @extend %font-medium-s;
    }
  }
}
</style>
