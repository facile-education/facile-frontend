<template>
  <button
    class="thumbnail-selector"
    @click="isImagePickerDisplayed=true"
  >
    <img
      class="thumbnail"
      :src="thumbnailUrl"
      alt="thumbnail"
    >
    <span class="update-icon-container">
      <CustomIcon icon-name="icon-edit" />
    </span>
  </button>

  <teleport
    v-if="isImagePickerDisplayed"
    to="body"
  >
    <ImagePicker
      :initial-thumbnail-url="thumbnailUrl"
      @created-tmp-file="$emit('selectImage', $event)"
      @close="isImagePickerDisplayed=false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'

const ImagePicker = defineAsyncComponent(() => import('@components/Base/ImagePicker.vue'))

export default {
  name: 'ThumbnailSelector',
  components: { CustomIcon, ImagePicker },
  props: {
    thumbnailUrl: {
      type: String,
      required: true
    }
  },
  emits: ['selectImage'],
  data () {
    return {
      isImagePickerDisplayed: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

button {
  margin: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  background-color: transparent;
}

.thumbnail-selector {
  position: relative;
  height: $news-thumbnail-size-in-modal;
  width: $news-thumbnail-size-in-modal;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumbnail {
  height: 100%;
  width: 100%;
}

.update-icon-container {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: white;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon-edit {
    font-size: 15px;
  }
}
</style>
