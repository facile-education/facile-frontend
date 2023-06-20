<template>
  <Layout class="layout">
    <h1 :aria-label="$t('serviceTitle')" />
    <img
      class="icon"
      src="@/assets/images/gar.png"
    >
    <p class="title">
      <strong
        v-t="'serviceLabel'"
        class="important"
      />
      {{ $t('has-been-open-in-new-tab-label') }}.
    </p>
    <p class="description">
      {{ $t('if-not-here-label') }},
      <a
        v-t="'you-click-here-label'"
        class="link"
        :href="managerUrl"
        target="_blank"
      />
      {{ $t('to-open-it-again-label') }}.
    </p>
    <div class="separator" />
    <p class="content">
      {{ $t('issue-found-label') }} <NeroIcon name="chevron-down" />).
    </p>
  </Layout>
</template>

<script>
import NeroIcon from '@/components/Nero/NeroIcon'
import Layout from '@/router/layouts/BannerLayout'

export default {
  name: 'MediacenterManager',
  components: {
    Layout,
    NeroIcon
  },
  computed: {
    managerUrl () {
      return this.$store.state.mediacenter.managerUIUrl
    }
  },
  created () {
    this.$store.dispatch('mediacenter/getManagerUIUrl').then(() => {
      window.open(this.managerUrl)
    })
  }
}
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}

.icon {
  width: 164px;
  height: 164px;
  display: block;
  margin: 40px auto;
}

.title .important {
  font-weight: bold;
}

.description, .title {
  font-size: 1.1rem;
  width: 550px;
  text-align: center;
  margin: auto;
}

.link {
  color: #3083b7;
  text-decoration: underline;
}

.separator {
  width: 230px;
  margin: 15px auto;
  border: solid 1px rgba(0,0,0,0.3);
}

.content {
  width: 510px;
  margin: auto;
  font-size: 0.9rem;
  text-align: center;
}
</style>

<i18n locale="fr">
{
  "serviceTitle": "Administration du médiacentre",
  "has-been-open-in-new-tab-label": "a été ouvert dans un nouvel onglet",
  "if-not-here-label": "Si vous ne le voyez pas",
  "issue-found-label": "Si le problème persiste, votre navigateur doit certainement bloquer les fenêtres surgissantes (pop-ups) ouvertes depuis l'ENT. Pour les autoriser, veuillez suivre la démarche indiquée dans l'onglet \"Autoriser les pop-ups\" de la fenêtre d'informations (accessible depuis le menu utilisateur sur la droite du bandeau",
  "serviceLabel": "GAR Médiacentre",
  "to-open-it-again-label": "pour l'ouvrir à nouveau",
  "you-click-here-label": "cliquez ici"
}
</i18n>
