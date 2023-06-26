<template>
  <PentilaWindow
    class="save-access-modal"
    data-test="save-access-modal"
    :modal="true"
    :draggable="true"
    @close="onClose"
  >
    <template #header>
      <span>title</span>
    </template>

    <template #body>
      Body
    </template>

    <template #footer>
      <PentilaButton />
    </template>
  </PentilaWindow>
</template>

<script>
export default {
  name: 'CourseEditModal',
  components: {},
  props: {
    initAccess: {
      type: Object,
      default: undefined
    },
    initCategory: {
      type: Object,
      default: undefined
    }
  },
  emits: ['close'],
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
    this.$store.dispatch('misc/incrementModalCount')
  },
  methods: {
    onClose () {
      this.$store.dispatch('misc/decreaseModalCount')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>

<i18n locale="fr">
  {
  }
</i18n>
