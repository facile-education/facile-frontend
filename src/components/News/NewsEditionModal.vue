<template>
  <PentilaWindow
    :modal="true"
    :important="news.isHighPrio"
    @close="closeModal"
  >
    <div slot="header">
      <div
        v-if="true"
        class="bell-icon"
        @click="togglePriority"
      >
        <i
          v-if="news.isHighPrio"
          class="fas fa-bell"
        />
        <i
          v-else
          class="fas fa-bell-slash"
        />
      </div>
      <span
        v-t="'TODO'"
      />
    </div>

    <div
      slot="body"
      class="nero-form"
    >
      <div class="news-header">
        <div
          class="logo-panel"
          @click="openImagePicker"
        >
          <PentilaButton
            v-if="news.thumbnail.url"
            type="circle"
            icon="fa fa-trash"
            class="remove-logo cancel"
            @click.stop="removeLogo"
          />

          <img
            v-if="news.thumbnail.url"
            :src="news.thumbnail.url"
            class="logo"
          >
          <i
            v-else
            class="logo-fallback fa fa-plus"
          />
        </div>

        <div class="informations">
          <PentilaInput
            v-model="news.title"
            :placeholder="$t('TODO Title') + '*'"
            :maxlength="75"
            :error-message="formErrorList.title"
            @blur="$v.news.title.$touch()"
          />

          <PentilaDatepicker
            v-model="news.releaseDate"
            label="TODO parution date"
          />
          <PentilaDatepicker
            v-model="news.expireDate"
            :min-date="news.releaseDate"
            label="TODO expiration date"
          />
        </div>
      </div>

      <CKEditor
        v-model="news.content"
        :editor="editor"
      />

      TODO Groups + attachments
    </div>

    <PentilaButton
      slot="footer"
      :label="$t('TODO')"
      @click="save"
    />
  </PentilaWindow>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'

import NeroUtils from '@/utils/nero.utils'

export default {
  name: 'NewsEditionModal',
  components: {
    CKEditor: CKEditor.component
  },
  validations: {
    news: {
      title: { required }
      // TODO group array
    }
  },
  data () {
    return {
      editor: InlineEditor,
      news: {}
    }
  },
  computed: {
    formErrorList () {
      var form = this.$v.news
      return {
        title: (form.title.$invalid && form.title.$dirty) ? this.$t('Nero.formErrorMessage.required') : ''
      }
    },
    title () {
      var title = 'TODO add news'
      if (this.news && this.news.blogEntryId) {
        title = 'TODO edit news'
      }
      return title
    }
  },
  created () {
    this.news = NeroUtils.JSON.deepCopy(this.$store.state.news.selectedNews)
    if (!moment.isMoment(this.news.releaseDate)) {
      this.news.releaseDate = moment(this.news.releaseDate, 'DD/MM/YYYY HH:mm')
    }
    if (!moment.isMoment(this.news.expireDate)) {
      this.news.expireDate = moment(this.news.expireDate, 'DD/MM/YYYY HH:mm')
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('news/closeEditionModal')
    },
    openImagePicker () {
      // TODO selectImage function
      this.$store.dispatch('nero/openImagePickerModal', { onConfirm: this.selectImage })
    },
    removeLogo () {
      this.application.image = ''
    },
    save () {
      // TODO
    },
    togglePriority () {
      this.news.isHighPrio = !this.news.isHighPrio
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.bell-icon {
  position: absolute;
  background-color: $text-color-priority;
  border-radius: 50%;
  width: 50px;
  font-size: 35px;
  top: -12px;
  left: 5%;
  cursor: pointer;
}

.news-header {
  display: flex;
}

.logo-panel {
  position: relative;
  border-radius: $border-radius;
  overflow: hidden;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  width: 110px;
  height: 110px;
  @extend %nero-shadow;
}

.remove-logo {
  position: absolute;
  top: 0;
  right: 0;
}

.logo {
  width: 110px;
  height: 110px;
}

.logo-fallback {
  line-height: 110px;
  font-size: 40px;
  color: $text-color-fallback;
}

.informations {
  width: 100%;
  margin-left: 5px;
}
</style>
