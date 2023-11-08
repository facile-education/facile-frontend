<template>
  <WeprodeWindow
    :modal="true"
    :draggable="true"
    class="affectations-modal"
    :width="600"
    :hidden-footer="true"
    :full-screen="mq.phone || mq.tablet"
    @close="closeModal"
  >
    <template #header>
      <span v-t="'add-affectation-title'" />
      <span>{{ editedUser.firstName }} {{ editedUser.lastName }}</span>
    </template>

    <template #body>
      <div class="main">
        <!-- Left panel : school tree -->
        <div class="school-classes">
          <WeprodeInput
            ref="classnameInput"
            v-model="filter"
            class="class-filter"
            :maxlength="200"
            :placeholder="$t('classnameFilterPlaceholder')"
          />
          <div
            class="school-header"
          >
            <span
              :class="{ 'is-affected': isAffected(selectedSchool.schoolId) }"
              @click="addAffectation(selectedSchool.schoolId, selectedSchool.schoolName)"
            >{{ selectedSchool.schoolName }}</span>
          </div>
          <div
            v-for="org in filteredOrgs"
            :key="org.orgId"
          >
            <div
              class="org"
              @click="addAffectation(org.orgId, org.orgName)"
            >
              <span
                :class="{ 'is-affected': isAffected(org.orgId) }"
              >{{ org.orgName }}</span>
            </div>
          </div>
        </div>

        <!-- Right panel : user affectations -->
        <div class="user-affectations">
          <p v-if="noAffectation">
            {{ $t('no-affectation') }}
          </p>
          <div
            v-for="affectation in editedUser.affectations"
            :key="affectation.orgId"
            class="affectation-line"
          >
            <div class="affectation">
              <span :title="buildTooltip(affectation)">{{ affectation.orgName }}</span>
              <button
                class="remove-button"
                @click="removeAffectation(affectation)"
              >
                <CustomIcon
                  icon-name="icon-cross-L"
                  class="icon"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </WeprodeWindow>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { getSchoolClassList } from '@/api/organization.service'
import { addUserAffectation, removeUserAffectation } from '@/api/userManagement.service'
import WeprodeInput from '@/components/Base/Weprode/WeprodeInput.vue'
import WeprodeWindow from '@/components/Base/Weprode/WeprodeWindow.vue'

dayjs.extend(localizedFormat)

export default {
  name: 'UserAffectationsModal',
  components: { CustomIcon, WeprodeInput, WeprodeWindow },
  inject: ['mq'],
  props: {
    editedUser: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      filter: '',
      schoolOrgs: []
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    filteredOrgs () {
      return this.schoolOrgs.filter(org => this.filter === '' || org.orgName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
    },
    noAffectation () {
      return this.editedUser.affectations === undefined || this.editedUser.affectations.length === 0
    }
  },
  mounted () {
    getSchoolClassList(this.selectedSchool.schoolId, true).then(
      (data) => {
        if (data.success) {
          this.schoolOrgs = data.orgs
        }
      }
    )
  },
  methods: {
    isAffected (orgId) {
      return this.editedUser.affectations === undefined ? false : this.editedUser.affectations.find(affectation => affectation.orgId === orgId) !== undefined
    },
    buildTooltip (affectation) {
      return this.$t('affected-by') + ' ' + affectation.adminName + this.$t('the') + dayjs(affectation.expirationDate, 'yyyy-MM-dd').format('L')
    },
    closeModal () {
      this.$emit('close')
    },
    addAffectations () {
      this.closeModal()
    },
    addAffectation (orgId, orgName) {
      if (!this.isAffected(orgId)) {
        addUserAffectation(this.editedUser.userId, orgId).then(
          (data) => {
            if (data.success) {
              this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.added'), type: 'success' })
              this.$store.dispatch('userManagement/addUserAffectation', { userId: this.editedUser.userId, orgId, orgName })
            }
          }
        )
      }
    },
    removeAffectation (removedAffectation) {
      removeUserAffectation(this.editedUser.userId, removedAffectation.orgId).then(
        (data) => {
          if (data.success) {
            this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.removed'), type: 'success' })
            this.$store.dispatch('userManagement/removeUserAffectation', { userId: this.editedUser.userId, orgId: removedAffectation.orgId })
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.affectations-modal {

  .main {
    display: flex;
    height: 100%;

    .school-classes {
      width: 50%;
      border-right: solid black 1px;
      overflow: auto;
      margin-left: 20px;

      .class-filter {
        margin-bottom: 20px;
        width: 90%;
      }

      .school-header {
        display: flex;
        height: 20px;
        margin-bottom: 10px;

        :hover:not(.is-affected) {
          background-color: rgb(226, 226, 226);
          cursor: pointer;
        }

        .is-affected {
          font-weight: bold;
        }
      }

      .org {
        margin-left: 30px;
        margin-bottom: 5px;

        :hover:not(.is-affected) {
          background-color: rgb(226, 226, 226);
          cursor: pointer;
        }

        .is-affected {
          font-weight: bold;
        }
      }
    }

    .user-affectations {
      width: 50%;
      overflow: auto;

      p {
        text-align: center;
      }

      .affectation-line {
        margin-left: 20px;
        margin-bottom: 5px;
        display: flex;

        .affectation {
          display: flex;
          border: solid black 1px;
          border-radius: 5px 5px 5px 5px;

          span {
            text-align: center;
            margin: 10px;
          }

          button {
            margin: 0 10px 0 0;
            padding: 0;
            background-color: transparent;
            border: none;
            display: flex;
            align-items: center;

            .icon {
              font-size: 1.2rem;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>

<i18n locale="fr">
{
  "add-affectation-title": "Gérer les affectations de ",
  "affectationPlaceholder": "Saisir le nom ou prénom",
  "collapse": "Replier",
  "expand": "Déplier",
  "no-affectation": "Aucune affectation",
  "remove-affectation": "Supprimer l'affectation",
  "add": "Fermer",
  "classnameFilterPlaceholder": "Filtrer",
  "affected-by": "Affectation ajoutée par ",
  "the": " le ",
  "Popup": {
    "added": "Affectation enregistrée",
    "removed": "Affectation supprimée"
  }
}
</i18n>
