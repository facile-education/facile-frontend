<template>
  <div
    class="activity"
  >
    <p>renvoi</p>
    <span>{{ activity.title }}</span>
  </div>
</template>

<script>
export default {
  name: 'HHCActivity',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/design/index';

.activity {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>

<i18n locale="fr">
{
  "groups-activity": "Fil d'activité de mes groupes"
}
</i18n>
