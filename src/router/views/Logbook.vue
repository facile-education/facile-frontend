<template>
  <ServicesWrapper
    :is-title-visible="true"
    :title="$t('Logbook.serviceTitle')"
  >
    <div class="header">
      <EntriesFilter v-if="isTeacher || isDirector || isSecretariat || isParent" />
      <WeprodeButton
        v-if="isTeacher || isDirector || isSecretariat"
        class="create-button"
        @click="openEntriesEditModal"
      >
        <CustomIcon icon-name="icon-plus" />
        <span>{{ $t('Logbook.newEntryButtonLabel') }}</span>
      </WeprodeButton>
    </div>
    <EntriesList :is-entry-created="isEntryCreated" />
  </ServicesWrapper>
  <teleport to="body">
    <EntriesEditModal
      v-if="isDisplayEditModal"
      @close="isDisplayEditModal = false"
      @entry-created="setIsEntryCreated"
    />
  </teleport>
</template>

<script>

import CustomIcon from '@components/Base/CustomIcon.vue'

import WeprodeButton from '@/components/Base/Weprode/WeprodeButton.vue'

import EntriesEditModal from '../../components/Logbook/EntriesEditModal.vue'
import EntriesFilter from '../../components/Logbook/EntriesFilter.vue'
import EntriesList from '../../components/Logbook/EntriesList.vue'
import ServicesWrapper from '../../components/ServicesWrapper/ServicesWrapper.vue'

export default {
  name: 'Course',
  components: {
    ServicesWrapper,
    EntriesEditModal,
    EntriesFilter,
    WeprodeButton,
    EntriesList,
    CustomIcon
  },
  emits: ['update:layout'],
  data () {
    return {
      isDisplayEditModal: false,
      isEntryCreated: false
    }
  },
  computed: {
    isTeacher () {
      return this.$store.state.user.isTeacher
    },
    isDirector () {
      return this.$store.state.user.isDirectionMember
    },
    isSecretariat () {
      return this.$store.state.user.isSecretariat
    },
    isParent () {
      return this.$store.state.user.isParent
    }
  },
  beforeCreate () {
    this.$emit('update:layout', 'BannerLayout')
  },
  methods: {
    openEntriesEditModal () {
      this.isDisplayEditModal = true
    },
    setIsEntryCreated () {
      this.isEntryCreated = true
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@design';

.header{
  display: flex;
  justify-content: space-between;
  gap: 10px;
  button{
    height: fit-content;
  }
}

.create-button {
  @extend %create-button;
}

.first-line{
  margin-bottom: 0.5rem;
  display: flex;
}
</style>
