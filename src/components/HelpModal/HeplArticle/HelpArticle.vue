<template>
  <article
    class="article"
    :class="{'phone': mq.phone}"
  >
    <WeprodeSpinner v-if="isLoadingArticle" />
    <section
      v-if="article"
      class="article-content"
      :class="{'phone': mq.phone}"
    >
      <div class="header">
        <h2 class="theme-text-color">
          {{ article.itemName }}
        </h2>
        <button
          v-if="isAdministrator"
          v-t="'HelpModal.HelpArticle.edit'"
          class="admin-edit-button"
          @click="isEditTitleModalDisplayed=true"
        />
      </div>

      <HelpVideoSection
        v-if="isAdministrator || article.videoUrl !==''"
        :video-url="article.videoUrl"
        :video-description="article.videoDescription"
      />
      <HelpManualSection
        v-if="isAdministrator || (article.manual !== '')"
        :html-content="article.manual"
        :is-foldable="article.questions.length > 0"
        :has-faq="article.questions.length > 0"
      />
      <HelpFAQSection
        v-if="isAdministrator || (article.questions.length > 0)"
        :questions="article.questions"
      />
    </section>
    <aside
      v-if="article && (isAdministrator || (article.relations.length + article.relations.length > 0))"
      :class="{'extended': isAsideExtended}"
    >
      <button
        data-test="toggle-aside"
        class="toggle-aside-button"
        @click="isAsideExtended = !isAsideExtended"
      >
        <BaseIcon
          class="icon"
          :class="isAsideExtended ? 'extend': 'collapse'"
          name="chevron-down"
        />
      </button>
      <div
        class="links-panel"
        :class="isAsideExtended ? 'extended': 'collapsed'"
      >
        <RelatedItems :related-articles="article.relations" />
        <ExternalLinks :links="article.links" />
      </div>
    </aside>
    <div
      v-if="!article && isLoadingArticleError"
      v-t="'HelpModal.HelpArticle.articleErrorPlaceholder'"
      class="placeholder"
    />
    <div
      v-else-if="!article"
      v-t="'HelpModal.HelpArticle.articlePlaceholder'"
      class="placeholder"
    />

    <teleport
      v-if="isEditTitleModalDisplayed"
      to="body"
    >
      <EditArticleTitleModal
        :current-title="article.itemName"
        @close="isEditTitleModalDisplayed=false"
      />
    </teleport>
  </article>
</template>

<script>
import BaseIcon from '@components/Base/BaseIcon.vue'
import ExternalLinks from '@components/HelpModal/HeplArticle/ExternalLinks.vue'
import HelpFAQSection from '@components/HelpModal/HeplArticle/HelpFAQSection.vue'
import HelpManualSection from '@components/HelpModal/HeplArticle/HelpManualSection.vue'
import HelpVideoSection from '@components/HelpModal/HeplArticle/HelpVideoSection.vue'
import RelatedItems from '@components/HelpModal/HeplArticle/RelatedItems.vue'
import { defineAsyncComponent } from 'vue'

import { getHelpItem } from '@/api/help.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
const EditArticleTitleModal = defineAsyncComponent(() => import('@components/HelpModal/CreationModals/EditArticleTitleModal.vue'))
export default {
  name: 'HelpArticle',
  components: { EditArticleTitleModal, BaseIcon, HelpFAQSection, HelpManualSection, HelpVideoSection, ExternalLinks, RelatedItems, WeprodeSpinner },
  inject: ['mq'],
  data () {
    return {
      article: undefined,
      isAsideExtended: false,
      isLoadingArticle: false,
      isLoadingArticleError: false,
      isEditTitleModalDisplayed: false
    }
  },
  computed: {
    selectedHelpItem () {
      return this.$store.state.help.selectedItem
    },
    isAdministrator () {
      return this.$store.state.user.isAdministrator
    }
  },
  watch: {
    selectedHelpItem: { // if selectedItem change, load the content
      immediate: true,
      handler () {
        if (this.selectedHelpItem) {
          this.loadHelpItem()
        } else {
          this.article = undefined
          this.$store.dispatch('help/setCurrentArticle', undefined)
        }
      }
    }
  },
  methods: {
    loadHelpItem () {
      this.isLoadingArticle = true
      getHelpItem(this.selectedHelpItem.itemId).then((data) => {
        if (data.success) {
          this.isLoadingArticle = false
          this.isLoadingArticleError = false
          this.article = data.helpItem
          this.$store.dispatch('help/setCurrentArticle', data.helpItem)
          // Force the article's elevator to return on top
          this.$el.scrollTo({ top: 0 })
          // Close mobile aside panel
          this.isAsideExtended = false
        } else {
          this.isLoadingArticleError = true
          console.error('Error on help item loading')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";
.admin-edit-button {
  display: none;
}

.header {
  width: 100%;
  align-items: center;
  display: flex;

  &:hover {
    .admin-edit-button {
      display: block;
    }
  }
}

h2 {
  flex: 1;
  margin-top: 0.5rem;
}

.article {
  position: relative;
  display: flex;
  height: 100%;

  &:not(.phone) {
    height: auto;
  }
}

.article-content {
  overflow-y: auto;
  width: 100%;

  &:not(.phone) {
    flex: 1;
    padding: 0 1.5em;
  }
}

aside {
  width: 140px;
  height: 100%;
  background-color: white;
  position: relative;

  .toggle-aside-button {
    display: none;
  }
}

@media screen and (max-width: 1000px) {
  aside {
    width: 200px;
    transition: all 0.35s ease;
    position: absolute;
    top: 0;
    right: 0;
    box-shadow: -1px 2px 4px rgba(0, 0, 0, 0.2);

    .toggle-aside-button {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-100%);

      .icon {
        transition:  transform .6s;

        &.extend {
          transform: rotate(-90deg);
        }

        &.collapse {
          transform: rotate(90deg);
        }
      }
    }

    &:not(.extended) {
      width: 0;
      .links-panel {
        opacity: 0;
      }
    }

    .links-panel {
      padding-left: 1rem;
    }
  }

}

.placeholder {
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 10em;
  font-weight: bold;
}

</style>
