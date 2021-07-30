<template @click.stop="test">
  <div
    class="event-popup"
    :class="{'hide': (selectedEvent === undefined)}"
    :style="popupStyle"
  >
    <template v-if="selectedEvent">
      <i
        v-if="isPopupTop"
        :style="`color:${selectedEvent.event.backgroundColor};`"
        class="fa fa-caret-down theme-text-color"
      />
      <i
        v-else-if="!isPopupLeft"
        :style="`color:${selectedEvent.event.backgroundColor};`"
        class="fa fa-caret-left theme-text-color"
      />
      <i
        v-else
        :style="`color:${selectedEvent.event.backgroundColor};`"
        class="fa fa-caret-right theme-text-color"
      />
      <header
        :style="`background-color:${selectedEvent.event.backgroundColor};`"
        class="theme-background-color"
      >
        <h4>
          {{ selectedEvent.event.title }}
          <span class="options">
            <i
              v-if="isEditableEvent"
              class="fas fa-list"
              @click="showStudentList"
            />
            <i
              v-if="isRegistration"
              class="fas fa-user-plus"
              @click="openRegistration"
            />
            <i
              v-if="isEditableEvent && currentUser.isDoyen || currentUser.isDirectionMember || currentUser.isSecretariat"
              class="fa fa-pencil-alt"
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
import moment from 'moment'
import { isEditableSlot } from '@utils/notUsualSlotUtils'
import notUsualSlotsConstants from '@/constants/notUsualSlots'
export default {
  name: 'EventPopover',
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
    slotType () {
      return notUsualSlotsConstants.getSlotTypeByNumber(this.selectedEvent.event.extendedProps.type)
    },
    isEditableEvent () {
      return isEditableSlot(this.selectedEvent.event)
    },
    isRegistration () {
      let bool = true
      if (this.slotType.type === notUsualSlotsConstants.tutoringType) {
        bool = this.selectedEvent.event.extendedProps.teacher.teacherId === this.currentUser.userId // Only the slot's teacher can register tutoring
      }
      return this.isEditableEvent && this.queriedUser && !this.isAlreadyRegister && this.selectedEvent.event.extendedProps.inscriptionLeft > 0 && bool
    },
    isPopupTop () {
      return this.$device.phone
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
      return moment(this.selectedEvent.event.start, 'YYYY-MM-DDTHH:mm').format('HH:mm') +
        ' - ' +
        moment(this.selectedEvent.event.end, 'YYYY-MM-DDTHH:mm').format('HH:mm')
    },
    formattedTeacherName () {
      return this.selectedEvent.event.extendedProps.teacher.firstName + ' ' + this.selectedEvent.event.extendedProps.teacher.lastName +
        (this.selectedEvent.event.extendedProps.subject ? ' - ' : '')
    },
    formattedRoomAndPlaces () {
      return this.selectedEvent.event.extendedProps.room + (this.selectedEvent.event.extendedProps.inscriptionLeft !== undefined ? (' - ' + this.selectedEvent.event.extendedProps.inscriptionLeft + ' ' + this.$t('NotUsualSlots.remainingPlaces') + (this.selectedEvent.event.extendedProps.inscriptionLeft > 1 ? 's' : '')) : '')
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

  .fa-caret-down {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    left: 0;
    right: 0;
    bottom: -16px;
    font-size: 1.5rem;
  }

  .fa-caret-left {
    position: absolute;
    top: 5px;
    left: -9px;
    font-size: 1.5rem;
  }

  .fa-caret-right {
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

    i {
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
