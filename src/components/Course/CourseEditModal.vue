<template>
  <PentilaWindow
    class="edit-course-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span> {{ formattedTitle }} </span>
    </template>

    <template #body>
      <section class="left">
        <PentilaInput
          v-model="session.title"
          :placeholder="$t('courseTitle')"
        />
        <Content
          v-for="(block, index) in session.blocks"
          :key="block.contentId"
          v-model="block.contentValue"
          :content="block"
          :is-edition="true"
          @delete="deleteContent(index)"
        />
        <ContentPicker @add="addContent" />
      </section>
      <section class="right">
        <PentilaButton
          v-t="'preview'"
          @click="preview"
        />
        <PentilaButton v-t="'previousSession'" />
      </section>
    </template>

    <template #footer>
      <PentilaButton
        v-t="'post'"
        @click="save()"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import dayjs from 'dayjs'
import PentilaUtils from 'pentila-utils'
import { defineAsyncComponent } from 'vue'

import { addSessionContent, getSessionPreview, updateSessionContent } from '@/api/course.service'
import ContentPicker from '@/components/Course/ContentPicker.vue'

const Content = defineAsyncComponent(() => import('@/components/Course/Content'))

export default {
  name: 'CourseEditModal',
  components: {
    Content,
    ContentPicker
  },
  props: {
    editedSession: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      isCreation: true,
      session: { blocks: [], title: '' }
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
    }
  },
  created () {
    console.log(this.editedSession)
    // this.$store.dispatch('misc/incrementModalCount')
    this.session.groupId = this.editedSession.groupId
    this.session.sessionId = this.editedSession.sessionId

    if (this.editedSession.title || (this.editedSession.blocks && this.editedSession.blocks.length > 0)) {
      this.session.title = this.editedSession.title ? this.editedSession.title : ''
      this.session.blocks = this.editedSession.blocks ? PentilaUtils.JSON.deepCopy(this.editedSession.blocks) : []

      this.isCreation = false
    }
  },
  methods: {
    addContent (content) {
      console.log('add content', content)
      content.contentId = -1
      this.session.blocks.push(content)
    },
    deleteContent (index) {
      this.session.blocks.splice(index, 1)
    },
    onClose () {
      // this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    },
    preview () {
      getSessionPreview(this.session.sessionId).then((data) => {
        if (data.success) {
          // TODO update selectedDetails ?
          console.log(data)
        }
      },
      (err) => {
        // TODO toastr
        console.error(err)
      })
    },
    save (isDraft = false) {
      // TODO courseId = groupId ?
      const publicationDate = isDraft ? '' : dayjs().format('YYYY-MM-DD HH:mm')
      console.log(this.isCreation, this.session.groupId, this.session.sessionId, this.session.title, JSON.stringify(this.session.blocks), publicationDate, isDraft)

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
    }
  }
}
</script>

<style lang="scss">
.edit-course-modal .window-body {
  display: flex;
  padding: 1.5rem 0rem;
  align-items: flex-start;
  gap: 2rem;
  align-self: stretch;

  overflow: auto;
  max-height: 70vh;
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
    "courseTitle": "Titre du support",
    "post": "Publier",
    "preview": "Aperçu",
    "previousSession": "Voir la séance précédente"
  }
</i18n>
