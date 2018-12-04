<template>
  <NeroWindow
    :modal="true"
    @close="onClose"
  >
    <span slot="header">
      Prefs
    </span>

    <div slot="body">
      <NeroTabList>
        <NeroTabItem title="Account">
          toto
        </NeroTabItem>
        <NeroTabItem title="Interface">
          toti
        </NeroTabItem>
        <NeroTabItem title="Notif">
          totu
        </NeroTabItem>
        <NeroTabItem title="Save">
          toty
        </NeroTabItem>
        <NeroTabItem title="WebDAV">
          tota
        </NeroTabItem>
      </NeroTabList>
    </div>

    <NeroButton
      slot="footer"
      :label="'label'"
      @click="onConfirm"
    />
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/NeroButton'
import NeroTabList from '@/components/NeroTabList'
import NeroTabItem from '@/components/NeroTabItem'
import NeroWindow from '@/components/NeroWindow'

export default {
  name: 'PWPreferencesModal',
  components: {
    NeroButton,
    NeroTabList,
    NeroTabItem,
    NeroWindow
  },
  methods: {
    onClose () {
      this.$store.dispatch('nero/closePreferencesModal')
    },
    onConfirm () {
      // TODO save
      console.log('save prefs')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

</style>
