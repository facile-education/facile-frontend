<template>
  <div
    v-if="breadcrumb.length > 0"
    class="file-picker-breadcrumb"
  >
    <div
      v-if="breadcrumb.length > 1"
      class="back-option"
      @click="itemClicked(breadcrumb[breadcrumb.length - 2].id)"
    >
      <img
        src="@assets/icon_arrow_left.svg"
        class="image"
        alt="go back"
      >
      {{ previousFolderDisplayedName }}
    </div>
    <div
      class="current-folder"
      :class="{'root' : breadcrumb.length === 1 }"
    >
      {{ currentFolderDisplayedName }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilePickerBreadCrumb',
  inject: ['mq'],
  props: {
    breadcrumb: {
      type: Array,
      required: true
    }
  },
  emits: ['itemClicked'],
  computed: {
    currentFolderDisplayedName () {
      if (this.breadcrumb.length === 1) {
        return this.$t(this.breadcrumb[0].name) // Handle root folder name
      } else if (this.breadcrumb.length > 1) {
        return this.breadcrumb[this.breadcrumb.length - 1].name
      } else {
        return ''
      }
    },
    previousFolderDisplayedName () {
      if (this.breadcrumb.length === 2) {
        return this.$t(this.breadcrumb[0].name)
      } else if (this.breadcrumb.length > 2) {
        return this.breadcrumb[this.breadcrumb.length - 2].name
      } else {
        return ''
      }
    }
  },
  methods: {
    itemClicked (folderId) {
      this.$emit('itemClicked', folderId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.chevron {
  width: 11px;
  margin: 0 10px;
}

.file-picker-breadcrumb {
  min-height: 40px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: $color-dark-text;

  /* disable text selection on documents (not convenient when shift-select) */
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none; /* CSS3 (little to no support) */

  .back-option {
    position: absolute;
    cursor: pointer;
    top: 50%;
    left: 0;
    max-width: 25vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.75em;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 19px;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
    }

    img {
      margin-left: 15px;
      margin-right: 7px;
      height: 12px;
    }
  }

  .current-folder {
    max-width: 50vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 1.125em;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 24px;

    &.root {
      max-width: 100vw;
    }
  }
}

</style>

<i18n locale="fr">
{
  "Personnels": "Personnels",
  "Mes groupes": "Collaboratifs"
}
</i18n>
