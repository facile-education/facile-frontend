<template>
  <tr class="entry">
    <td class="name">
      <i :class="classes" />{{ entry.name }}
      <div class="actions">
        <i class="fa fa-star" />
        <i class="fa fa-edit" />
        <i class="fa fa-info" />
        <i class="fa fa-search" />
        <i class="fa fa-download" />
        <i class="fa fa-file-archive" />
        <i class="fa fa-envelope" />
      </div>
    </td>
    <td class="align-right">
      {{ size }}
    </td>
    <td class="align-right">
      {{ formattedDate }}
    </td>
    <td class="align-right type">
      {{ entry.typeEntity }}
    </td>
  </tr>
</template>

<script>
import moment from 'moment'
// TODO actions : shortcut, edit, infos, view, download, unzip
export default {
  name: 'FolderContentItem',
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  computed: {
    classes () {
      return this.entry.isLeaf ? 'fa fa-file ' : 'fa fa-folder'
    },
    size () {
      return this.fileSizeFR(this.entry.size)
    },
    formattedDate () {
      moment.locale('fr')
      return moment(this.entry.date, 'MM/DD/YYYY HH:mm').format('ll')
    }
  },
  methods: {
    fileSizeFR (size) {
      if (size <= 0) {
        return ''
      } else if (size < 1024) {
        return size + ' o'
      } else if (size < 1048576) {
        return (Math.round(((size * 10) / 1024)) / 10) + ' Ko'
      } else {
        return (Math.round(((size * 10) / 1048576)) / 10) + ' Mo'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

.align-right {
  text-align: right;
}

.entry {
  border-bottom: $border;

  td {
    font-size: 14px;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;

    &.name {
      max-width: 300px;
    }

    &.type {
      max-width: 100px;
    }
  }

  .fa-file, .fa-folder {
    display: inline-block;
    width: 20px;
  }

  .actions {
    display: none;
    position: absolute;
    right: 0px;
    padding-right: 10px;
    background-color: $menu-background-color;

    .fa {
      cursor: pointer;
      margin-left: 5px;
    }
  }

  &:hover {
    background-color: $menu-background-color;
    cursor: default;

    .actions {
      display: initial;
    }
  }
}
</style>
