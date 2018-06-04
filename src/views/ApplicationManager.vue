<template>
  <div>
    <ApplicationManagerToolbar/>
    <ApplicationManagerCategory/>
  </div>
</template>

<script>
import ApplicationManagerCategory from '@/components/ApplicationManagerCategory'
import ApplicationManagerToolbar from '@/components/ApplicationManagerToolbar'

export default {
  name: 'ApplicationManager',
  components: {
    ApplicationManagerCategory,
    ApplicationManagerToolbar
  }
}
</script>

<style lang="scss" scoped>

</style>
