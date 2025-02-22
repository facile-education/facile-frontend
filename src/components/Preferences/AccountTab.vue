<template>
  <div
    class="account-tab"
    data-test="account-tab"
  >
    <section class="user-picture">
      <h4 v-t="'Preferences.AccountTab.userPicture'" />
      <div class="body">
        <div class="left-section">
          <div class="thumbnail-container">
            <UserPicture
              class="picture"
              :user="user"
              size="100px"
              tabindex="0"
              @keyup.enter="toggleImagePicker"
              @click="toggleImagePicker"
            />

            <WeprodeButton
              v-if="user.picture !== ''"
              :title="$t('Preferences.AccountTab.deleteButtonTitle')"
              type="circle"
              cls="cancel delete"
              @click="removePicture"
            >
              <CustomIcon :icon-name="'icon-trash'" />
            </WeprodeButton>

            <WeprodeButton
              v-else
              :title="$t('Preferences.AccountTab.addButtonTitle')"
              :aria-label="$t('Preferences.AccountTab.addButtonTitle')"
              class="add-picture"
              type="circle"
              @click="toggleImagePicker"
            >
              <img
                src="@assets/icons/camera.svg"
                alt="plus"
              >
            </WeprodeButton>
          </div>
        </div>

        <WeprodeSpinner
          v-if="isActionInProgress"
          style="z-index: 1"
        />
      </div>
    </section>
    <section class="language">
      <h4 v-t="'Preferences.AccountTab.language'" />
      <ul>
        <li
          v-for="locale in locales"
          :key="locale.frontId"
        >
          <button
            :title="locale.label"
            :aria-label="locale.label"
            :disabled="locale.frontId === currentLocale.frontId || isChangingLocale"
            @click="changeLocale(locale)"
          >
            <img
              :src="getLocaleImage(locale)"
              :alt="locale.label + ' flag'"
            >
          </button>
        </li>
      </ul>
    </section>
    <section class="theme-color">
      <h4 v-t="'Preferences.AccountTab.themeColor'" />
      <ColorPicker
        class="color-picker"
        :model-value="themeColor"
        :colors="colors"
        @update:model-value="onColorChange"
      />
    </section>
  </div>

  <teleport to="body">
    <ImagePickerModal
      v-if="show"
      @save="selectImage"
      @close="toggleImagePicker"
    />
  </teleport>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'
import UserPicture from '@components/Base/UserPicture.vue'
import WeprodeButton from '@components/Base/Weprode/WeprodeButton.vue'
import ColorPicker from '@components/Preferences/ColorPicker.vue'
import WeprodeUtils from '@utils/weprode.utils'
import { defineAsyncComponent } from 'vue'

import userService from '@/api/user.service'
import WeprodeSpinner from '@/components/Base/Weprode/WeprodeSpinner.vue'
import { locales } from '@/constants/appConstants.js'
import { icons } from '@/constants/icons.js'
const ImagePickerModal = defineAsyncComponent(() => import('@components/Base/ImagePicker.vue'))

export default {
  name: 'AccountTab',
  components: { CustomIcon, WeprodeButton, UserPicture, ColorPicker, ImagePickerModal, WeprodeSpinner },
  emits: ['save'],
  data () {
    return {
      show: false,
      themeColor: '',
      // Orange: '#f4901d', Vue greens: '#42b983', '#4dba87', Light blue : '#73B2D9', Pentila : '#379FB7'
      colors: ['#99B9E9', '#E47B00', '#8E44AD', '#27AE60', '#2982B9',
        '#7F8C8D', '#16A085', '#34495E', '#E74C3C', '#F1C40F'],
      // Frequency : NONE = 0, DAILY = 1, WEEKLY = 2
      frequency: [
        { label: this.$t('Preferences.AccountTab.none'), value: 0 },
        { label: this.$t('Preferences.AccountTab.daily'), value: 1 },
        { label: this.$t('Preferences.AccountTab.weekly'), value: 2 }
      ],
      selectedFrequency: undefined
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    details () {
      return this.user.details
    },
    isChangingLocale () {
      return this.$store.getters['currentActions/isInProgress']('updateLocale')
    },
    isActionInProgress () {
      return this.$store.getters['currentActions/isInProgress']('saveProfilePicture') || this.isChangingLocale
    },
    locales () {
      return locales
    },
    currentLocale () {
      return this.user.locale
    }
  },
  created () {
    if (this.details.lastName === undefined) {
      this.getPersonalDetails()
    }
    this.themeColor = this.$store.state.user.themeColor
  },
  methods: {
    getLocaleImage (locale) {
      return icons[locale.iconName]
    },
    getPersonalDetails () {
      this.$store.dispatch('currentActions/addAction', { name: 'getPersonalDetails' })
      userService.getPersonalDetails().then(
        (data) => {
          this.$store.dispatch('currentActions/removeAction', { name: 'getPersonalDetails' })
          if (data.success) {
            this.$store.dispatch('user/updatePersonalDetails', data)
            this.selectedFrequency = this.frequency[data.reportFrequency]
          }
        },
        (err) => {
          // TODO toastr
          console.error(err)
          this.$store.dispatch('currentActions/removeAction', { name: 'getPersonalDetails' })
        })
    },
    onColorChange (newColor) {
      userService.updateThemeColor(newColor).then((data) => {
        if (data.success) {
          WeprodeUtils.updateColor(this.themeColor, newColor)
          this.$store.commit('user/updateInterfacePreferences', { themeColor: newColor })
          this.themeColor = this.$store.state.user.themeColor
          this.$emit('save')
        } else {
          this.$store.dispatch('popups/pushPopup', { message: this.$t('Popup.error'), type: 'error' })
        }
      })
    },
    changeLocale (locale) {
      this.$store.dispatch('user/updateLocale', locale).then(() => {
        // Overkill way to refresh routes paths
        const currentRouteName = this.$route.name
        this.$store.dispatch('menu/initUserMenu', currentRouteName).then(() => {
          this.$router.push({ name: currentRouteName })
        })
      })
    },
    toggleImagePicker () {
      this.show = !this.show
    },
    selectImage ({ blob, fileName }) {
      const formData = new FormData()
      formData.append('picture', blob, fileName)
      this.$store.dispatch('user/saveProfilePicture', formData)
    },
    removePicture () {
      this.$store.dispatch('user/removePicture')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

section {
  &:not(:first-child) {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid $color-border;
  }
}

h4 {
  margin: 0 0 0.5rem 0;
  @extend %font-bold-l;
}

.user-picture {
  .body{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;

    .left-section {
      display: flex;

      .thumbnail-container {
        display: inline-block;
        position: relative;

        .picture {
          cursor: pointer;
        }

        .cancel, .add-picture {
          position: absolute;
          z-index: 2;
          top: -4px;
          right: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px white solid;

          img {
            height: 16px;
          }
          .icon-trash {
            color: white;
          }
        }
      }
    }
  }
}

.language {
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:disabled {
      cursor: default;
    }
  }

  img {
    width: 70px;
  }
}
</style>
