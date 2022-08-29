<template>
  <PentilaWindow
    :modal="true"
    class="user-import"
    :width="600"
    :class="{'mobile': mq.phone}"
    @close="closeModal"
  >
    <template #header>
      <span>{{ $t('import-title') + ' - ' + selectedSchool.schoolName }}</span>
    </template>

    <template #body>
      <p class="instructions">
        Pour réaliser un import d'utilisateurs par lot, il est nécessaire d'utiliser un fichier CSV respectant le format décrit ci-dessous :<br>
      </p>
      <ul>
        <li>Chaque entrée contient les informations suivante <strong>nom;prénom;date de naissance;e-mail;profil</strong></li>
        <li>Le fichier doit être encodé en <strong>UTF-8</strong>.</li>
        <li>La date doit être au format <strong>JJ/MM/AAAA</strong>.</li>
        <li>Le profil doit être selectionné parmi les identifiants suivants (SDET) :</li>
      </ul>
      <table class="sdet-profiles">
        <tr><th>Profil</th><th>Description du périmètre</th></tr>
        <tr><td>National_1</td><td>Élève</td></tr>
        <tr><td>National_2</td><td>Responsable d'un élève (parent, tuteur légal)</td></tr>
        <tr><td>National_3</td><td>Enseignant</td></tr>
        <tr><td>National_4</td><td>Personnel de direction de l'établissement</td></tr>
        <tr><td>National_5</td><td>Personnel de vie scolaire travaillant dans l'établissement</td></tr>
        <tr><td>National_6</td><td>Personnel administratif, technique ou d'encadrement travaillant dans l'établissement</td></tr>
        <tr><td>National_7</td><td>Personnel de rectorat, de DRAF, de collectivité territoriale, d'inspection académique </td></tr>
      </table>
      <p>
        Exemple :<br>
        <em>Dupont;Jean;06/08/1975;jean.dupont@academie.fr;National_3<br>
          Dubois;Marie;19/11/1970;marie.dubois@academie.fr;National_6</em>
      </p>
      <p>NB: Un e-mail contenant les informations d'authentification sera envoyé à chaque utilisateur.</p>
      <div>
        <PentilaButton
          :label="$t('file-picker')"
          class="picker"
          @click="onPickFile"
        />
        <input
          ref="fileInput"
          type="file"
          accept=".csv,.txt"
          style="display:none;"
          @change="onFilePicked"
        >
        <span v-if="file">{{ file.name }}</span>
        <span
          v-else
          v-t="'no-file-selected'"
        />
      </div>
    </template>

    <template #footer>
      <PentilaButton
        :label="$t('import')"
        :disabled="file === undefined"
        class="button"
        @click="importUserList"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { importUserList } from '@/api/userManagement.service'

export default {
  name: 'ImportUserListModal',
  inject: ['mq'],
  emits: ['close'],
  data () {
    return {
      file: undefined
    }
  },
  computed: {
    selectedSchool () {
      return this.$store.state.user.selectedSchool
    }
  },
  mounted () {},
  methods: {
    closeModal () {
      this.$emit('close')
    },
    importUserList () {
      importUserList(this.file, this.selectedSchool.schoolId).then(
        (data) => {
          console.log('data', data)
          if (data.success) {
            this.closeModal()
          }
        }
      )
    },
    onFilePicked (event) {
      const files = event.target.files
      this.file = files[0]
    },
    onPickFile () {
      this.$refs.fileInput.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.instructions, .user-import ul {
  margin-top: 0;
}

.sdet-profiles th {
  text-align: left;
}

.picker {
  margin-right: 10px;
}
</style>

<style lang="scss">
.user-import .window-body {
  display: flex;
  overflow: auto;
  flex-direction: column;
}
</style>

<i18n locale="fr">
{
  "file-picker": "Sélection d'un fichier",
  "import-title": "Import d'utilisateurs",
  "import": "Importer",
  "no-file-selected": "Aucun fichier n'a été selectionné"
}
</i18n>
