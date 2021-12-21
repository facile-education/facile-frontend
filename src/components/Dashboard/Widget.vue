<template>
  <div class="widget">
    <header>
      <div>
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
    <section class="content">
      <slot />
    </section>
  </div>
</template>

<script>
export default {
  name: 'Widget',
  props: {
    canAddContent: {
      type: Boolean,
      default: false
    }
  },
  emits: ['addContent'],
  methods: {
    addContent () {
      this.$emit('addContent')
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
