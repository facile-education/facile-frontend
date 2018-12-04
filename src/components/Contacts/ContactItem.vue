<template>
  <div class="contact">
    <div class="info">
      {{ contact.userLastName }}
    </div>
    <div class="info">
      {{ contact.userFirstName }}
    </div>
    <div class="info">
      {{ contact.role }}
    </div>
    <!--div class="info">{{ contact.schoolName }}</div-->
    <NeroButton
      icon="fa fa-info"
      @click="console.log('TODO')"
    />
  </div>
</template>

<script>
import NeroButton from '@/components/NeroButton'

export default {
  name: 'ContactItem',
  components: {
    NeroButton
  },
  props: {
    contact: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.contact {
  height: 53px;
  border-bottom: 1px solid rgba(183,183,183,0.3);
}

.info {
  display: inline-block;
  width: 25%;
  vertical-align: top;
  font-size: 0.8em;
}
</style>
