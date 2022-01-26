<template>
  <div class="widget">
    <header>
      <div class="theme-text-color">
        <slot name="header" />
      </div>
      <PentilaButton
        v-if="canAddContent"
        class="add-content"
        type="circle"
        @click="addContent"
      >
        <img
          src="@assets/add-white.svg"
          :alt="$t('add-content')"
          :title="$t('add-content')"
        >
      </PentilaButton>
    </header>
    <section
      ref="scroll"
      class="content"
      @scroll="handleScroll"
    >
      <slot />
    </section>
  </div>
</template>

<script>
let oldScrollTop = 0

export default {
  name: 'Widget',
  props: {
    canAddContent: {
      type: Boolean,
      default: false
    }
  },
  emits: ['addContent', 'scrollReachBottom'],
  methods: {
    addContent () {
      this.$emit('addContent')
    },
    handleScroll () {
      const scroll = this.$refs.scroll
      if (scroll.scrollTop > oldScrollTop) { // if we go down
        const nbPixelsBeforeBottom = scroll.scrollHeight - (scroll.scrollTop + scroll.clientHeight)

        if (nbPixelsBeforeBottom === 0) {
          if (!this.$store.getters['currentActions/isInProgress']('loadThreads')) {
            this.$emit('scrollReachBottom')
          }
        }
      }
      oldScrollTop = scroll.scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
.widget {
  margin: 20px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  //border: 1px solid rgba(0, 0, 0, 0.2);
  //box-shadow: 0 2px 4px rgb(0 0 0 / 20%);

  header {
    min-height: 50px;
    align-items: center;
    display: flex;
    font-size: 1.25rem;

    .add-content {
      margin-left: auto;
    }
  }

  section {
    overflow-y: auto;
  }
}
</style>

<i18n locale="fr">
{
  "add-content": "Ajouter"
}
</i18n>
