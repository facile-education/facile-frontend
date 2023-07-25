<template>
  <TextContent
    v-if="typeLabel === 'text'"
    :content="modelValue"
    :placeholder="content.placeholder"
    class="text-content"
    :disabled="!isEdition"
    :class="{'placeholder': content.placeholder}"
    @update:model-value="update"
    @blur="blur"
  />
  <div
    v-else
    class="wrapper"
    tabindex="0"
    @click="clickOnContent"
    @keyup.enter="clickOnContent"
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
    <button
      v-if="isEdition"
      class="actions"
      @click="$emit('delete')"
    >
      <img
        :src="require('@/assets/icons/trash.svg')"
        alt="options"
      >
    </button>
  </div>
</template>

<script>
import TextContent from '@components/Progression/Edit/Contents/TextContent.vue'

import contentTypeConstants from '@/constants/contentTypeConstants'
import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'

export default {
  name: 'Content',
  components: {
    TextContent
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
        case contentTypeConstants.TYPE_TEXT_CONTENT:
          return 'text'
        case contentTypeConstants.TYPE_AUDIO_CONTENT:
          return 'audio'
        case contentTypeConstants.TYPE_LINK_CONTENT:
          return 'link'
        case contentTypeConstants.TYPE_VIDEO_CONTENT:
          return 'video'
        case contentTypeConstants.TYPE_FILE_CONTENT:
          return 'file'
        case contentTypeConstants.TYPE_H5P_CONTENT:
          return 'h5p'
        default:
          return ''
      }
    }
  },
  methods: {
    clickOnContent () {
      switch (this.content.contentType) {
        case contentTypeConstants.TYPE_AUDIO_CONTENT:
          this.openAudioModal()
          break
        case contentTypeConstants.TYPE_LINK_CONTENT:
          this.openLink()
          break
        case contentTypeConstants.TYPE_VIDEO_CONTENT:
          this.openVideoModal()
          break
        case contentTypeConstants.TYPE_FILE_CONTENT:
          this.displayFile()
          break
        case contentTypeConstants.TYPE_H5P_CONTENT:
          this.openH5PModal()
          break
        default:
          return ''
      }
    },
    openAudioModal () {
      console.log(this.content)
    },
    openLink () {
      window.open(this.content.contentValue, '_blank')
    },
    openVideoModal () {
      console.log(this.content)
    },
    displayFile () {
      this.$store.dispatch('documents/openFile', { id: this.content.fileId, name: this.content.fileName })
    },
    openH5PModal () {
      console.log(this.content)
    },
    blur () {
      if (!this.content.placeholder && this.modelValue === '') {
        this.$emit('delete')
      }
    },
    update (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<style lang="scss">
.text-content {
  &.ck-editor {
    p {
      margin: 5px 0;
      line-height: 1.25rem;
    }
  }

  &.ck-editor__editable.placeholder {
    min-height: 8rem;
  }
}

</style>

<style lang="scss" scoped>
@import '@design';

.text-content {
  background: $neutral-20;
  border-bottom: 1px solid black;

  &.disabled {
    padding: 10px 0;
    background-color: white;
    border: none;
    color: black;
    cursor: auto;
    @extend %font-regular-m;
  }
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
  cursor: pointer;
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

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.actions img {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

<i18n locale="fr">
{
  "audio": "Audio",
  "file": "Fichier",
  "h5p": "Contenu riche",
  "link": "Lien externe",
  "video": "Contenu vidéo"
}
</i18n>
