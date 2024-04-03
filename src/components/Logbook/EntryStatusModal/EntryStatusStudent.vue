<template>
  <div class="container-student">
    <button
      class="student"
      @click="isExtended=!isExtended"
    >
      <span>
        <a
          href="#"
          style="color: black;"
          class="toggle-user-card"
          @click.stop="openUserCardModal(student)"
        >
          {{ student.lastName + ' ' + student.firstName }}
        </a>
      </span>
      <span>{{ nbSigning }}/{{ student.parents.length }}</span>
    </button>

    <Transition name="slide-fade">
      <ul v-if="isExtended">
        <li
          v-for="parent in student.parents"
          :key="parent.userId"
          class="parent"
        >
          <a
            href="#"
            style="color: black;"
            class="toggle-user-card"
            @click.stop="openUserCardModal(parent)"
          >
            {{ parent.lastName.toUpperCase() + ' ' + parent.firstName }}
          </a>
          <span v-if="isAuthorization && parent.hasSigned && parent.hasAuthorized">{{ $t('Logbook.statusModal.hasAuthorized') }}</span>
          <span v-if="isAuthorization && parent.hasSigned && !parent.hasAuthorized">{{ $t('Logbook.statusModal.hasNotAuthorized') }}</span>
          <span v-if="isAuthorization && !parent.hasSigned">{{ $t('Logbook.statusModal.isWaiting') }}</span>
          <span v-if="!isAuthorization && parent.hasSigned">{{ $t('Logbook.statusModal.hasSigned') }}</span>
          <span v-if="!isAuthorization && !parent.hasSigned && !parent.hasAuthorized">{{ $t('Logbook.statusModal.hasNotSigned') }}</span>
        </li>
        <li
          v-for="member in sortedUnReadMembers"
          :key="member.userId"
        >
          <InfoModalUser
            :user="member"
            field="hasRead"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script>
import InfoModalUser from '@components/Dashboard/ReadInfos/InfoModalUser.vue'

export default {
  name: 'ReadInfoModalPopulation',
  components: { InfoModalUser },
  props: {
    student: {
      type: Object,
      required: true
    },
    isAuthorization: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isExtended: false,
      nbSigning: 0 // Initialize nbSigning here
    }
  },
  created () {
    this.countNbSigning()
  },
  methods: {
    countNbSigning () {
      this.nbSigning = 0 // Reset nbSigning
      if (this.isAuthorization) {
        for (const element of this.student.parents) {
          if (element.hasAuthorized) {
            this.nbSigning++
          } else if (element.hasSigned && !element.hasAuthorized) {
            this.nbSigning++
          }
        }
      } else {
        for (const element of this.student.parents) {
          if (element.hasSigned) {
            this.nbSigning++
          }
        }
      }
    },
    openUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', user)
    }
  }
}
</script>

  <style lang="scss" scoped>

  .container-student{
    border-bottom: solid 1px;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    margin: 0;
    border: none;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    overflow-y: hidden;
    margin-bottom: 10px;
    li{
        display: flex;
        justify-content: space-between;
    }
  }

  .student {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 5px;
    font-size: 1.15rem;
    margin: 10px 0;
  }

  .parent {
    margin-left: 20px;
    margin-right: 20px;
  }

  .icon-collapse, .icon-extend {
    transition:  transform .4s;
    margin-left: 0.5rem;
  }

  .icon-chevron-right-s {
    font-size: 1.5rem;
  }

  .icon-extend {
    transform: rotate(90deg);
  }

  .icon-collapse {
    transform: rotate(0);
  }

  .slide-fade-enter-active {
    transition: all .3s ease-in;
  }
  .slide-fade-leave-active {
    transition: all .3s ease-out;
  }

  .slide-fade-enter-from, .slide-fade-leave-to {
    max-height: 0;
  }
  .slide-fade-enter-to, .slide-fade-leave-from {
    /* TODO: make max-height adaptive to content height */
    max-height: 300px;
  }
  </style>
