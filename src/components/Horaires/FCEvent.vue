<template>
  <!-- <b>{{ arg.timeText }}</b> -->
  <div
    :data-cy="arg.event.extendedProps.cy"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="fc-event-title"
    >
      <span>{{ arg.event.title }}</span>
      <NeroIcon
        v-if="hasEditionRights && hover"
        name="fa-pencil-alt"
        class="icon"
        @click="updateEvent"
      />
    </div>
    <div
      v-if="arg.event.extendedProps.teachers"
      class="fc-event-teacher"
      :title="arg.event.extendedProps.teachers"
    >
      {{ arg.event.extendedProps.teachers }}
    </div>
    <div class="fc-event-room">
      {{ arg.event.extendedProps.room }}
    </div>
  </div>
</template>

<script>
// Store does not seem to be accessible from this context
import store from '@/store'
import NeroIcon from '@/components/Nero/NeroIcon'

export default {
  name: 'FCEvent',
  components: { NeroIcon },
  props: {
    arg: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  data () {
    return {
      hover: false
    }
  },
  computed: {
    hasEditionRights () {
      const user = store.state.user
      return (user.isDoyen || user.isDirectionMember || user.isSecretariat)
    }
  },
  methods: {
    updateEvent () {
      this.$emit('update', this.arg.event)
    }
  }
}
</script>

<style lang="scss" scoped>
.fc-event-title {
  display: flex;
  align-items: center;
}

.icon {
  margin-left: auto;
  margin-right: 5px;

  &:hover {
    cursor: pointer;
  }
}
</style>
