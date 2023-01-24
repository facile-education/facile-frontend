<template>
  <PentilaWindow
    class="create-article-modal"
    data-test="create-article-modal"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <PentilaInput
        ref="nameInput"
        v-model="articleName"
        class="name-input"
        :placeholder="$t('namePlaceHolder')"
      />

      <PentilaDropdown
        v-model="selectedRole"
        class="dropdown"
        :list="roleList"
        :sort="false"
        display-field="displayText"
      />

      <PentilaDropdown
        v-model="selectedLanguage"
        class="dropdown"
        :list="languageList"
        :sort="false"
      />
    </template>

    <template #footer>
      <PentilaButton
        data-test="submitButton"
        :label="$t('submit')"
        :disabled="articleName.length === 0"
        @click="submit"
      />
    </template>
  </PentilaWindow>
</template>

<script>
import { getBroadcastRoleList } from '@/api/role.service'
import { saveItem } from '@/api/help.service'

export default {
  name: 'CreateArticleModal',
  props: {
    parentCategory: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data () {
    return {
      articleName: '',
      selectedRole: { roleId: 0, displayText: 'Roles (laisser vide pour tous)' }, // TODO: Find a more satisfying way to do the dropdown placeholder
      roleList: [],
      selectedLanguage: 'fr',
      languageList: []
    }
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
    this.getRoleList()
    this.getLanguageList()
  },
  mounted () {
    const input = this.$refs.nameInput
    input.focus()
    input.select()
  },
  methods: {
    getRoleList () {
      getBroadcastRoleList().then((data) => {
        if (data.success) {
          this.roleList = data.roles
          this.roleList.push({ roleId: 0, displayText: 'Roles (laisser vide pour tous)' })
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    getLanguageList () {
      this.languageList = ['fr']
    },
    submit () {
      saveItem(this.parentCategory.categoryId, { itemName: this.articleName, roles: this.selectedRole, language: this.selectedLanguage }).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/getHelpMenu', { query: '' })
          this.onClose()
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  margin-top: 15px;
  width: 100%;
}
</style>

<i18n locale="fr">
{
  "title": "CRÉER UN ARTICLE",
  "namePlaceHolder": "Titre",
  "submit": "Valider"
}
</i18n>
