<template @click.stop="test">
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
        <h4>
          {{ selectedEvent.event.title }}
          <ul class="options">
            <li
              v-for="option in options"
              :key="option.name"
            >
              <button
                :aria-label="option.label"
                :title="option.label"
                @click="$emit('optionClicked', option)"
              >
                <img
                  :src="option.icon"
                  :alt="option.label"
                >
              </button>
            </li>
          </ul>
        </h4>
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
import dayjs from 'dayjs'
import { isEditableSlot } from '@utils/notUsualSlot.util'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
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
  emits: ['close', 'editEvent', 'openRegistration', 'showStudentList', 'optionClicked'],
  computed: {
    options () {
      return this.selectedEvent.event.extendedProps.options
    },
    queriedUser () {
      return this.$store.state.notUsualSlots.queriedUser
    },
    currentUser () {
      return this.$store.state.user
    },
    isAlreadyRegister () {
      // Search if this slot already exist in userSlots
      return this.$store.state.notUsualSlots.userSlots.find(userSlot => userSlot.schoollifeSessionId === this.selectedEvent.event.extendedProps.id)
    },
    selectedClass () {
      return this.$store.state.notUsualSlots.selectedClass
    },
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.selectedEvent.event.extendedProps.type)
    },
    isEditableEvent () {
      return isEditableSlot(this.selectedEvent.event)
    },
    isRegistration () {
      let isAllowed = true
      if (this.slotType !== undefined && this.slotType.type === notUsualSlotsConstants.tutoringType) {
        isAllowed = this.selectedEvent.event.extendedProps.teacher.teacherId === this.currentUser.userId // Only the slot's teacher can register tutoring
      } else if (this.slotType !== undefined && this.slotType.type === notUsualSlotsConstants.firedType) {
        // Only direction, secretaires, doyens and slot's teacher can fire student
        isAllowed = this.currentUser.isDirectionMember ||
          this.currentUser.isSecretariat || this.currentUser.isDoyen ||
          (this.selectedEvent.event.extendedProps.teacher.teacherId === this.currentUser.userId)
      }
      return this.isEditableEvent && (this.queriedUser || this.selectedClass.orgId > 0) &&
        !this.isAlreadyRegister && this.selectedEvent.event.extendedProps.inscriptionLeft > 0 && isAllowed
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
      return dayjs(this.selectedEvent.event.start).format('HH:mm') +
        ' - ' +
        dayjs(this.selectedEvent.event.end).format('HH:mm')
    },
    formattedTeacherName () {
      let label = ''
      if (this.selectedEvent.event.extendedProps.teachers) {
        const teachers = this.selectedEvent.event.extendedProps.teachers
        for (let index = 0; index < teachers.length; ++index) {
          const name = teachers[index].firstName + ' ' + teachers[index].lastName
          label += (label === '') ? name : ', ' + name
        }
      } else {
        label = this.selectedEvent.event.extendedProps.teacher.lastName + ' ' + this.selectedEvent.event.extendedProps.teacher.firstName
      }
      return label + (this.selectedEvent.event.extendedProps.subject ? ' - ' : '')
    },
    formattedRoomAndPlaces () {
      const isPlural = this.selectedEvent.event.extendedProps.inscriptionLeft > 1
      return this.selectedEvent.event.extendedProps.room + (this.selectedEvent.event.extendedProps.inscriptionLeft ? (' - ' + this.selectedEvent.event.extendedProps.inscriptionLeft + ' ' + this.$t('NotUsualSlots.remainingPlaces') + (isPlural ? 's' : '') + ' ' + this.$t('NotUsualSlots.free') + (isPlural ? 's' : '')) : '')
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
    },
    openEditModal () {
      this.$emit('editEvent', this.selectedEvent.event)
      this.$emit('close')
    },
    openRegistration () {
      this.$emit('openRegistration', this.selectedEvent.event)
      this.$emit('close')
    },
    showStudentList () {
      this.$emit('showStudentList', this.selectedEvent.event)
      this.$emit('close')
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

  h4 {
    background: #FFFFFFBB;
    color: #333;
    margin-top: 0;
    margin-bottom: .2rem;
    padding: 5px;
    display: flex;

    .svg-inline--fa {
      margin: 0 5px;
      cursor: pointer;
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
