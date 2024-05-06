<template>
  <div class="container-student">
    <button
      class="student"
      @click="isExtended = !isExtended"
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
      <div class="right-side">
        <div class="signing-status">
          <div v-if="isAuthorization && isNotAuthorize">
            <span
              class="is-signing"
            >
              <CustomIcon
                icon-name="icon-cross-s"
                class="theme-text-color"
                data-test="not-authorize-icon"
              />
            </span>
          </div>
          <div v-else>
            <span
              v-if="nbSigning === 0"
              class="waiting"
            >
              {{ $t('Logbook.entriesItem.waiting') }}
            </span>
            <span
              v-else-if="isAllParentsRequired && nbSigning < student.parents.length"
              class="nbSigning"
            >
              {{ $t('Logbook.entriesItem.waiting') + '(' + nbSigning + '/' + student.parents.length + ')' }}
            </span>
            <span
              v-else
              class="is-signing"
            >
              <CustomIcon
                :icon-name="isAuthorization && isNotAuthorize ? 'icon-cross-s' : 'icon-check'"
                class="theme-text-color"
                :data-test="isAuthorization && isNotAuthorize ? 'not-authorize-icon' : 'authorize-icon'"
              />
            </span>
          </div>
        </div>
        <CustomIcon
          v-if="!isLeaf"
          :class="isExtended ? 'icon-extend' : 'icon-collapse'"
          icon-name="icon-chevron-right-s"
        />
      </div>
    </button>

    <Transition name="slide-fade">
      <ul
        v-if="isExtended"
        class="parents-details theme-extra-light-background-color"
      >
        <li
          v-for="parent in parents"
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
          <div v-if="isAuthorization">
            <span
              v-if="parent.hasSigned"
              class="theme-text-color"
            >
              <CustomIcon
                :icon-name="parent.hasAuthorized ? 'icon-check' : 'icon-cross-s'"
                class="theme-text-color"
              />
              {{ parent.hasAuthorized ? $t('Logbook.statusModal.hasAuthorized'): $t('Logbook.statusModal.hasNotAuthorized') }}
            </span>
            <span
              v-else
              class="waiting"
            >
              {{ $t('Logbook.entriesItem.waiting') }}
            </span>
          </div>
          <div v-else>
            <span
              v-if="parent.hasSigned"
              class="theme-text-color"
            >
              <CustomIcon
                icon-name="icon-check"
                class="theme-text-color"
              /> {{ $t('Logbook.statusModal.hasSigned') }}
            </span>
            <span
              v-else
              class="waiting"
            >
              {{ $t('Logbook.entriesItem.waiting') }}
            </span>
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
export default {
  name: 'ReadInfoModalPopulation',
  components: {
    CustomIcon
  },
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
      nbSigning: 0
    }
  },
  computed: {
    isNotAuthorize () {
      return this.student.parents.some(parent => parent.hasSigned && !parent.hasAuthorized)
    },
    oneParentSigned () {
      return this.student.parents.some(parent => parent.hasSigned)
    },
    parents () {
      if (!this.isAllParentsRequired && this.oneParentSigned) {
        return this.student.parents.filter(parent => parent.hasSigned)
      } else {
        return this.student.parents
      }
    },
    isAllParentsRequired () {
      return this.student.parents.every(parent => parent.isMandatory)
    }
  },
  created () {
    this.countNbSigning()
  },
  methods: {
    countNbSigning () {
      this.nbSigning = 0
      for (const element of this.student.parents) {
        if (element.hasSigned) {
          this.nbSigning++
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
@import '@/design';

button {
  cursor: pointer;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  border: none;
  border-bottom: 1px solid $neutral-40;
}

.signing-status {
  span {
    @extend %font-regular-s;
    color: $neutral-60;
  }
}

.right-side {
  display: flex;
  align-items: center;
  gap: 8px;
}

.font-icon {
  margin-right: 0.3em;
  font-size: 1.6rem;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  overflow-y: hidden;
  margin-bottom: 10px;

  li {
    display: flex;
    justify-content: space-between;
  }
}

.student {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @extend %font-regular-l;
  margin: 10px 0;
}

.parent {
  @extend %font-medium-s;
  padding: 8px;
}

.waiting {
  color: $neutral-60;
}

.icon-collapse,
.icon-extend {
  transition: transform .4s;
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

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  /* TODO: make max-height adaptive to content height */
  max-height: 300px;
}
</style>
