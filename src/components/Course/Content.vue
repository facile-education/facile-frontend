<template>
  <CKEditor
    v-if="typeLabel === 'text'"
    :model-value="modelValue"
    :editor="editor"
    :config="editorConfig"
    :disabled="!isEdition"
    class="editor"
    @update:model-value="update"
  />
  <div
    v-else
    class="wrapper"
  >
    <div class="thumbnail">
      <img
        :src="thumbnail"
        alt="type thumbnail"
      >
    </div>
    <div class="infos">
      <label class="type">
        <img
          :src="icon"
          alt=""
        >
        {{ $t(typeLabel) }}
      </label>
      <h3 class="title">
        {{ content.contentName }}
        <label
          v-if="content.duration"
          class="duration"
        >
          {{ content.duration }}
        </label>
      </h3>
      <p
        v-if="content.contentValue"
        class="description"
      >
        {{ content.contentValue }}
      </p>
    </div>
    <div
      v-if="isEdition"
      class="actions"
      @click="toggleContextMenu"
    >
      <img :src="require('@/assets/icons/vertical_dots.svg')">
    </div>
  </div>
  <teleport
    v-if="displayMenu"
    to="body"
  >
    <ContextMenu
      @choose-option="performChosenOption"
      @close="displayMenu=false"
    />
  </teleport>
</template>

<script>
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import CKEditor from '@ckeditor/ckeditor5-vue'
import { defineAsyncComponent } from 'vue'

import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'

const ContextMenu = defineAsyncComponent(() => import('@/components/ContextMenu/ContextMenu'))

export default {
  name: 'Content',
  components: {
    CKEditor: CKEditor.component,
    ContextMenu
  },
  props: {
    content: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    },
    isEdition: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'delete'],
  data () {
    return {
      displayMenu: false,
      editor: InlineEditor,
      editorConfig: {
        toolbar: {
          // items: [ 'bold', 'italic', '|', 'link' ],
          // viewportTopOffset: 500
        }
      }
    }
  },
  computed: {
    icon () {
      return new URL(`../../assets/icons/contents/${this.typeLabel}.svg`, import.meta.url).href
    },
    fileExtension () {
      return getExtensionFromName(this.content.contentName)
    },
    thumbnail () {
      if (this.typeLabel === 'file') {
        if (icons.extensions[this.fileExtension] === undefined) {
          return icons.file
        } else {
          return icons.extensions[this.fileExtension]
        }
      } else {
        return new URL(`../../assets/icons/documents/${this.typeLabel}.svg`, import.meta.url).href
      }
    },
    typeLabel () {
      switch (this.content.contentType) {
        case 1:
          return 'text'
        case 2:
          return 'audio'
        case 3:
          return 'link'
        case 4:
          return 'video'
        case 5:
          return 'file'
        case 6:
          return 'h5p'
        default:
          return ''
      }
    }
  },
  methods: {
    displayFile () {
      this.$store.dispatch('documents/openFile', { id: this.fileId, name: this.fileName })
    },
    performChosenOption (option) {
      switch (option.name) {
        case 'edit':
          console.log('todo edit')
          this.displayMenu = false
          break
        case 'delete':
          this.$emit('delete')
          this.displayMenu = false
          break
        default:
          console.error('no option with name ' + option.name + ' exists')
      }
      this.$store.dispatch('contextMenu/closeMenus')
    },
    toggleContextMenu (event) {
      this.displayMenu = true
      this.$store.dispatch('contextMenu/openContextMenu', {
        event: event,
        options: [
          {
            name: 'edit',
            title: this.$t('edit'),
            icon: icons.options.rename,
            position: 1,
            hasSeparator: false
          },
          {
            name: 'delete',
            title: this.$t('delete'),
            icon: icons.options.delete,
            position: 2,
            hasSeparator: false
          }]
      })
    },
    update (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.editor {
  background: $neutral-20;
  border-bottom: 1px solid black;
}

.wrapper {
  display: flex;
  // width: 49.8125rem;
  padding: 1rem;
  align-items: center;
  gap: 1rem;

  border-radius: 0.375rem;
  border: 1px solid $neutral-40;
  background: $neutral-10;
}

.thumbnail {
  display: flex;
  padding: 1rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.375rem;
  background: $neutral-20;

  img {
    width: 3rem;
    height: 3rem;
  }
}

.infos {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1875rem;
  flex: 1 0 0;
}

.type {
  display: flex;
  align-content: center;
  gap: 0.5rem;
  width: 100%;
  @extend %font-regular-xs;

  img {
    width: 1rem;
    height: 1rem;
  }
}

.title {
  margin: 0;

  @extend %font-bold-l;
}

.duration {
  color: $neutral-80;

  @extend %font-regular-s;
}

.description {
  margin: 0;

  @extend %font-regular-s;
}

.actions img {
  width: 1.5rem;
  height: 1.5rem;
}
</style>

<i18n locale="fr">
{
  "audio": "Audio",
  "delete": "Supprimer",
  "edit": "Modifier",
  "file": "Fichier",
  "h5p": "Contenu riche",
  "link": "Lien externe",
  "video": "Contenu vidéo"
}
</i18n>
