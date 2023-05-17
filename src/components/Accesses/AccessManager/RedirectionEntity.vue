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
      <img
        class="cross-icon"
        src="@assets/big-cross-black.svg"
        alt="remove"
      >
    </button>
  </div>
</template>

<script>
import { icons } from '@/constants/icons'

export default {
  name: 'RedirectionEntity',
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
}

.cross-icon {
  height: 13px;
  width: 13px;
}
</style>
