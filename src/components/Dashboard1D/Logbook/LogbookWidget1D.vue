<template>
  <section
    data-test="logbook-widget-1D"
    class="logbook-widget-1D"
  >
    <header>
      <h2>{{ $t('Dashboard.LogbookHeader.Logbook') }}</h2>
    </header>
    <div class="content">
      <ul>
        <li
          v-for="(children, index) in filteredLogbookData"
          :key="index"
        >
          <a
            href="#"
            style="color: black;"
            class="toggle-user-card"
            @click.stop="openUserCardModal(children)"
          >
            {{ children.firstName + ' ' + children.lastName }}
          </a>
          <a href="">{{ $tc('Dashboard.Logbook.UnsignedWords', {count: children.nbUnreadLogbookEntries}) }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LogbookWidget',
  props: {
    logbookData: {
      type: Object,
      required: true
    }
  },
  computed: {
    filteredLogbookData () {
      return this.logbookData.filter(children => children.nbUnreadLogbookEntries > 0)
    }
  },
  methods: {
    openUserCardModal (user) {
      this.$store.dispatch('userCard/initUserCard', user)
    }
  }
}
</script>

<style lang="scss" scoped>

@import "@design";

.logbook-widget-1D{
  display: flex;
  flex-direction: column;
  width: 100%;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  @extend %widget-header;
  h2 {
    @extend %widget-h2;
}
}
.content{
  flex: 1;
}

ul{
  list-style: none;
  padding-left: 0;
  li{
    display: flex;
    flex-direction: column;
    gap: 5px;
    &:not(:last-child){
      margin-bottom: 20px;
    }
    a{
      width: fit-content;
    }
  }
}
</style>
