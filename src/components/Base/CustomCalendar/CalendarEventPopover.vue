<template>
  <div
    class="event-popup"
    data-test="event-popup"
    :class="{'hide': (selectedEvent === undefined)}"
    :style="popupStyle"
  >
    <template v-if="selectedEvent">
      <NeroIcon
        v-if="isPopupTop"
        name="fa-caret-down"
        class="caret-down theme-text-color"
        :style="`color:${selectedEvent.event.backgroundColor};`"
      />
      <NeroIcon
        v-else-if="!isPopupLeft"
        name="fa-caret-left"
        class="caret-left theme-text-color"
        :style="`color:${selectedEvent.event.backgroundColor};`"
      />
      <NeroIcon
        v-else
        name="fa-caret-right"
        class="caret-right theme-text-color"
        :style="`color:${selectedEvent.event.backgroundColor};`"
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
            >
              <button
                :aria-label="option.label"
                :title="option.label"
                :data-test="option.name + '-option'"
                @click="$emit('optionClicked', option)"
              >
                <NeroIcon
                  :name="option.icon"
                />
              </button>
            </li>
          </ul>
        </div>
      </header>
      <div class="slot-content">
        <div>
          <span
            v-if="selectedEvent.event.extendedProps.teacher || selectedEvent.event.extendedProps.teachers"
            class="teacher"
          >
            {{ formattedTeacherName }}
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
import { getTeachersLabel } from '@utils/commons.util'
import dayjs from 'dayjs'

import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'CalendarEventPopover',
  components: { NeroIcon },
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
    formattedTeacherName () {
      return getTeachersLabel(this.appEvent.teachers) + (this.appEvent.subject ? ' - ' : '')
    },
    inscriptionLeft () {
      return this.appEvent.capacity - this.appEvent.nbRegisteredStudents
    },
    formattedRoomAndPlaces () {
      const isPlural = this.inscriptionLeft > 1
      return this.appEvent.room + (this.inscriptionLeft ? (' - ' + this.inscriptionLeft + ' ' + this.$t('NotUsualSlots.remainingPlaces') + (isPlural ? 's' : '') + ' ' + this.$t('NotUsualSlots.free') + (isPlural ? 's' : '')) : '')
    }
  },
  mounted () {
    window.addEventListener('click', this.clickOutside)
  },
  beforeUnmount () {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside (e) {
      const self = this
      if (self.$el && !self.$el.contains(e.target)) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-popup {
  min-width: 14rem;
  max-width: 350px;
  opacity: 1;
  transition: opacity .5s;
  border-radius: 2px;
  position: absolute;
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
    padding: 5px;
    display: flex;
    align-items: center;

    .svg-inline--fa {
      margin: 0 5px;
      cursor: pointer;
    }

    h4 {
      margin-top: 0;
      margin-bottom: .2rem;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      cursor: pointer;
      display: flex;
    }

    button {
      margin: 0;
      padding: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }

    .options {
      margin-left: auto;
    }
  }

  .slot-content {
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.9em;
    padding: 10px;

    .room {
      font-style: italic;
    }
  }
}

</style>
