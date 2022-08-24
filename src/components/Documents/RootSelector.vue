<template>
  <div class="root-selector">
    <div
      class="item"
      @click="changeSpace('documents')"
    >
      Mes documents
    </div>
    <div
      class="item"
      @click="changeSpace('groups')"
    >
      Mes groupes
    </div>
    <div
      class="item"
      @click="changeSpace('recent')"
    >
      Récents
    </div>
  </div>
</template>

<script>
export default {
  name: 'RootSelector',
  methods: {
    changeSpace (space) {
      switch (space) {
        case 'documents':
          this.$router.push('/documents')
          break
        case 'groups':
          this.$router.push('/documents/groups')
          break
        case 'recent':
          this.$router.push('/documents/recent')
          break
        default:
          console.error('no space named ' + space)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.root-selector {
  position: fixed;
  width: 300px;
  top: 500px;
  left: 0;
  background-color: #9effa1;
  z-index: 1000;

  .item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    border-bottom: 1px solid;

    &:hover {
      font-weight: bold;
    }
  }
}

</style>
