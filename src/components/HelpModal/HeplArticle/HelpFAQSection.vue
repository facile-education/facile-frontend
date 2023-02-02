<template>
  <section class="faq-section">
    <div class="header">
      <h3
        v-t="'FAQ'"
        :title="$t('frequentlyAskedQuestions')"
      />
      <button
        v-if="isAdministrator"
        v-t="'add-question'"
        @click="isCreateQuestionModalDisplayed=true"
      />
    </div>
    <HelpQuestion
      v-for="(question, index) in questions"
      :key="index"
      :question="question"
      @delete="deleteQuestion(question)"
    />

    <teleport
      v-if="isCreateQuestionModalDisplayed"
      to="body"
    >
      <CreateQuestionModal
        @close="isCreateQuestionModalDisplayed=false"
      />
    </teleport>
  </section>
</template>

<script>
import HelpQuestion from '@components/HelpModal/HeplArticle/HelpQuestion.vue'
import { defineAsyncComponent } from 'vue'
import { saveItem } from '@/api/help.service'
const CreateQuestionModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/CreateQuestionModal.vue'))

export default {
  name: 'HelpFAQSection',
  components: { CreateQuestionModal, HelpQuestion },
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isCreateQuestionModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    },
    selectedHelpArticle () {
      return this.$store.state.help.currentArticle
    }
  },
  methods: {
    deleteQuestion (question) {
      const indexQuestionToDelete = this.selectedHelpArticle.questions.map(question => question.questionId).indexOf(question.groupId)
      const updatedArticle = JSON.parse(JSON.stringify(this.selectedHelpArticle))
      updatedArticle.questions.splice(indexQuestionToDelete, 1)
      saveItem(0, updatedArticle).then((data) => { // No need of categoryId for item modification
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
button {
  margin-top: 1em;
  display: none;
}

.header {
  width: 100%;
  align-items: center;
  display: flex;

  &:hover {
    button {
      display: block;
    }
  }
}

h3 {
  flex: 1;
  border-bottom: 1px solid $color-border;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 1em;
  margin-bottom: 0;
}

</style>

<i18n locale="fr">
{
  "FAQ": "F.A.Q.",
  "frequentlyAskedQuestions": "Question fréquentes",
  "add-question": "+ Ajouter"
}
</i18n>
