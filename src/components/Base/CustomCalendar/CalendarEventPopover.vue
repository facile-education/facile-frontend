<template>
  <div
    class="event-popup"
    data-test="event-popup"
    :class="{'hide': (selectedEvent === undefined)}"
    :style="popupStyle"
  >
    <template v-if="selectedEvent">
      <FAIcon
        v-if="isPopupTop"
        name="fa-caret-down"
        class="caret-down theme-text-color"
        :style="`color:${selectedEvent.event.backgroundColor}77;`"
      />
      <FAIcon
        v-else-if="!isPopupLeft"
        name="fa-caret-left"
        class="caret-left theme-text-color"
        :style="`color:${selectedEvent.event.backgroundColor}77;`"
      />
      <FAIcon
        v-else
        name="fa-caret-right"
        class="caret-right theme-text-color"
        :style="`color:${selectedEvent.event.backgroundColor}77;`"
      />
      <header
        :style="`background-color:${selectedEvent.event.backgroundColor};`"
        class="theme-background-color"
      >
        <div class="sub-header">
          <h4>
            {{ selectedEvent.event.title }}
          </h4>
          <ul class="options">
            <li
              v-for="option in appEvent.options"
              :key="option.name"
              class="option"
            >
              <button
                :aria-label="option.label"
                :title="option.label"
                :data-test="option.name + '-option'"
                @click="$emit('optionClicked', option)"
              >
                <img
                  v-if="isIconImage(option.icon)"
                  :src="option.icon"
                  :alt="option.label"
                >
                <CustomIcon
                  v-else
                  class="custom-icon"
                  :icon-name="option.icon"
                />
              </button>
            </li>
          </ul>
        </div>
      </header>
      <div class="slot-content">
        <div class="first-line">
          <span
            v-if="selectedEvent.event.extendedProps.teacher || selectedEvent.event.extendedProps.teachers"
            class="teacher"
          >
            <span
              v-for="(teacher, index) in teachers"
              :key="index"
            >
              <a
                href="#"
                style="color: black;"
                class="toggle-user-card"
                @click.stop="openUserCardModal(teacher)"
              >
                {{ teacher.name }}
              </a>
              <span v-if="index < teachers.length - 1">, </span>
            </span>
            {{ appEvent.subject ? ' - ' : '' }}
          </span>
          <span
            v-if="selectedEvent.event.extendedProps.subject"
            class="label"
          >
            {{ selectedEvent.event.extendedProps.subject }}
          </span>
        </div>
        <div>
          {{ formattedHours }}
        </div>
        <div
          v-if="selectedEvent.event.extendedProps.room"
          class="room"
        >
          {{ formattedRoomAndPlaces }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import FAIcon from '@components/Base/FAIcon.vue'
import { getTeachersLabel } from '@utils/commons.util'
import dayjs from 'dayjs'

export default {
  name: 'CalendarEventPopover',
  components: { CustomIcon, FAIcon },
  inject: ['mq'],
  props: {
    selectedEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'optionClicked'],
  computed: {
    appEvent () {
      return this.selectedEvent.event.extendedProps
    },
    isPopupTop () {
      return this.mq.phone
    },
    isPopupLeft () {
      return (window.innerWidth - this.selectedEvent.el.getBoundingClientRect().right) < 350
    },
    popupStyle () {
      if (!this.selectedEvent) {
        return ''
      }
      if (this.isPopupTop) {
        return `bottom:${window.innerHeight - this.selectedEvent.el.getBoundingClientRect().top + 9}px; right:${window.innerWidth - this.selectedEvent.el.getBoundingClientRect().right}px;`
      }
      if (this.isPopupLeft) {
        return `top:${this.selectedEvent.el.getBoundingClientRect().top}px; right:${window.innerWidth - this.selectedEvent.el.getBoundingClientRect().left + 7}px;`
      }
      return `top:${this.selectedEvent.el.getBoundingClientRect().top}px; left:${this.selectedEvent.el.getBoundingClientRect().right + 7}px;`
    },
    formattedHours () {
      return (this.selectedEvent.event.extendedProps.slotNumber !== undefined ? 'P' + this.selectedEvent.event.extendedProps.slotNumber + ' : ' : '') +
        dayjs(this.selectedEvent.event.start).format('HH:mm') +
        ' - ' +
        dayjs(this.selectedEvent.event.end).format('HH:mm')
    },
    teachers () {
      return getTeachersLabel(this.appEvent.teachers)
    },
    inscriptionLeft () {
      return this.appEvent.capacity - this.appEvent.nbRegisteredStudents
    },
    formattedRoomAndPlaces () {
      if (this.inscriptionLeft) {
        return this.$tc('NotUsualSlots.remainingPlaces', this.inscriptionLeft)
      } else {
        return ''
      }
    }
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    isIconImage (iconName) {
      return iconName.indexOf('svg') !== -1
    },
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        this.$emit('close')
      }
    },
    openUserCardModal (teacher) {
      this.$store.dispatch('userCard/initUserCard', teacher)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.event-popup {
  min-width: 14rem;
  max-width: 350px;
  opacity: 1;
  transition: opacity .5s;
  border-radius: 2px;
  position: fixed;
  box-shadow: 0 3px 6px rgba(0,0,0,.12),0 3px 6px rgba(0,0,0,.24);
  background-color: #fff;
  z-index: 10;
  display: flex;
  flex-flow: column nowrap;
  user-select: none;

  &.hide {
    opacity: 0;
  }

  .caret-down {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    left: 0;
    right: 0;
    bottom: -16px;
    font-size: 1.5rem;
  }

  .caret-left {
    position: absolute;
    top: 5px;
    left: -9px;
    font-size: 1.5rem;
  }

  .caret-right {
    position: absolute;
    top: 5px;
    right: -9px;
    font-size: 1.5rem;
  }

  .sub-header {
    background: #FFFFFFBB;
    color: #333;
    padding: 8px;
    display: flex;
    align-items: center;

    h4 {
      margin: 0;
      @extend %font-bold-s;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }

    button {
      margin: 0;
      padding: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .options {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem
    }

    .option {
      img {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  .slot-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    white-space: nowrap;
    @extend %font-regular-xs;

    .first-line {
      @extend %font-bold-s;
    }
  }
}

</style>
