<template>
  <button
    class="question"
    @click="toggleQuestion"
  >
    {{ question.question }}
    <span>
      <CustomIcon
        v-if="isAdministrator"
        class="admin-trash-icon"
        icon-name="icon-trash"
        @click.stop="confirmQuestionRemoval"
      />
      <CustomIcon
        class="icon"
        :class="isExtended ? 'extend': 'collapse'"
        :icon-name="'icon-chevron-right-s'"
      />
    </span>
  </button>
  <div
    class="answer"
    :class="isExtended ? 'extended' : 'collapsed'"
    v-html="question.answer"
  />
  <div class="separator" />
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

export default {
  name: 'HelpQuestion',
  components: { CustomIcon },
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  emits: ['delete'],
  data () {
    return {
      isExtended: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  methods: {
    toggleQuestion () {
      this.isExtended = !this.isExtended
    },
    confirmQuestionRemoval () {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('HelpModal.HelpQuestion.confirmQuestionRemovalMessage'),
        lastAction: { fct: this.deleteQuestion, params: [] }
      })
    },
    deleteQuestion () {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss">
.answer {
  img {
    max-width: 100%;
    vertical-align: middle;
  }
}
</style>

<style lang="scss" scoped>
@import "@design";

button {
  display: flex;
  height: 50px;
  width: 100%;
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0 1em;
  border: none;
  align-items: center;
  justify-content: space-between;
  font-weight: lighter;
  font-size: 1em;

  span {
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: 1.3rem;
  }

  .collapse, .extend {
    transition:  transform .6s;
  }

  .extend {
    transform: rotate(90deg);
  }

  .collapse {
    transform: rotate(0);
  }

  .admin-trash-icon {
    margin-right: 10px;
    font-size: 1.2rem;
    display: none;
  }

  &:hover {
    .admin-trash-icon {
      display: inline;
    }
  }
}

.answer {
  padding: 0 1em;
  font-size: 0.875em;
  max-height: 500px; // Something bigger than I will ever get.
  overflow: hidden;
  transition: max-height 0.35s ease-in;

  &.collapsed {
    max-height: 0;
    transition: max-height 0.35s ease-out;
  }
}

.separator {
  width: 100%;
  height: 1px;
  background-color: $color-border;
}

</style>
