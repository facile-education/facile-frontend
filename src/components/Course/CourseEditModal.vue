<template>
  <PentilaWindow
    class="edit-course-modal"
    :class="{'phone': mq.phone}"
    :modal="true"
    :draggable="true"
    @close="confirmClosure"
  >
    <template #header>
      <span> {{ formattedTitle }} </span>
    </template>

    <template #body>
      <section class="left">
        <div class="title">
          <PentilaInput
            v-model="sessionContent.title"
            :maxlength="250"
            :placeholder="$t('courseTitle')"
          />
          <PentilaErrorMessage :error-message="formErrorList" />
        </div>

        <Content
          v-for="(block, index) in sessionContent.blocks"
          :key="block.contentId"
          v-model="block.contentValue"
          :content="block"
          :is-edition="true"
          class="content-item"
          @delete="deleteContent(index)"
        />
        <ContentPicker @add="addContent" />
      </section>

      <!-- TODO: right panel (+ mobile gesture) -->
      <!--      <section class="right">-->
      <!--        <PentilaButton-->
      <!--          v-t="'preview'"-->
      <!--          @click="preview"-->
      <!--        />-->
      <!--        <PentilaButton v-t="'previousSession'" />-->
      <!--      </section>-->
    </template>

    <template #footer>
      <PentilaButton
        v-t="'draft'"
        class="draft-button"
        @click="onConfirm(true)"
      />
      <PentilaButton
        v-t="'post'"
        @click="onConfirm(false)"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import { addSessionContent, getSessionPreview, updateSessionContent } from '@/api/course.service'
import ContentPicker from '@/components/Course/ContentPicker.vue'
import contentTypeConstants from '@/constants/contentTypeConstants'

const Content = defineAsyncComponent(() => import('@/components/Course/Content'))

export default {
  name: 'CourseEditModal',
  components: {
    Content,
    ContentPicker
  },
  inject: ['mq'],
  props: {
    editedSession: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    sessionContent: {
      title: { required }
    }
  },
  data () {
    return {
      isCreation: true,
      sessionContent: { blocks: [], title: '' },
      initialForm: undefined
    }
  },
  computed: {
    formattedTitle () {
      const sessionStartDate = dayjs(this.editedSession.startDate, 'YYYY/MM/DD HH:mm')
      return this.$t('title', {
        courseName: this.editedSession.groupName,
        day: sessionStartDate.format('DD/MM'),
        hour: sessionStartDate.format('HH:mm')
      })
    },
    formErrorList () {
      const form = this.v$.sessionContent.title
      if (form.$invalid && form.$dirty) {
        return this.$t('required')
      } else {
        return ''
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')

    if (this.editedSession.sessionContent.title || (this.editedSession.sessionContent.blocks && this.editedSession.sessionContent.blocks.length > 0)) {
      this.sessionContent.title = this.editedSession.sessionContent.title ? this.editedSession.sessionContent.title : ''
      this.sessionContent.blocks = this.editedSession.sessionContent.blocks ? PentilaUtils.JSON.deepCopy(this.editedSession.sessionContent.blocks) : []

      this.isCreation = false
    } else { // isCreation = true
      this.sessionContent.blocks.push({
        contentType: 1, contentValue: '', contentName: '', placeholder: this.$t('description')
      })
    }
    this.initialForm = JSON.stringify(this.sessionContent)
  },
  methods: {
    addContent (content) {
      content.contentId = -1
      this.sessionContent.blocks.push(content)
    },
    deleteContent (index) {
      this.sessionContent.blocks.splice(index, 1)
    },
    preview () {
      getSessionPreview(this.editedSession.sessionId).then((data) => {
        if (data.success) {
          // TODO update selectedDetails ?
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
    },
    onConfirm (isDraft = false) {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.save(isDraft)
      }
    },
    save (isDraft = false) {
      const publicationDate = dayjs().format('YYYY-MM-DD HH:mm')

      // Remove empty text blocks
      this.sessionContent.blocks = this.sessionContent.blocks.filter(block => block.contentType !== contentTypeConstants.TYPE_TEXT_CONTENT || block.contentValue !== '')

      if (this.isCreation) {
        addSessionContent(this.editedSession.groupId, this.editedSession.sessionId, this.sessionContent.title, JSON.stringify(this.sessionContent.blocks), publicationDate, isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionContent')
            this.onClose()
          } else {
            console.error('Cannot create session content')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        },
        (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      } else {
        updateSessionContent(this.editedSession.sessionId, this.sessionContent.title, JSON.stringify(this.sessionContent.blocks), publicationDate, isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionContent')
            this.onClose()
          } else {
            console.error('Cannot update session content')
            this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          }
        },
        (err) => {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('error'), type: 'error' })
          console.error(err)
        })
      }
    },
    confirmClosure () {
      if (JSON.stringify(this.sessionContent) !== this.initialForm) {
        this.$store.dispatch('warningModal/addWarning', {
          text: this.$t('confirmClosure'),
          lastAction: { fct: this.onClose }
        })
      } else {
        this.onClose()
      }
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.edit-course-modal .window-body {
  display: flex;
  padding: 1.5rem 0;
  align-items: flex-start;
  gap: 2rem;
  align-self: stretch;

  overflow: auto;
}

.edit-course-modal {
  &:not(.phone) {
    .window-body {
      max-height: 70vh !important;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@design';

.left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1 0 0;
}

.right {
  display: flex;
  width: 19rem;
  padding: 1.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  align-self: stretch;

  border-radius: 0.375rem;
  background: $neutral-20;
}

.draft-button {
  margin-right: 1.5rem;
}
</style>

<i18n locale="fr">
{
  "draft": "Publier plus tard",
  "title": "Support du cours {courseName} - Séance du {day} à {hour}",
  "courseTitle": "Titre du support*",
  "post": "Publier",
  "preview": "Aperçu",
  "error": "Oups, une erreur est survenue...",
  "previousSession": "Voir la séance précédente",
  "description": "Description",
  "required": "Champ requis",
  "confirmClosure": "Des modifications ne sont pas enregistrées, êtes-vous certain de quitter l’édition et de perdre les modifications ?"
}
</i18n>
