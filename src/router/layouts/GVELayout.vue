<template>
  <div
    class="body"
    :class="{'authenticated': isAuthenticated}"
  >
    <header class="theme-background-color">
      <h1>ENT République et Canton de Genève</h1>
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
    </header>

    <slot />

    <footer class="bottom-bar theme-background-color">
      <h2>École en ligne</h2>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'GVELayout',
  computed: {
    isAuthenticated () {
      return this.$store.state.user.userId && this.$store.state.user.userId !== 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@design";

.body {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:not(.authenticated) {
    header, footer {
      background-color: rgba(0,0,0,0.6);
    }
  }
}

h1, h2 {
  font-size: 1rem;
  font-weight: 500;
}

header, footer {
  color: #fff;
  font-family: 'Open Sans','Helvetica Neue',Arial,sans-serif;
  margin-bottom: 0;
  border-radius: 0;
  min-height: $gve-layout-banner-height;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  -ms-flex-pack: start;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1rem;
}

footer {
  h2 {
    margin-left: auto;
  }
}

</style>
