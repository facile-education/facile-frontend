<template>
  <div class="redirection-entity">
    <div class="icon">
      <img
        :src="icon"
        alt="document icon"
      >
    </div>
    <div class="name">
      {{ name }}
    </div>
    <button @click="removeEntity">
      <CustomIcon
        icon-name="icon-cross-L"
        class="icon"
      />
    </button>
  </div>
</template>

<script>
import CustomIcon from '@components/Base/CustomIcon.vue'

import { icons } from '@/constants/icons'

export default {
  name: 'RedirectionEntity',
  components: { CustomIcon },
  props: {
    isFolder: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    }
  },
  emits: ['remove'],
  computed: {
    icon () {
      if (this.isFolder) {
        return icons.folder
      } else {
        return icons.file
      }
    }
  },
  methods: {
    removeEntity () {
      this.$emit('remove')
    }
  }
}
</script>

<style lang="scss" scoped>
.redirection-entity{
  display: flex;
  align-items: center;

  .name {
    flex: 1;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

.icon, button {
  height: 100%;
  display: flex;
  align-items: center;
}

button {
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;

  .icon {
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.cross-icon {
  height: 13px;
  width: 13px;
}
</style>
