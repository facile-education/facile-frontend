<template>
  <NeroWindow
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
      Toto
    </div>

    <NeroButton
      slot="footer"
      :label="$t('TODO')"
      @click="save"
    />
  </NeroWindow>
</template>

<script>
import NeroButton from '@/components/Nero/NeroButton'
import NeroWindow from '@/components/Nero/NeroWindow'

export default {
  name: 'NewsEditionModal',
  components: {
    NeroButton,
    NeroWindow
  },
  computed: {
    news () {
      return this.$store.state.news.selectedNews
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('news/closeEditionModal')
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
</style>
