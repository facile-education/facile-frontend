<template>
  <div class="entries-list-item">
    <div
      v-if="isParent && !isCurrentParentSigned && isAllParentsRequired && data.limitDate > currentDate"
      class="pellet theme-background-color"
    />
    <div
      v-else-if="isParent && !isAllParentsRequired && !isOneParentSigned"
      class="pellet theme-background-color"
    />
    <div
      class="left"
      :class="(isParent || isStudent) && 'student-parent-display'"
    >
      <p class="entry-type">
        {{ activityType }}
      </p>
      <h2 data-test="entry-title">
        {{ data.title }}
      </h2>
      <p
        class="content"
        v-html="data.content"
      />
      <div class="publication-infos">
        <p>{{ publicationDate }}</p>
        <a
          href="#"
          class="toggle-user-card"
          data-test="author"
          @click.stop="openUserCardModal(data.author)"
        >
          {{ data.author.userName }}
        </a>
      </div>
    </div>
    <div class="separation" />
    <div
      class="right"
      :class="(isParent || isStudent) && 'student-parent-display'"
    >
      <ParentsStudentsSigningSection
        v-if="isParent || isStudent"
        :data="data"
        @signed="$emit('signed')"
      />
      <AgentsSigningSection
        v-else
        :data="data"
        :is-student-entries="isStudentEntries"
        @refresh="$emit('refresh')"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import AgentsSigningSection from '@/components/Logbook/AgentsSigningSection'
import ParentsStudentsSigningSection from '@/components/Logbook/ParentsStudentSigningSection.vue'
import logbookConstants from '@/constants/logbookConstants'

export default {
  name: 'EntriesListItem',
  components: {
    ParentsStudentsSigningSection,
    AgentsSigningSection
  },
  props: {
    data: {
      type: Object,
      default: undefined
    },
    isStudentEntries: {
      type: Boolean,
      default: false
    }
  },
  emits: ['signed', 'refresh'],
  data () {
    return {
      currentDate: dayjs().format(DATE_EXCHANGE_FORMAT),
      authorization: '',
      isDisplayEditModal: false
    }
  },
  computed: {
    publicationDate () {
      return this.$t('Logbook.entriesItem.entryPublicationDate', { date: this.formateDate(this.data.modificationDate) })
    },
    isStudent () {
      return this.$store.state.user.isStudent
    },
    isParent () {
      return this.$store.state.user.isParent
    },
    currentUser () {
      return this.$store.state.user
    },
    isCurrentParentSigned () {
      const currentParent = this.data.parents.find((parent) => parent.userId === this.currentUser.userId)
      return currentParent.hasSigned
    },
    activityType () {
      if (this.data.type === logbookConstants.ENTRY_TYPE_INFORMATION) {
        return this.$t('Logbook.entriesItem.entryTypeInformation')
      } else if (this.data.type === logbookConstants.ENTRY_TYPE_AUTHORIZATION) {
        return this.$t('Logbook.entriesItem.entryTypeAuthorization')
      } else {
        return this.$t('Logbook.entriesItem.entryTypeObservation')
      }
    },
    isOneParentSigned () {
      return this.data.parents.some(parent => parent.hasSigned)
    },
    isOneNotAuthorized () {
      return this.data.parents.some(parent => !parent.hasAuthorized && parent.hasSigned)
    },
    isAllParentsRequired () {
      return this.data.parents.every(parent => parent.isMandatory)
    }
  },
  methods: {
    formateDate (date) {
      return dayjs(date).format('DD/MM/YY')
    },
    openUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.entries-list-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-radius: 6px;
  border: 1px solid $neutral-40;
  background: $neutral-10;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.10);
  width: 100%;

  .pellet {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    border: 3px solid $neutral-10;
    border-radius: 100%;
  }

  .left {
    width: calc(100% - 250px);
    &.student-parent-display{
      width: 50%;
      max-width: 50%;
    }

    .entry-type {
      @extend %font-regular-m;
      color: $neutral-80;
      background-color: $neutral-20;
      padding: 2px 8px;
      margin: 0;
      border-radius: 6px;
      width: fit-content;
      margin-bottom: 8px
    }

    h2 {
      max-width: 70%;
      word-wrap: break-word;
      margin: 0;
      @extend %font-heading-xs;
    }

    .content {
      margin: 0;
      word-wrap: break-word;
      @extend %font-regular-m;
    }

    .publication-infos {
      display: flex;
      gap: 8px;

      a,
      p {
        margin: 0;
        @extend %font-regular-xs;
        color: $neutral-80;
      }
    }
  }

  .separation {
    height: auto;
    width: 1px;
    background: #E0E0E0;
  }

  .right {
    align-self: center;
    padding: 0 16px;
    min-width: 250px;
    &.student-parent-display{
      width: 50%;
    }
  }
}

@media screen and (max-width: 1080px) {
  .entries-list-item {
    flex-direction: column;

    .left{
      width: 100%;
      &.student-parent-display{
      width: 100%;
      max-width: 100%;
    }
    }

    .separation {
      height: 1px;
      width: 100%;
      background: #E0E0E0;
    }

    .right {
      align-self: flex-start;
      padding: 0;
      width: 100%;
      &.student-parent-display{
      width: 100%;
    }
    }
  }
}
</style>
