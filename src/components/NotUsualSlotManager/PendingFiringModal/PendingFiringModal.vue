<template>
  <PentilaWindow
    :modal="true"
    width="500px"
    class="pending-firing-modal"
    @keydown.exact.enter.stop=""
    @keydown.exact.backspace.stop=""
    @keydown.exact.delete.stop=""
    @keydown.exact.f2.stop=""
    @keydown.ctrl.stop=""
  >
    <template #header>
      <span v-t="'NotUsualSlots.PendingFiringModal.header'" />
    </template>

    <template #body>
      <div class="student">
        <span v-t="'NotUsualSlots.PendingFiringModal.student'" />
        <span>{{ formattedStudent }}</span>
      </div>
      <div class="slot">
        <span v-t="'NotUsualSlots.PendingFiringModal.slot'" />
        <span>{{ formattedSlot }}</span>
      </div>
      <div class="slot">
        <span v-t="'NotUsualSlots.PendingFiringModal.firedTimestamp'" />
        <span>{{ formattedTimestamp }}</span>
      </div>
      <textarea
        v-model="justification"
        :placeholder="$t('NotUsualSlots.PendingFiringModal.justificationPlaceholder')"
        @keydown.enter.stop=""
      />
      <PentilaErrorMessage
        v-if="haveToWriteJustification"
        :error-message="$t('NotUsualSlots.PendingFiringModal.haveToWriteJustification')"
      />
      <div
        v-t="'NotUsualSlots.PendingFiringModal.information'"
        class="information"
      />
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('NotUsualSlots.PendingFiringModal.sendReason')"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { toPascalCase } from '@utils/commons.util'
import dayjs from 'dayjs'
import schoolLifeService from '@/api/schoolLife-portlet.service'

export default {
  name: 'PendingFiringModal',
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
      return toPascalCase(this.pendingFiring.student) + ' - ' + this.pendingFiring.className
    },
    formattedSlot () {
      if (this.pendingFiring.sourceSchoollifeSessionId !== 0) {
        return this.pendingFiring.subject + ' ' +
          this.$t('Moment.of') + ' ' + dayjs(this.pendingFiring.sessionDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
      } else {
        return this.$t('NotUsualSlots.PendingFiringModal.courseOf') + this.pendingFiring.subject + ' ' +
          this.$t('Moment.of') + ' ' + dayjs(this.pendingFiring.sessionDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
      }
    },
    formattedTimestamp () {
      return this.$t('Moment.the') + ' ' + dayjs(this.pendingFiring.renvoiDate, 'YYYY/MM/DD HH:mm').format('DD MMMM YYYY ' + this.$t('Moment.at') + ' HH:mm')
    }
  },
  created () {
    // TODO: focus textarea
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
      schoolLifeService.setFiringReason(this.pendingFiring.schoollifeSessionId, this.pendingFiring.studentId, this.justification).then((data) => {
        if (data.success) {
          this.$store.dispatch('notUsualSlots/removePendingFirings', this.pendingFiring)
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

<style lang="scss" scoped>
@import '@design';

.pending-firing-modal {
  font-family: "Roboto", sans-serif;
  color: #0B3C5F;
}

.student, .slot {
  font-weight: bold;
}

.slot{
  margin: 10px 0 15px 0;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px 10px;
  line-height: 10px;
  resize: none;
  border: 1px solid $color-cadyco-dark-text;
  border-radius: 6px;
  color: $color-cadyco-dark-text;
}

.information {
  margin-top: 15px;
  font-weight: bold;
  font-style: italic;
}

.footer {
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.button {
  display: flex;
  font-weight: bold;
  width: 125px;
  height: 35px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  color: white;
  cursor: pointer;
}

.confirm-button {
  background-color: #C4C4C4;
}
</style>
