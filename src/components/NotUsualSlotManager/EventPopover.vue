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
          <span class="options">
            <NeroIcon
              v-if="isEditableEvent"
              name="fa-list"
              data-test="showStudentList-option"
              @click="showStudentList"
            />
            <NeroIcon
              v-if="isRegistration"
              name="fa-user-plus"
              data-test="openRegistration-option"
              @click="openRegistration"
            />
            <NeroIcon
              v-if="isEditableEvent && (currentUser.isDoyen || currentUser.isDirectionMember || currentUser.isSecretariat)"
              name="fa-pencil-alt"
              data-test="openEditModal-option"
              @click="openEditModal"
            />
          </span>
        </h4>
      </header>
      <div class="slot-content">
        <div>
          <span
            v-if="selectedEvent.event.extendedProps.teacher"
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
import { isEditableSlot } from '@utils/notUsualSlotUtils'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'EventPopover',
  components: { NeroIcon },
  inject: ['mq'],
  props: {
    selectedEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'editEvent', 'openRegistration', 'showStudentList'],
  computed: {
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
      let bool = true
      if (this.slotType !== undefined && this.slotType.type === notUsualSlotsConstants.tutoringType) {
        bool = this.selectedEvent.event.extendedProps.teacher.teacherId === this.currentUser.userId // Only the slot's teacher can register tutoring
      }
      return this.isEditableEvent && (this.queriedUser || this.selectedClass.classId > 0) &&
        !this.isAlreadyRegister && this.selectedEvent.event.extendedProps.inscriptionLeft > 0 && bool
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
      return this.selectedEvent.event.extendedProps.teacher.lastName + ' ' + this.selectedEvent.event.extendedProps.teacher.firstName +
        (this.selectedEvent.event.extendedProps.subject ? ' - ' : '')
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
