<template>
  <PentilaWindow
    :modal="true"
    :draggable="true"
    class="affectations-modal"
    :width="600"
    :class="{'mobile': mq.phone}"
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
          <PentilaInput
            ref="classnameInput"
            v-model="filter"
            class="class-filter"
            :maxlength="200"
            :placeholder="$t('classnameFilterPlaceholder')"
          />
          <div
            v-for="school in schools"
            :key="school.schoolId"
            class="school"
          >
            <div
              class="school-header"
            >
              <img
                v-if="!school.isExpanded"
                src="@assets/arrow-right.svg"
                :alt="$t('expand')"
                :title="$t('expand')"
                @click="toggleSchool(school)"
              >
              <img
                v-else
                src="@assets/arrow-down.svg"
                :alt="$t('collapse')"
                :title="$t('collapse')"
                @click="toggleSchool(school)"
              >
              <div class="school-name">
                <span
                  :class="{ 'is-affected': isAffected(school.schoolId) }"
                  @click="addAffectation(school.schoolId, school.schoolName)"
                >{{ school.schoolName }}</span>
              </div>
            </div>
            <div
              v-if="school.isExpanded"
              class="org-list"
            >
              <div
                v-for="org in filteredOrgs(school.orgs)"
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
          </div>
        </div>

        <!-- Right panel : user affectations -->
        <div class="user-affectations">
          <p v-if="noAffectation">{{ $t('no-affectation') }}</p>
          <div
            v-for="affectation in editedUser.affectations"
            :key="affectation.orgId"
            class="affectation-line"
          >
            <div class="affectation">
              <span :title="buildTooltip(affectation)">{{ affectation.orgName }}</span>
              <img
                class="remove-affectation"
                src="@assets/big-cross-black.svg"
                :alt="$t('remove-affectation')"
                :title="$t('remove-affectation')"
                @click="removeAffectation(affectation)"
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('add')"
        class="button"
        @click="addAffectations"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { addUserAffectation, removeUserAffectation } from '@/api/userManagement.service'
import { getSchoolCLassList } from '@/api/organization.service'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

export default {
  name: 'UserAffectationsModal',
  inject: ['mq'],
  props: {
    editedUser: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup: () => ({ v$: useVuelidate() }),
  validations: {
    selectedDelegates: { required }
  },
  data () {
    return {
      schools: [],
      filter: ''
    }
  },
  computed: {
    formErrorList () {
      return {
        selectedDelegates: (this.v$.selectedDelegates.$invalid && this.v$.selectedDelegates.$dirty) ? this.$t('Commons.required') : ''
      }
    },
    noAffectation () {
      return this.editedUser.affectations === undefined || this.editedUser.affectations.length === 0
    }
  },
  mounted () {
    this.schools = JSON.parse(JSON.stringify(this.$store.getters['user/adminSchoolList']))
    console.log('schools length=', this.schools.length)
    // If 1 school, it is expanded, else not
    if (this.schools.length === 1) {
      this.schools[0].isExpanded = true
      this.fetchOrgs(this.schools[0])
    } else {
      console.log('schools=', this.schools)
      this.schools.forEach((school) => {
        school.isExpanded = false
      })
    }
  },
  methods: {
    isAffected (orgId) {
      return this.editedUser.affectations === undefined ? false : this.editedUser.affectations.find(affectation => affectation.orgId === orgId) !== undefined
    },
    filteredOrgs (orgs) {
      if (orgs !== undefined) {
        return orgs.filter(org => this.filter === '' || org.orgName.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
      }
      return []
    },
    buildTooltip (affectation) {
      return this.$t('affected-by') + ' ' + affectation.adminName + this.$t('the') + dayjs(affectation.expirationDate, 'yyyy-MM-dd').format('L')
    },
    closeModal () {
      this.$emit('close')
    },
    fetchOrgs (school) {
      if (school.orgs === undefined) {
        // Fetch classes, groups and cours
        getSchoolCLassList(school.schoolId, true).then(
          (data) => {
            if (data.success) {
              const schoolIndex = this.schools.map(school => school.schoolId).indexOf(school.schoolId)
              this.schools[schoolIndex].orgs = data.orgs
            }
          }
        )
      }
    },
    toggleSchool (school) {
      school.isExpanded = !school.isExpanded
      this.fetchOrgs(school)
    },
    addAffectations () {
      this.closeModal()
    },
    addAffectation (orgId, orgName) {
      if (!this.isAffected(orgId)) {
        addUserAffectation(this.editedUser.userId, orgId).then(
          (data) => {
            if (data.success) {
              console.log('add ok')
              this.$store.dispatch('userManagement/addUserAffectation', { userId: this.editedUser.userId, orgId: orgId, orgName: orgName })
            }
          }
        )
      }
    },
    removeAffectation (removedAffectation) {
      console.log('removing affectation ', removedAffectation)
      removeUserAffectation(this.editedUser.userId, removedAffectation.orgId).then(
        (data) => {
          if (data.success) {
            console.log('remove ok')
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
    height: 400px;
    max-height: 400px;
    display: flex;
    .school-classes {
      width: 50%;
      border-right: solid black 1px;
      overflow: auto;
      .class-filter {
        margin-bottom: 20px;
        width: 90%;
      }
      .school {
        margin-left: 20px;
        .school-header {
          display: flex;
          height: 20px;
          margin-bottom: 10px;
          img {
            width: 10px;
            margin-right: 10px;
          }
          .school-name {
            :hover:not(.is-affected) {
              background-color: rgb(226, 226, 226);
              cursor: pointer;
            }
            .is-affected {
              font-weight: bold;
            }
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
          img {
            width: 15px;
            margin-right: 10px;
            &:hover {
              cursor: pointer;
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
  "the": " le "
}
</i18n>
