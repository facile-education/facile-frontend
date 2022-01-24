<template>
  <div class="gar-admin">
    <!-- TODO Check if school has GAR and display error when over max admin number allowed-->
    <div class="search">
      <UserCompletion
        :model-value="garAdminList"
        :max-size="maxSize"
        user-type="teacher"
        :placeholder="$t('agent')"
        @update:modelValue="selectUser"
      />
    </div>
    <div class="gar-admins">
      <div v-if="selectedSchool === undefined">
        <p>{{ $t('please-select-school') }}</p>
      </div>
      <div v-else>
        <div v-if="garAdminList.length === 0">
          <p>{{ $t('no-admin') }}</p>
        </div>
        <div
          v-else
          class="admin-list"
        >
          <p>{{ $t('admins-for-school') }} {{ selectedSchool.schoolName }} {{ $t('are') }}</p>
          <table style="width:100%">
            <tr>
              <th
                v-t="'lastName'"
                style="width:30%"
              />
              <th
                v-t="'firstName'"
                style="width:30%"
              />
              <th />
            </tr>
            <tr
              v-for="admin in sortedGarAdminList"
              :key="admin.userId"
            >
              <td>{{ admin.lastName }}</td>
              <td>{{ admin.firstName }}</td>
              <td>
                <PentilaButton
                  v-if="!admin.isDirectionMember && !admin.isENTAdmin"
                  cls="delete"
                  @click="confirmAdminRemoval(admin)"
                >
                  <NeroIcon name="trash" />
                </PentilaButton>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import { addGARAdminList, deleteGARAdminList, getSchoolAdminList } from '@/api/mediacenter.service'
import NeroIcon from '@/components/Nero/NeroIcon'
import UserCompletion from '@/components/NotUsualSlotManager/UserCompletion'

export default {
  name: 'GARAdmin',
  components: {
    NeroIcon,
    UserCompletion
  },
  data () {
    return {
      garAdminList: [],
      maxSize: -1
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    },
    sortedGarAdminList () {
      return PentilaUtils.Array.sortWithString(this.garAdminList, false, 'lastName')
    }
  },
  watch: {
    selectedSchool (value, oldValue) {
      this.refreshAdminList()
    }
  },
  created () {
    this.refreshAdminList()
  },
  methods: {
    confirmAdminRemoval (user) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('warning'),
        lastAction: { fct: this.removeGARAdmin, params: [user] }
      })
    },
    refreshAdminList () {
      getSchoolAdminList(this.selectedSchool.schoolId).then(
        (data) => {
          if (data.success) {
            this.maxSize = data.maxAdminNb
            this.garAdminList = data.admins
          }
        }
      )
    },
    selectUser (users) {
      // if action is triggered by delete key do nothing
      if (this.garAdminList.length > users.length) return

      const lastUser = users[users.length - 1]
      addGARAdminList(this.selectedSchool.schoolId, false, lastUser.userId).then(
        (data) => {
          if (data.success) {
            this.garAdminList.push(data.admin)
          }
        }
      )
    },
    removeGARAdmin (user) {
      deleteGARAdminList(this.selectedSchool.schoolId, false, user.userId).then(
        (data) => {
          if (data.success) {
            const adminIndex = this.garAdminList.map(admin => admin.userId).indexOf(user.userId)
            if (adminIndex !== -1) {
              this.garAdminList.splice(adminIndex, 1)
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

.gar-admin {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.gar-admins {
  height: 100%;
}

th {
  text-align: left;
}
</style>

<style lang="scss">
.gar-admin .tag-list {
  display: none;
}
</style>

<i18n locale="fr">
{
  "admins-for-school": "Les administrateurs de ",
  "agent": "Agent",
  "are": "sont:",
  "firstName": "Prénom",
  "lastName": "Nom",
  "no-admin" : "Aucun administrateur",
  "please-select-school": "Veuillez sélectionner un établissement",
  "warning": "La suppression de cet administrateur est définitive."
}
</i18n>
