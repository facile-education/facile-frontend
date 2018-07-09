<template>
  <div>
    DocumentTree
    <NeroTree
      :folders-only="true"
      :model="data"/>
  </div>
</template>

<script>
import NeroTree from '@/components/NeroTree'

export default {
  name: 'DocumentTree',
  components: {
    NeroTree
  },
  data () {
    return {
      data: {
        name: 'My Tree',
        children: [
          { name: 'hello' },
          { name: 'wat' },
          {
            name: 'child folder',
            children: [
              {
                name: 'child folder',
                children: [
                  { name: 'hello' },
                  { name: 'wat' }
                ]
              },
              { name: 'hello' },
              { name: 'wat' },
              {
                name: 'child folder',
                children: [
                  { name: 'hello' },
                  { name: 'wat' }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
