<template>
  <WeprodeWindow
    class="create-article-modal"
    data-test="create-article-modal"
    :full-screen="mq.phone || mq.tablet"
    :modal="true"
    :draggable="true"
    :width="600"
    @close="onClose"
  >
    <template #header>
      <span v-t="'title'" />
    </template>

    <template #body>
      <WeprodeInput
        ref="nameInput"
        v-model="articleName"
        class="name-input"
        :placeholder="$t('namePlaceHolder')"
      />

      <WeprodeTagsInput
        v-model="selectedRoles"
        class="tags-input"
        :placeholder="$t('rolesPlaceholder')"
        :list="roleList"
        display-field="displayText"
        id-field="roleId"
      />

      <WeprodeDropdown
        v-model="selectedLanguage"
        class="dropdown"
        :list="languageList"
        :sort="false"
      />
    </template>

    <template #footer>
      <WeprodeButton
        data-test="submitButton"
        :label="$t('submit')"
        :disabled="articleName.length === 0"
        @click="submit"
      />
    </template>
  </WeprodeWindow>
</template>

<script>
import { saveItem } from '@/api/help.service'
import { getBroadcastRoleList } from '@/api/role.service'

export default {
  name: 'CreateArticleModal',
  inject: ['mq'],
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
      selectedRoles: [],
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
        } else {
          console.error('Error while getting users', data.error)
        }
      })
    },
    getLanguageList () {
      this.languageList = ['fr']
    },
    submit () {
      saveItem(this.parentCategory.categoryId, { itemName: this.articleName, roles: this.selectedRoles, language: this.selectedLanguage }).then((data) => {
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
.dropdown, .tags-input {
  margin-top: 15px;
  width: 100%;
}
</style>

<i18n locale="fr">
{
  "title": "CRÉER UN ARTICLE",
  "namePlaceHolder": "Titre",
  "rolesPlaceholder": "Roles (laisser vide pour tous)",
  "submit": "Valider"
}
</i18n>
