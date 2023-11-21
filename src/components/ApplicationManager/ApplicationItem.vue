<template>
  <div class="wrapper">
    <div
      ref="popup"
      v-click-outside="clickOutside"
      :class="{ hidden: (mq.phone || !isSelected), right: isRightOriented, left: !isRightOriented }"
      class="details"
      @click.stop
    >
      <ApplicationDetails
        v-if="isSelected && !mq.phone"
      />
    </div>
    <div
      class="application"
      @click.stop="toggleDetails"
    >
      <div
        class="check"
        :class="{ hidden: !application.isBroadcasted }"
      >
        <NeroIcon name="check" />
      </div>
      <img
        v-if="application.image"
        :src="application.image"
        alt="application_icon"
        class="logo"
      >
      <div
        v-else
        class="default"
      >
        <NeroIcon
          name="image"
          type="far"
        />
      </div>
      <p class="name">
        {{ application.applicationName }}
      </p>
    </div>
    <teleport to="body">
      <ApplicationDetailsModal
        v-if="mq.phone && isSelected"
        @close="hideDetails"
      />
    </teleport>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { directive } from 'vue3-click-away'
const ApplicationDetails = defineAsyncComponent(() => import('@/components/ApplicationManager/ApplicationDetails'))
const ApplicationDetailsModal = defineAsyncComponent(() => import('@/components/ApplicationManager/ApplicationDetailsModal'))
const NeroIcon = defineAsyncComponent(() => import('@/components/Nero/NeroIcon'))

export default {
  name: 'ApplicationItem',
  components: {
    ApplicationDetails,
    ApplicationDetailsModal,
    NeroIcon
  },
  directives: {
    'click-outside': directive
  },
  inject: ['mq'],
  props: {
    application: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      domRect: undefined,
      showDetailsModal: false
    }
  },
  computed: {
    isRightOriented () {
      // If there is not enough space at the right change orientation
      if (this.domRect) {
        // Width from details css
        const detailsWidth = 480
        if ((window.innerWidth - this.domRect.x) < detailsWidth) {
          return false
        }
      }
      return true
    },
    isSelected () {
      return (this.$store.state.applicationManager.selectedApplication === this.application)
    }
  },
  mounted () {
    this.setDomRect()
    window.addEventListener('resize', this.setDomRect)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.setDomRect)
  },
  methods: {
    clickOutside () {
      if (!this.mq.phone) {
        this.hideDetails()
      }
    },
    hideDetails () {
      if (!this.$store.state.applicationManager.showBroadcastModal && !this.$store.state.applicationManager.showEditionModal) {
        this.$store.commit('applicationManager/setSelectedApplication', undefined)
      }
    },
    setDomRect () {
      if (this.$refs.popup) {
        this.domRect = this.$refs.popup.getBoundingClientRect()
      }
    },
    toggleDetails () {
      if (!this.isSelected) {
        this.$store.dispatch('applicationManager/selectApplication', { application: this.application, school: this.$store.state.administration.selectedSchool })
      } else {
        // this.hideDetails()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/design';

.wrapper {
  position: relative;
  display: inline-block;
  vertical-align: top;
}

.application {
  position: relative;
  margin: 25px;
  max-width: 100px;
  max-height: 128px;
  cursor: pointer;
}

.check {
  background-color: $color-valid-bg;
  color: $color-light-text;
  position: absolute;
  top: -8px;
  right: -8px;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s;
  opacity: 1;

  &.hidden {
    opacity: 0;
  }
}

.logo {
  display: flex;
  width: 100px;
  height: 100px;
  border-radius: 5px;
}

.default {
  width: 100px;
  height: 100px;
  font-size: 90px;
  color: $color-fallback-text;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.name {
  margin-top: 5px;
  text-align: center;
}

.details {
  display: flex;
  width: 480px;
  height: 175px;
  position: absolute;
  opacity: 1;
  top: 0;
  z-index: 3;
  border-radius: $light-radius-size;
  transition: opacity .4s, width .3s;
  overflow: hidden;
  @extend %object-shadow;

  &.hidden {
    width: 0;
    opacity: 0;
  }
}

.left {
  right: 0;
}
</style>
