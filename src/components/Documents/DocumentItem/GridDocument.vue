<template>
  <div
    ref="document"
    class="grid-document"
    :class="{'phone-list-document': mq.phone || mq.tablet}"
    tabindex="-1"
    @keypress.enter="triggerAction"
    @click.ctrl.exact="ctrlSelect"
    @click.meta.exact="ctrlSelect"
    @click.shift="shiftSelect"
    @dblclick="triggerAction"
    @click.exact="triggerAction"
    @mouseover="hoverSelection = true"
    @mouseleave="hoverSelection = false"
  >
    <div class="icon-container">
      <!-- Mandatory to dynamically change color >-->
      <object
        v-if="displayFolderRootIcon"
        ref="docIcon"
        class="img-icon"
        :data="require('@assets/icons/documents/icon-folder.svg')"
        type="image/svg+xml"
      />

      <img
        v-else-if="fileIconIsImage"
        ref="docIcon"
        class="img-icon"
        :src="documentIcon"
        alt="document icon"
      >
      <BaseIcon
        v-else
        class="base-icon"
        :name="['fas', documentIcon]"
      />

      <div class="data">
        <div
          v-if="document.isGroupRootFolder"
          class="members"
        >
          <span>{{ document.nbMembers }}</span>
          <img
            class="members-icon"
            src="@assets/icon_commu-black.svg"
            :title="$t('members')"
            alt=""
          >
        </div>
        <img
          v-if="mq.phone || mq.tablet || hoverSelection"
          class="button"
          src="@assets/options/icon_details.svg"
          data-test="open-details-icon"
          :alt="$t('details')"
          :title="$t('details')"
          @click.stop="openDetailsPanel"
        >
      </div>
    </div>
    <p class="name">
      {{ document.name }}
    </p>
    <div
      v-if="isSelected || hoverSelection"
      class="horizontal-mark theme-background-color"
      :style="'background-color: ' + document.color + ';'"
    />
    <div
      v-else
      class="horizontal-mark"
    />
  </div>
</template>

<script>

import { defineAsyncComponent } from 'vue'

import dayjs from 'dayjs'
const BaseIcon = defineAsyncComponent(() => import('@components/Base/BaseIcon'))

export default {
  name: 'GridDocument',
  components: { BaseIcon },
  inject: ['mq'],
  props: {
    document: {
      type: Object,
      required: true,
      validator: function (obj) {
        return (typeof obj.id === 'string') &&
          (typeof obj.name === 'string' && obj.name.length > 0)
      }
    },
    documentIcon: {
      type: String,
      required: true
    }
  },
  emits: ['chooseOption', 'triggerAction', 'select', 'ctrlSelect', 'shiftSelect'],
  data () {
    return {
      hoverSelection: false
    }
  },
  computed: {
    displayFolderRootIcon () {
      return this.document.isGroupRootFolder
    },
    fileIconIsImage () {
      // TODO: find a better way to separate img and font-awesome icons
      return this.documentIcon.includes('.') || this.documentIcon.includes(':') // if icon contains extension (like folder.svg) it's not a font-awesome
    },
    isModalOpen () {
      return this.$store.state.misc.nbOpenModals > 0
    },
    selectedEntities () {
      return this.$store.state.documents.selectedEntities
    },
    isSelected () {
      return this.selectedEntities.indexOf(this.document) !== -1
    },
    formattedDate () {
      return this.document.lastModifiedDate !== undefined ? dayjs(this.document.lastModifiedDate, 'YYYY-MM-DD HH:mm').calendar() : '-'
    }
  },
  mounted () {
    if (this.displayFolderRootIcon) {
      const vm = this
      const a = this.$refs.docIcon

      let color
      if (this.document.color) {
        color = this.document.color
      } else if (this.$store.state.user.themeColor) {
        color = this.$store.state.user.themeColor
      }

      a.setAttribute('style', 'cursor: pointer;')

      // It's important to add an load event listener to the object,
      // as it will load the svg doc asynchronously
      a.addEventListener('load', function () {
        // get the inner DOM of alpha.svg
        const svgDoc = a.contentDocument
        // get the inner element by id
        const colorPolygon = svgDoc.getElementById('color-polygon')
        if (color) {
          colorPolygon.setAttribute('fill', color)
        }

        // Add the behaviour we lost by the process
        const img = svgDoc.getElementById('svg-img')
        img.setAttribute('style', 'cursor: pointer;')

        img.addEventListener('mouseup', function () {
          vm.triggerAction()
        }, false)

        img.addEventListener('dblclick', function () { vm.triggerAction() }, false)
      }, false)
    }
  },
  methods: {
    openDetailsPanel () {
      this.$emit('select')
    },
    triggerAction () {
      console.log('grid trigger action')
      this.$emit('triggerAction')
    },
    select () {
      console.log('select')
      this.$emit('select')
    },
    ctrlSelect () {
      console.log('ctrl select')
      this.$emit('ctrlSelect')
    },
    shiftSelect () {
      console.log('shift select')
      this.$emit('shiftSelect')
    }
  }
}
</script>

<style scoped lang="scss">
@import "@design";

.grid-document{
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  background-color: white;
  height: 180px;
  width: 180px;

  .icon-container {
    position: relative;
    flex: 1;
    margin-bottom: 10px;
    width: 85%;

    .img-icon, .base-icon {
      height: 100%;
      width: 100%;
    }

    .data {
      position: absolute;
      bottom: 10%;
      width: 100%;
      padding: 0 10%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
      }

      .members {
        display: flex;
        align-items: center;

        .members-icon {
          width: 25px;
          height: 25px;
        }
      }

      .button {
        margin-left: auto;
      }
    }
  }

  p {
    margin: 0;
    text-align: center;
  }

  .name {
    max-width: 100%;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date {
    font-size: 0.925rem;
  }

  .horizontal-mark {
    width: 100%;
    height: 5px;
  }
}

.icon{
  font-size: 30px;
}

</style>

<i18n locale="fr">
{
  "details": "Détails",
  "members": "Membres"
}
</i18n>
