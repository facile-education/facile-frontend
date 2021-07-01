<template>
  <div
    class="event-popup"
    :class="{'hide': (selectedEvent === undefined)}"
    :style="popupStyle"
  >
    <template v-if="selectedEvent">
      <i
        v-if="!isPopupLeft"
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
          <i
            class="fa fa-pencil-alt"
            @click="openEditModal"
          />
          <i
            class="fa fa-times"
            @click="unselectEvent"
          />
        </h4>
      </header>
      <div>
        <label>Content</label>
        {{ selectedEvent.event.extendedProps }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'EventPopover',
  props: {
    selectedEvent: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  computed: {
    isPopupLeft () {
      return (window.innerWidth - this.selectedEvent.el.getBoundingClientRect().right) < 350
    },
    popupStyle () {
      if (!this.selectedEvent) {
        return ''
      }
      if (this.isPopupLeft) {
        return `top:${this.selectedEvent.el.getBoundingClientRect().top}px; right:${window.innerWidth - this.selectedEvent.el.getBoundingClientRect().left + 7}px;`
      }
      return `top:${this.selectedEvent.el.getBoundingClientRect().top}px; left:${this.selectedEvent.el.getBoundingClientRect().right + 7}px;`
    }
  },
  methods: {
    openEditModal () {
      console.log('should edit', this.selectedEvent)
    },
    unselectEvent () {
      this.emits('close')
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

    .fa-pencil-alt {
      margin-left: auto;
    }
  }

  div {
    margin: 0;
    padding: 5px;
  }
}

</style>
