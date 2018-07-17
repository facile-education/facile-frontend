<template>
  <div class="folder-tree">
    DocumentTree
    <NeroTree
      :folders-only="true"
      :model="data"/>
  </div>
</template>

<script>
import NeroTree from '@/components/NeroTree'

export default {
  name: 'FolderTree',
  components: {
    NeroTree
  },
  data () {
    return {
      data: {
        name: 'My Tree',
        data: [
          {'id': 20973378, 'text': 'AD', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/AD', 'leaf': false},
          {'id': 21603459, 'text': 'dossier1', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/dossier1', 'leaf': false},
          {'id': 26078288, 'text': 'Formations-HN-2015', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/Formations-HN-2015', 'leaf': false},
          {'id': 73907102, 'text': 'Geogebra', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/Geogebra', 'leaf': false},
          {'id': 108961560, 'text': 'Jupyter', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/Jupyter', 'leaf': false},
          {'id': 122120993, 'text': 'Supports formation 2018', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/Supports formation 2018', 'leaf': false},
          {'id': 73707163, 'text': 'Webdav', 'urlWebdav': 'https://nero.l-educdenormandie.fr/api/secure/webdav/pentila/document_library/Mon cartable/Webdav', 'leaf': false}],
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
@import 'src/assets/css/constants';

.folder-tree {
  @extend %nero-menu;
  width: 200px;
}
</style>
