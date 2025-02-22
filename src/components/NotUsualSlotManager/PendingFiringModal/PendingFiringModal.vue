<template>
  <WeprodeWindow
    :modal="true"
    :width="600"
    :full-screen="mq.phone || mq.tablet"
    data-test="pending-firing-modal"
    class="pending-firing-modal"
  >
    <template #header>
      <span v-t="'NotUsualSlots.PendingFiringModal.header'" />
    </template>

    <template #body>
      <div class="student">
        <strong v-t="'NotUsualSlots.PendingFiringModal.student'" />
        <span>{{ formattedStudent }}</span>
      </div>
      <div class="slot">
        <strong v-t="'NotUsualSlots.PendingFiringModal.slot'" />
        <span>{{ formattedSlot }}</span>
      </div>
      <div class="slot">
        <strong v-t="'NotUsualSlots.PendingFiringModal.firedTimestamp'" />
        <span>{{ formattedTimestamp }}</span>
      </div>
      <WeprodeTextArea
        ref="comment"
        v-model="justification"
        :placeholder="$t('NotUsualSlots.PendingFiringModal.justificationPlaceholder')"
        style="height:100px;resize:none;"
        @keydown.enter.stop=""
      />
      <WeprodeErrorMessage
        v-if="haveToWriteJustification"
        :error-message="$t('NotUsualSlots.PendingFiringModal.haveToWriteJustification')"
      />
      <div
        v-t="'NotUsualSlots.PendingFiringModal.information'"
        class="information"
      />
      <div
        v-t="'NotUsualSlots.PendingFiringModal.information2'"
        class="information"
      />
    </template>

    <template #footer>
      <WeprodeButton
        :label="$t('NotUsualSlots.PendingFiringModal.sendReason')"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import dayjs from 'dayjs'
import { nextTick } from 'vue'

import { DATE_EXCHANGE_FORMAT } from '@/api/constants'
import offScheduleService from '@/api/offSchedule.service'
import WeprodeErrorMessage from '@/components/Base/Weprode/WeprodeErrorMessage.vue'
import WeprodeTextArea from '@/components/Base/Weprode/WeprodeTextArea.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

export default {
  name: 'PendingFiringModal',
  components: { WeprodeButton, WeprodeErrorMessage, WeprodeTextArea, WeprodeWindow },
  inject: ['mq'],
  props: {
    pendingFiring: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      justification: '',
      haveToWriteJustification: false
    }
  },
  computed: {
    formattedStudent () {
      return this.pendingFiring.student + ' - ' + this.pendingFiring.className
    },
    formattedSlot () {
      if (this.pendingFiring.sourceOffScheduleSessionId !== 0) {
        return this.pendingFiring.subject + ' ' +
          this.$t('Moment.of') + ' ' + dayjs(this.pendingFiring.sessionDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
      } else {
        return this.$t('NotUsualSlots.PendingFiringModal.courseOf', { courseName: this.pendingFiring.subject }) + ' ' +
          this.$t('Moment.of') + ' ' + dayjs(this.pendingFiring.sessionDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
      }
    },
    formattedTimestamp () {
      return this.$t('Moment.the') + ' ' + dayjs(this.pendingFiring.renvoiDate, DATE_EXCHANGE_FORMAT).format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    }
  },
  created () {
    nextTick(() => this.$refs.comment.$el.childNodes[0].focus())
  },
  methods: {
    submit () {
      if (this.justification.trim() !== '') {
        this.haveToWriteJustification = false
        this.setFiringReason()
      } else {
        this.haveToWriteJustification = true
      }
    },
    setFiringReason () {
      offScheduleService.setFiringReason(this.pendingFiring.sessionId, this.pendingFiring.userId, this.justification).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/removePendingFirings', this.pendingFiring)
          // Decrement notification count
          this.$store.dispatch('menu/updateSchoollifeNotification', 1)
        }
      },
      (err) => {
        console.error(err)
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">

.pending-firing-modal {
  z-index: 9 !important;

  &.modal-mask {
    position: absolute;

    .resizable-component {
      left: 50% !important;
      transform: translateX(-50%);
    }
  }

  .window-wrapper {
    max-width: 500px;
  }
}
</style>

<style lang="scss" scoped>
@import '@design';

.slot {
  margin: 10px 0 15px 0;
}

.information {
  margin-top: 15px;
  font-style: italic;
}
</style>
