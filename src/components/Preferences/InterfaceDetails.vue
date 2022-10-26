<template>
  <div class="interface-preferences">
    <div class="menu-default-state">
      <label v-t="'hideMenuLabel'" />
      <PentilaRadioButton
        v-model="menuHidden"
        name="menu"
        :label="$t('yesLabel')"
        rb-value="yes"
        class="yes"
      />
      <PentilaRadioButton
        v-model="menuHidden"
        name="menu"
        :label="$t('noLabel')"
        rb-value="no"
      />
    </div>
    <div class="color-picker">
      <label v-t="'themeColorPickerLabel'" />
      <ColorPicker
        :model-value="themeColor"
        :colors="colors"
        @update:model-value="onColorChange"
      />
    </div>
  </div>
</template>

<script>
import PentilaUtils from 'pentila-utils'
import ColorPicker from '@/components/Nero/ColorPicker'

export default {
  name: 'InterfaceDetails',
  components: {
    ColorPicker
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
  beforeUnmount () {
    // Save preferences
    const preferences = {
      language: this.language,
      isMenuHidden: (this.menuHidden === 'yes'),
      themeColor: this.themeColor
    }
    this.$store.dispatch('user/saveInterfacePreferences', preferences)
  },
  methods: {
    onColorChange (newColor) {
      PentilaUtils.Theme.updateColor(this.themeColor, newColor)
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

<i18n locale="fr">
{
  "hideMenuLabel": "Réduire le menu par défaut",
  "noLabel": "Non",
  "themeColorPickerLabel": "Choisir la couleur du thème",
  "yesLabel": "Oui"
}
</i18n>
