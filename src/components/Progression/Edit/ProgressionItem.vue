<template>
  <div
    class="progression-item"
  >
    <div
      class="item-header"
    >
      <span
        v-if="item.isHomework"
      >
        {{ $t('homework') }}
      </span>
      <span
        v-else
      >
        {{ $t('session') }}
      </span>
      <PentilaInput
        :model-value="item.name"
        :placeholder="$t('title')"
        :maxlength="75"
        @update:modelValue="updateInput"
        @blur="blurInput"
      />
    </div>

    <!-- Item contents in proper order -->
    <div
      class="item-contents"
    >
      <div
        v-for="content in itemContents"
        :key="content.id"
        class="item-content"
      >
        <span>content</span>
      </div>
    </div>

    <!-- Add content buttons -->
    <div
      class="add-content-buttons"
    >
      <img
        class="add-content-button"
        src="@assets/arrow-down.svg"
        :alt="$t('addText')"
        :title="$t('addText')"
        @click="addText()"
      >
      <img
        class="add-content-button"
        src="@assets/arrow-down.svg"
        :alt="$t('addSound')"
        :title="$t('addSound')"
        @click="addSound()"
      >
      <img
        class="add-content-button"
        src="@assets/arrow-down.svg"
        :alt="$t('addLink')"
        :title="$t('addLink')"
        @click="addLink()"
      >
      <img
        class="add-content-button"
        src="@assets/arrow-down.svg"
        :alt="$t('addVideo')"
        :title="$t('addVideo')"
        @click="addVideo()"
      >
      <img
        class="add-content-button"
        src="@assets/arrow-down.svg"
        :alt="$t('addFile')"
        :title="$t('addFile')"
        @click="addFile()"
      >
      <img
        class="add-content-button"
        src="@assets/arrow-down.svg"
        :alt="$t('addH5p')"
        :title="$t('addH5p')"
        @click="addH5p()"
      >
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProgressionItem',
  components: { },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    progression () {
      return this.$store.state.progression.currentProgression
    },
    itemContents () {
      return []
    }
  },
  created () {
    console.log('item=', this.item)
  },
  methods: {
    addText () {

    },
    addSound () {

    },
    addLink () {

    },
    addVideo () {

    },
    addFile () {

    },
    addH5p () {

    },
    updateInput (value) {
      console.log('updateInput ', value)
    },
    blurInput (value) {
      console.log('blurInput ', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.progression-item {
  width: 90%;
  border: 1px solid black;
  margin: 10px;

  .item-header {
    height: 50px;
    border-bottom: 1px solid black;
  }
  .item-contents {
    .item-content {
      margin: 5px;
      border-bottom: 1px solid black;
    }
  }
  .add-content-buttons {
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 300px;
    display: flex;
    justify-content: space-around;
    .add-content-button {
      margin: 5px;
    }
  }
}
</style>

<i18n locale="fr">
{
  "session": "Séance",
  "homework": "Devoir",
  "title": "Titre",
  "addText": "Ajouter du texte",
  "addSound": "S'enregistrer",
  "addLink": "Ajouter un lien https",
  "addVideo": "Ajouter une vidéo",
  "addFile": "Ajouter une pièce jointe",
  "addH5p": "Ajouter un élément h5p"
}
</i18n>
