<template>
  <div
    class="session-edit"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <!-- Header -->
    <div
      class="header"
    >
      <div
        class="item-title"
      >
        <span
          class="label"
        >{{ getTitle() }}</span>

        <!-- Cours box -->
        <div
          class="cours"
          :style="getColor()"
        >
          <span
            v-if="assignment !== undefined"
            class="group-name"
          >{{ assignment.groupName }}</span>
        </div>

        <!-- Cours or homework date -->
        <span
          v-if="assignment !== undefined"
          class="session-date"
        >{{ getDate() }}</span>
      </div>

      <img
        class="close-button"
        src="@assets/big-cross-black.svg"
        :alt="$t('close')"
        :title="$t('close')"
        @click="closeSessionContentEdit"
      >
    </div>

    <ProgressionItem
      v-if="item !== undefined"
      :item="item"
      :is-specific-item="true"
      class="item-content"
    />

    <div
      class="footer"
    >
      <PentilaButton
        :label="$t('cancel')"
        cls="cancel"
        class="button cancel-button"
        @click="closeSessionContentEdit"
      />
      <PentilaButton
        :disabled="isWaiting"
        :label="$t('save')"
        class="button create-button"
        @click="saveContent()"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

import { getHomeworkSpecificContents, getSessionSpecificContents } from '@/api/progression.service'
import ProgressionItem from '@/components/Progression/Edit/ProgressionItem'

export default {
  name: 'SessionContentEditPanel',
  components: { ProgressionItem },
  inject: ['mq'],
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    assignment () {
      return this.$store.state.progression.editedAssignment
    },
    item () {
      return this.$store.state.progression.editedItem
    },
    isWaiting () {
      return this.$store.state.progression.isWaiting
    }
  },
  created () {
    if (this.assignment.homeworkId !== 0) {
      getHomeworkSpecificContents(this.assignment.homeworkId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('progression/setEditedItem', data.item)
          }
        },
        (err) => { console.error(err) })
    } else {
      getSessionSpecificContents(this.assignment.sessionId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('progression/setEditedItem', data.item)
          }
        },
        (err) => { console.error(err) })
    }
  },
  methods: {
    closeSessionContentEdit () {
      this.$store.dispatch('progression/setSessionContentEditMode', false)
      this.$store.dispatch('progression/setEditedAssignment', undefined)
      this.$store.dispatch('progression/setEditedItem', undefined)
    },
    saveContent () {
      if (this.assignment.homeworkId !== 0) {
        this.$store.dispatch('progression/saveHomeworkSpecificItem', { homeworkId: this.assignment.homeworkId })
      } else {
        this.$store.dispatch('progression/saveSessionSpecificItem', { sessionId: this.assignment.sessionId })
      }
      this.$store.dispatch('progression/getProgressionContent', { progressionId: this.$route.params.progressionId })
      this.closeSessionContentEdit()
    },
    getTitle () {
      if (this.assignment !== undefined) {
        if (this.assignment.homeworkId !== 0) {
          return this.$t('edit-homework')
        } else {
          return this.$t('edit-session')
        }
      }
      return ''
    },
    getDate () {
      if (this.assignment !== undefined) {
        return 'du ' + dayjs(this.assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('DD MMMM') +
        ' de ' + dayjs(this.assignment.sessionStartDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm') +
        ' à ' + dayjs(this.assignment.sessionEndDate, 'YYYY-MM-DD HH:mm').format('HH[h]mm')
      }
      return ''
    },
    getColor () {
      if (this.assignment !== undefined) {
        return 'background-color: ' + this.assignment.color + '50' // 50 is for opacity
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.session-edit {
  .header {
    display: block ruby;
    justify-content: space-between;
    margin-top: 20px;
    margin-bottom: 10px;
    height: 30px;
    .item-title {
      margin-left: 20px;
      display: flex;
      flex-basis: content;
      .cours {
        margin-left: 10px;
        border: 1px solid black;
        .group-name {
          margin-left: 10px;
          margin-right: 10px;
          margin: 3px;
          font-size: 14px;
        }
      }
      .session-date {
        margin-left: 10px;
      }
    }
    .close-button {
      float: right;
      margin: auto;
      width: 30px;
      height: 30px;
      border: 1px solid transparent;
      border-radius: 5px;
      padding: 5px;
      margin: 0 30px 5px 5px;

      &:hover {
        border: 1px solid grey;
        cursor: pointer;
      }
    }
  }
  .item-content {
    margin-left: 10px;
    width: 98%;
  }
  .footer {
    display: flex;
    justify-content: space-around;
    width: 500px;
    margin: auto;
    margin-top: 20px;
    z-index: 10;
    .button {
      width: 200px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "edit-homework": "Modifier le contenu du devoir donné pendant le cours ",
  "edit-session": "Modifier le contenu du cours ",
  "save": "Enregistrer",
  "close": "Fermer",
  "cancel": "Annuler"
}
</i18n>
