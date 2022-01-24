<template>
  <div
    v-if="(!mq.phone && !mq.tablet) || isCurrentFolder"
    class="breadcrumb-item"
    :class="{ 'active': isActive, 'first-element': isFirstElement, 'phone-breadcrumb-item': mq.phone || mq.tablet }"
    @dragover="setActive"
    @dragleave="cancelActive"
    @drop="dropFile"
    @click.stop="changeDir(folder)"
  >
    <div
      v-if="(mq.phone || mq.tablet) && !isFirstElement"
      class="return-back"
      data-test="back"
      @click="clickBack"
    >
      <img
        src="@assets/icon_arrow_left.svg"
        class="image"
        alt="go back"
      >
    </div>
    <div class="name">
      <span>
        {{ folder.name }}
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BreadCrumbItem',
  inject: ['mq'],
  props: {
    folder: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    isFirstElement: {
      type: Boolean,
      default: false
    },
    isCurrentFolder: {
      type: Boolean,
      default: false
    }
  },
  emits: ['clickBack'],
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    isThereInternDocumentDrag () {
      return this.$store.state.misc.isThereDocumentDrag
    }
  },
  methods: {
    cancelHandlers (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setActive (e) {
      if (this.isThereInternDocumentDrag && !this.isCurrentFolder) {
        this.isActive = true
        this.cancelHandlers(e)
      }
    },
    cancelActive (e) {
      if (this.isThereInternDocumentDrag && !this.isCurrentFolder) {
        this.isActive = false
        this.cancelHandlers(e)
      }
    },
    dropFile (e) {
      if (this.isThereInternDocumentDrag) {
        this.cancelActive(e)
        // dropFileAction
        this.$store.dispatch('clipboard/drop', {
          entities: JSON.parse(e.dataTransfer.getData('entitiesToDrop')),
          folder: this.folder
        })
      }
    },
    clickBack () {
      this.$emit('clickBack')
    },
    changeDir (folder) {
      if (!this.isCurrentFolder) {
        this.$router.push({ name: 'Documents', params: { folderId: this.folder.id } })
        // this.$store.dispatch('documents/closeDocumentPanel') // TODO: discuss about ergonomics
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.breadcrumb-item{
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1em;
  letter-spacing: 0;
  border-radius: 6px;
  margin-right: 3px;
  padding: 3px;

  &:hover:not(.phone-breadcrumb-item) {
    background-color: $color-hover-bg;
  }

  &.first-element {
    font-size: 1em;
    letter-spacing: 0;
    line-height: 24px;

    img {
      margin-top: -6px;
      height: 28px;
      margin-right: 10px;
    }
  }

  .return-back {
    width: 35px;
    height: 35px;
    border: 1px solid $color-border;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    .image {
      height: 12px;
    }
  }

  .name {
    display: flex;
    align-items: center;
  }

  .current-folder-options {
    margin-left: 10px;
    position: relative;

    .icon {
      font-size: 12px;
    }

    .img-container {
      height: 33px;
      width: 33px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 17px;
      background-color: $color-not-white-bg;

      &.active {
        background-color: $color-active-bg;
      }
    }

    .options {
      position: absolute;
      left: 110%;
      top: 0;
    }
  }
}

.phone-breadcrumb-item {
  width: 100%;
  border-radius: 0;
  margin-right: 0;
  padding: 0 10px;

  .name {
    margin: auto;
    font-size: 1.125em;
  }

  .current-folder-options {
    .options {
      left: auto;
      right: 0;
      top: 135%;
    }
  }
}

.active {
  color: $color-light-text;
  background-color: $color-active-bg;
}

//.slide-fade-enter-active {
//  transition: all .3s ease;
//}
//.slide-fade-leave-active {
//  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
//}
//.slide-fade-enter-from, .slide-fade-leave-to
//  /* TODO hide the overflow when translating*/ {
//  transform: translateY(-100%);
//  opacity: 0.5;
//}

</style>
