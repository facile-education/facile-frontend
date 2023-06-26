<template>
  <div class="main">
    <p>dfdf</p>
    <div
      v-if="homeworks && homeworks.length === 0"
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
import dayjs from 'dayjs'
import PentilaUtils from 'pentila-utils'

import { getStudentHomeworks } from '@/api/homework.service'

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
    const minDate = dayjs().day(0).format('YYYY-MM-DD HH:mm')
    const maxDate = dayjs().day(6).format('YYYY-MM-DD HH:mm')
    getStudentHomeworks(this.$store.state.user.userId, minDate, maxDate, false).then((data) => {
      if (data.success) {
        this.homeworks = data.homeworks
      }
    })
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
