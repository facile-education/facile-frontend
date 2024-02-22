<template>
  <div v-if="isAdministrator || links.length > 0">
    <h3>
      {{ $t('HelpModal.ExternalLinks.external-links') }}
      <CustomIcon
        v-if="isAdministrator"
        data-test="admin-create-category-button"
        icon-name="icon-plus"
        @click="isCreateExternalLinkModalDisplayed=true"
      />
    </h3>
    <ul>
      <li
        v-for="(link, index) in links"
        :key="index"
      >
        <a
          :href="link.linkUrl"
          target="_blank"
        >{{ link.linkName }}</a>
        <img
          v-if="isAdministrator"
          src="@/assets/icons/trash.svg"
          class="icon-admin"
          alt="delete"
          @click="confirmLinkRemoval(link)"
        >
      </li>
    </ul>
  </div>

  <teleport to="body">
    <CreateExternalLinkModal
      v-if="isCreateExternalLinkModalDisplayed"
      @close="isCreateExternalLinkModalDisplayed=false"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import { defineAsyncComponent } from 'vue'

import { deleteLink } from '@/api/help.service'
const CreateExternalLinkModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/CreateExternalLinkModal.vue'))

export default {
  name: 'ExternalLinks',
  components: { CustomIcon, CreateExternalLinkModal },
  props: {
    links: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isCreateExternalLinkModalDisplayed: false
    }
  },
  computed: {
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  methods: {
    confirmLinkRemoval (link) {
      this.$store.dispatch('warningModal/addWarning', {
        text: this.$t('HelpModal.ExternalLinks.confirmLinkRemovalMessage'),
        lastAction: { fct: this.deleteLink, params: [link] }
      })
    },
    deleteLink (link) {
      deleteLink(link.linkId).then((data) => {
        if (data.success) {
          this.$store.dispatch('help/refreshCurrentArticle')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

h3 {
  margin-top: 0.5rem;
  text-transform: uppercase;
  border-bottom: 1px solid $color-border;
  color: $color-grey-text;
  font-weight: bold;
  padding-bottom: 1em;
  font-size: 0.75em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    .icon-plus {
      cursor: pointer;
      opacity: 100%;
    }
  }

  .icon-plus {
    font-size: 1.25rem;
    opacity: 0;
  }
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: $color-hover-bg;

    .icon-admin {
      opacity: 100%;
      cursor: pointer;
    }
  }
}

a {
  flex: 1;
  height: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 0.813em;
  color: black;
  text-decoration: none;
  line-height: 1;
}

.icon-admin {
  opacity: 0;
}
</style>
