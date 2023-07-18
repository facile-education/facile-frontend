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
            v-model="session.title"
            :placeholder="$t('courseTitle')"
          />
          <PentilaErrorMessage :error-message="formErrorList" />
        </div>

        <Content
          v-for="(block, index) in session.blocks"
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
        v-t="'post'"
        @click="onConfirm"
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
    session: {
      title: { required }
    }
  },
  data () {
    return {
      isCreation: true,
      session: { blocks: [], title: '' },
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
      const form = this.v$.session.title
      if (form.$invalid && form.$dirty) {
        return this.$t('required')
      } else {
        return ''
      }
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.session.groupId = this.editedSession.groupId
    this.session.sessionId = this.editedSession.sessionId

    if (this.editedSession.title || (this.editedSession.blocks && this.editedSession.blocks.length > 0)) {
      this.session.title = this.editedSession.title ? this.editedSession.title : ''
      this.session.blocks = this.editedSession.blocks ? PentilaUtils.JSON.deepCopy(this.editedSession.blocks) : []

      this.isCreation = false
    } else { // isCreation = true
      this.session.blocks.push({
        contentType: 1, contentValue: '', contentName: '', placeholder: this.$t('description')
      })
    }
    this.initialForm = JSON.stringify(this.session)
  },
  methods: {
    addContent (content) {
      content.contentId = -1
      this.session.blocks.push(content)
    },
    deleteContent (index) {
      this.session.blocks.splice(index, 1)
    },
    preview () {
      getSessionPreview(this.session.sessionId).then((data) => {
        if (data.success) {
          // TODO update selectedDetails ?
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
    },
    onConfirm () {
      if (this.v$.$invalid) {
        this.v$.$touch()
      } else {
        this.save()
      }
    },
    save (isDraft = false) {
      // TODO courseId = groupId ?
      const publicationDate = isDraft ? '' : dayjs().format('YYYY-MM-DD HH:mm')

      // Remove empty text blocks
      this.session.blocks = this.session.blocks.filter(block => block.contentType !== contentTypeConstants.TYPE_TEXT_CONTENT || block.contentValue !== '')

      if (this.isCreation) {
        addSessionContent(this.session.groupId, this.session.sessionId, this.session.title, JSON.stringify(this.session.blocks), publicationDate, isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionContent')
            this.onClose()
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
      } else {
        updateSessionContent(this.session.sessionId, this.session.title, JSON.stringify(this.session.blocks), publicationDate, isDraft).then((data) => {
          if (data.success) {
            this.$store.dispatch('course/updateSessionContent')
            this.onClose()
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
        })
      }
    },
    confirmClosure () {
      if (JSON.stringify(this.session) !== this.initialForm) {
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
</style>

<i18n locale="fr">
{
  "title": "Support du cours {courseName} - Séance du {day} à {hour}",
  "courseTitle": "Titre du support*",
  "post": "Publier",
  "preview": "Aperçu",
  "previousSession": "Voir la séance précédente",
  "description": "Description",
  "required": "Champ requis",
  "confirmClosure": "Des modifications ne sont pas enregistrées, êtes-vous certain de quitter l’édition et de perdre les modifications ?"
}
</i18n>
