<template>
  <div class="main">
    <p>dfdf</p>
    <div
      v-if="homeworkList && homeworkList.length === 0"
      class="main-label"
    >
      <p>{{ $t('no-homeworks') }}</p>
    </div>
    <div
      v-else
      class="homeworks"
    >
      <Homework
        v-for="homework in sortedHomeworks"
        :key="homework"
      >
        <p>devoir</p>
      </homework>
    </div>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import { getFutureStudentHomeworks, getTeacherHomeworksToCorrect } from '@/api/homework.service'
export default {
  name: 'HomeworkTab',
  components: {},
  data () {
    return {
      homeworks: []
    }
  },
  computed: {
    sortedHomeworks () {
      return PentilaUtils.Array.sortWithString(this.homeworks, false, 'targetDate')
    }
  },
  created () {
    if (this.$store.state.user.isStudent) {
      getFutureStudentHomeworks(this.$store.state.user.userId, false).then((data) => {
        if (data.success) {
          this.homeworks = data.homeworks
        }
      })
    } else if (this.$store.state.user.isTeacher) {
      getTeacherHomeworksToCorrect().then((data) => {
        if (data.success) {
          this.homeworks = data.homeworks
        }
      })
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@design';

  .main-label {
    margin-top: 10em;
    text-align: center;
  }

</style>

<i18n locale="fr">
{
  "action": "Editer",
  "display": "Résultats 1",
  "to": "à",
  "over": "sur un total de",
  "create": "Ajouter un utilisateur",
  "no-users" : "Aucun compte manuel pour cet établissement",
  "please-select-school": "Veuillez sélectionner un établissement",
  "email": "E-mail",
  "firstName": "Prénom",
  "lastName": "Nom",
  "login": "Identifiant",
  "role": "Profil",
  "search": "Recherche",
  "nameFilterPlaceholder": "Filtrer par nom / prénom"
}
</i18n>
