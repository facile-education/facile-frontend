<template>
  <div
    class="body"
    :class="{'authenticated': isAuthenticated}"
  >
    <header class="theme-background-color">
      <div>ENT République et Canton de Genève</div>
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
      <div>École en ligne</div>
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

header, footer {
  @extend %font-regular-m;
  color: #fff;
  min-height: $gve-layout-banner-height;
  max-height: $gve-layout-banner-height;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 1rem;
}

footer {
  div {
    margin-left: auto;
  }
}

</style>
