<template>
  <div class="subsection-assignment">
    <span>{{ subSection.name }}</span>
    <div v-if="subSection.items">
      <ItemAssignment
        v-for="item in subSection.items"
        :key="item.itemId"
        :item="item"
        class="item"
      />
    </div>
  </div>
</template>

<script>
import ItemAssignment from '@/components/Progression/Assignment/ItemAssignment'

export default {
  name: 'SubSectionAssignment',
  components: { ItemAssignment },
  props: {
    subSection: {
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
span {
  margin-top:10px;
  margin-left:10px;
  margin-bottom:10px;
  font-size: 14px;
  font-weight: 500;
}
.item {
  margin-top:10px;
  margin-left:10px;
  margin-bottom:10px;
}
</style>

<i18n locale="fr">
{
  "add": "Créer",
}
</i18n>
