<template>
  <TextContent
    v-if="typeLabel === 'text'"
    :content="modelValue"
    :placeholder="content.placeholder"
    class="text-content"
    :disabled="!isEdition"
    :class="{'placeholder': content.placeholder}"
    :focus-on-creation="focusOnCreation"
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
      @click.stop="$emit('delete')"
    >
      <img
        :src="require('@/assets/icons/trash.svg')"
        alt="options"
      >
    </button>

    <teleport to="body">
      <VideoModal
        v-if="videoModalDisplayed"
        :edited-content="content"
        :read-only="true"
        @close="videoModalDisplayed=false"
      />
      <H5PModal
        v-if="h5pModalDisplayed"
        :edited-content="content"
        :read-only="true"
        @close="h5pModalDisplayed=false"
      />
    </teleport>
  </div>
</template>

<script>
import TextContent from '@components/Progression/Edit/Contents/TextContent.vue'
import { defineAsyncComponent } from 'vue'

import contentTypeConstants from '@/constants/contentTypeConstants'
import { icons } from '@/constants/icons'
import { getExtensionFromName } from '@/utils/commons.util'
const H5PModal = defineAsyncComponent(() => import('@/components/Progression/Edit/H5PModal'))
const VideoModal = defineAsyncComponent(() => import('@/components/Progression/Edit/VideoModal'))

export default {
  name: 'CourseContent',
  components: {
    H5PModal,
    VideoModal,
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
    },
    focusOnCreation: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'delete'],
  data () {
    return {
      videoModalDisplayed: false,
      h5pModalDisplayed: false
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
          // TODO: Test audioFile opening
          this.$store.dispatch('documents/openFile', { id: this.content.fileId, name: this.content.fileName })
          break
        case contentTypeConstants.TYPE_LINK_CONTENT:
          window.open(this.content.contentValue, '_blank')
          break
        case contentTypeConstants.TYPE_VIDEO_CONTENT:
          this.videoModalDisplayed = true
          break
        case contentTypeConstants.TYPE_FILE_CONTENT:
          this.$store.dispatch('documents/openFile', { id: this.content.fileId, name: this.content.fileName, readOnly: true })
          break
        case contentTypeConstants.TYPE_H5P_CONTENT:
          // TODO: Test with real whitelisted h5p content
          this.h5pModalDisplayed = true
          break
        default:
          return ''
      }
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
    background-color: transparent;
    border: none;
    color: black;
    cursor: auto;
    @extend %font-regular-m;
  }
}

.wrapper {
  display: flex;
  // width: 49.8125rem;
  align-items: center;

  border-radius: 0.375rem;
  border: 1px solid $neutral-40;
  background: $neutral-10;
  cursor: pointer;
}

.thumbnail {
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  align-items: center;

  border-radius: 0.375rem;
  //background: $neutral-20;

  img {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.infos {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type {
  display: flex;
  align-content: center;
  width: 100%;
  @extend %font-regular-xs;
}

.title {
  margin: 1px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  @extend %font-bold-l;
}

.duration {
  color: $neutral-80;

  @extend %font-regular-s;
}

.description {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-right : 1rem;
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
  "video": "Vidéo"
}
</i18n>
