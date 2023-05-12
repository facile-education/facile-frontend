<template>
  <div class="body">
    <nav
      class="nav-bar"
      role="navigation"
    >
      <h1>ENT REPUBLIQUE ET CANTON DE GENEVE</h1>
      <div class="store-icons">
        <i class="fa fa-apple" />
        <i class="fa fa-android" />
        <!-- <div class="qr-code-container">
          <i class="fa fa-caret-up" />
          <img
            class="qr-code"
            src="https://rec-ent.eduge.ch/GVEFrontPage-theme/images/app-qrcode.png"
            alt="QRCode de l'application mobile"
          >
          <p class="qr-code-label">
            Installer l'app
          </p>
        </div> -->
      </div>
    </nav>
    <slot />
    <footer class="bottom-bar">
      <h2>Ecole en ligne</h2>
    </footer>
  </div>
</template>

<script>
export default {
  components: {},
  inject: ['mq'],
  props: {
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.body {
  height: 100%;
  background-color: #eceff4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h1, h2 {
  font-size: 1rem;
  font-weight: 500;
}

.nav-bar, .bottom-bar {
  background-color: rgba(0,0,0,0.6);
  color: #fff;
  font-family: 'Open Sans','Helvetica Neue',Arial,sans-serif;
  margin-bottom: 0;
  border-radius: 0;
  height: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  -ms-flex-pack: start;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1rem;
}

.bottom-bar {
  h2 {
    margin-left: auto;
  }
}

</style>
