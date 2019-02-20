<template>
  <div class="interface-preferences">
    <div class="menu-default-state">
      <label v-t="'PreferencesWindow.PWInterfaceDetails.hideMenuLabel'" />
      <NeroRadioButton
        v-model="menuHidden"
        name="menu"
        :label="$t('PreferencesWindow.PWInterfaceDetails.yesLabel')"
        rb-value="yes"
        class="yes"
      />
      <NeroRadioButton
        v-model="menuHidden"
        name="menu"
        :label="$t('PreferencesWindow.PWInterfaceDetails.noLabel')"
        rb-value="no"
      />
    </div>
    <div class="color-picker">
      <label v-t="'PreferencesWindow.PWInterfaceDetails.themeColorPickerLabel'" />
      <Swatches
        :value="themeColor"
        :colors="colors"
        :swatch-style="{ width: '32px', height: '32px', margin: '0 1px' }"
        :wrapper-style="{padding: '0'}"
        inline
        class="swatches"
        @input="onColorChanged"
      />
    </div>
  </div>
</template>

<script>
import Swatches from 'vue-swatches'
import NeroRadioButton from '@/components/Nero/NeroRadioButton'
import NeroUtils from '@/utils/nero.utils'

export default {
  name: 'PWInterfaceDetails',
  components: {
    NeroRadioButton,
    Swatches
  },
  data () {
    return {
      language: 'fr',
      menuHidden: 'yes',
      themeColor: '',
      // Orange: '#f4901d', Vue greens: '#42b983', '#4dba87', Light blue : '#73B2D9', Pentila : '#379FB7'
      colors: ['#99B9E9', '#E47B00', '#8E44AD', '#27AE60', '#2982B9',
        '#7F8C8D', '#16A085', '#34495E', '#E74C3C', '#F1C40F']
    }
  },
  created () {
    this.themeColor = this.$store.state.user.themeColor
    this.menuHidden = this.$store.state.nero.isMenuExpandedOnLoad ? 'no' : 'yes'
  },
  beforeDestroy () {
    // Save preferences
    var preferences = {
      language: this.language,
      isMenuHidden: (this.menuHidden === 'yes'),
      themeColor: this.themeColor
    }
    this.$store.dispatch('user/saveInterfacePreferences', preferences)
  },
  methods: {
    onColorChanged (newColor) {
      NeroUtils.Theme.updateColor(this.themeColor, newColor)
      this.themeColor = newColor
    }
  }
}
</script>

<style lang="scss" scoped>
.interface-preferences {
  label {
    display: inline-block;
    width: 250px;
  }
}

.swatches {
  display: inline-block;
}
</style>
