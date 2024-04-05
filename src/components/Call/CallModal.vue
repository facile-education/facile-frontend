<template>
  <WeprodeWindow
    :modal="true"
    :full-screen="mq.phone || mq.tablet"
    :draggable="true"
    data-test="callModal"
    class="callModal"
    @close="onClose"
  >
    <template #header>
      <h1>
        {{ 'Feuille d\'appel' + ' ' + session.event.extendedProps.groupName + ' ' + 'du' + ' ' + formattedDate + ' ' + 'de' + ' ' + formattedHours }}
      </h1>
    </template>

    <template #body>
      <div
        v-if="call"
        class="table"
      >
        <table aria-describedby="Call table">
          <thead>
            <tr>
              <th scope="col">
                Elève
              </th>
              <th scope="col">
                Infos
              </th>
              <th scope="col">
                Abs.
              </th>
              <th scope="col">
                Ret.
              </th>
              <th scope="col">
                Excl.
              </th>
              <th scope="col">
                Inf.
              </th>
              <th scope="col">
                Observations
              </th>
            </tr>
          </thead>
          <tbody>
            <StudentRowItem
              v-for="(student, index) in sortedStudents"
              :key="index"
              :student="student"
            />
          </tbody>
        </table>
      </div>
    </template>
    <template #footer>
      <CallFooterModal />
    </template>
  </WeprodeWindow>
</template>

<script>
import dayjs from 'dayjs'
import _ from 'lodash'

import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'
import CallFooterModal from '@/components/Call/CallFooterModal.vue'

import { getCallDetails } from '../../api/call.service'
import StudentRowItem from './StudentRowItem.vue'
export default {
  name: 'CallModal',
  components: {
    WeprodeWindow,
    CallFooterModal,
    StudentRowItem
  },
  inject: ['mq'],
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      call: undefined,
      isSubmit: false,
      callInfos: []
    }
  },
  computed: {
    formattedHours () {
      return dayjs(this.session.event.start).format('HH:mm') + ' à ' + dayjs(this.session.event.end).format('HH:mm')
    },
    formattedDate () {
      return dayjs(this.session.event.start).locale('fr').format('dddd DD MMMM')
    },
    sortedStudents () {
      return _.orderBy(this.call.students, 'lastName', 'asc')
    }
  },
  created () {
    getCallDetails(this.session.event.extendedProps.sessionId).then(data => {
      if (data.success) {
        this.call = data.call
        console.log(this.call)
      }
    }, (err) => {
      this.error = true
      console.error(err)
    })
  },
  methods: {
    onClose () {
      console.log('close')
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
@import "@design";
h1{
  margin: 0;
  @extend %font-medium-s;
  font-size: 1em;
}
.table{
    table {
        border-collapse: collapse;
        border: 1px solid rgb(140 140 140);
        font-family: sans-serif;
        font-size: 0.8rem;
        letter-spacing: 1px;
        width: 100%;
    }
    th {
    border: 1px solid rgb(160 160 160);
    padding: 8px 10px;
    &:last-child{
        text-align: left;
    }
    }
    thead {
        background-color: rgb(228 240 245);
    }
}
</style>
