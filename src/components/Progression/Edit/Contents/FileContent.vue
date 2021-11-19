<template>
  <div
    class="file"
    @click="displayFile"
  >
    <div class="preview">
      <img
        v-if="fileIconIsImage"
        class="icon"
        :src="fileIcon"
        alt="document icon"
      >
      <BaseIcon
        v-else
        class="icon"
        :name="[iconPrefix, fileIcon]"
      />
    </div>
    <p class="file-name">
      {{ fileName }}
    </p>
    <BaseIcon
      v-if="downloadUrl"
      class="download"
      name="download"
      :title="$t('Commons.download')"
      @click.stop="download"
    />
  </div>
</template>

<script>
import { getExtensionFromName } from '@/utils/commons.util'
import documentUtils from '@utils/documents.util'
import { icons } from '@/constants/icons'
import BaseIcon from '@components/Base/BaseIcon'

export default {
  name: 'FileContent',
  components: { BaseIcon },
  myIcons: icons,
  props: {
    fileName: {
      type: String,
      required: true
    },
    fileId: {
      type: String,
      required: true
    },
    downloadUrl: {
      type: String,
      default: ''
    },
    isHovering: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileExtension () {
      return getExtensionFromName(this.fileName)
    },
    fileIcon () {
      if (this.$options.myIcons.extensions[this.fileExtension] === undefined) {
        return this.$options.myIcons.file
      } else {
        return this.$options.myIcons.extensions[this.fileExtension]
      }
    },
    fileIconIsImage () {
      // TODO: find a better way to separate img and font-awesome icons
      return this.fileIcon.includes('.') || this.fileIcon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    },
    iconPrefix () {
      if (this.fileIcon === 'code') {
        return 'fas'
      } else {
        return 'far'
      }
    }
  },
  methods: {
    displayFile () {
      console.log('TODO: display ' + this.fileName)
      window.open(this.downloadUrl, '_blank').focus()
    },
    download () {
      documentUtils.downLoadDocument({ id: this.fileId, type: 'File', url: this.downloadUrl })
    }
  }
}
</script>

<style lang="scss" scoped>

.file{
  height: 80px;
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: center;
  background-color: white;
  //border: 1px solid rgba(50, 50, 255, 0.5);
  border-radius: 6px;

  .preview {
    height: 100%;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon{
      font-size: 30px;
      width: 30px;
      height: 30px;
    }
  }

  .download {
    margin-left: auto;
  }
}

</style>
