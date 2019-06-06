<template>
  <!-- Imported from https://github.com/legeneek/vue-image-clip -->
  <div class="cropper">
    <div>
      <div class="container-bg">
        <div class="img-container">
          <img
            id="clip_src_img"
            :src="img"
            @load="srcImgLoaded"
          >
          <div class="shadow-box" />
          <SelectBox
            ref="box"
            :src-size="imgSize"
            :ratio="ratio"
            :img="img"
            @selectEnd="selectEnd"
            @selectChange="selectChange"
          />
        </div>
      </div>
      <div class="img-preview">
        <PentilaUserPicture :image-url="dataURL" />
        <p v-t="'ImagePickerWindow.CustomCropper.previewLabel'" />
      </div>
    </div>
  </div>
</template>

<script>
import SelectBox from './SelectBox.vue'

export default {
  components: {
    SelectBox
  },
  props: {
    img: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      $srcImg: null,
      $resImg: null,
      $imgContainer: null,
      bufferCanvas: null,
      nw: 0,
      nh: 0,
      ratio: 10 / 10, // equal to SelectBox's width / height
      imgSize: { w: 0, h: 0 },
      containerTop: 0,
      rec: null
    }
  },
  computed: {
    dataURL () {
      if (!this.rec || !this.rec.w || !this.rec.h || !this.bufferCanvas) {
        return ''
      }
      return this.bufferCanvas.toDataURL('image/jpeg', 1)
    },
    computedRec () {
      const cw = this.$imgContainer.offsetWidth
      const ch = this.$imgContainer.offsetHeight
      const wr = cw / this.nw
      const hr = ch / this.nh
      return {
        l: this.rec.l / wr,
        t: this.rec.t / hr,
        w: this.rec.w / wr,
        h: this.rec.h / hr
      }
    }
  },
  mounted () {
    this.$srcImg = this.$el.querySelectorAll('#clip_src_img')[0]
    this.$imgContainer = this.$el.querySelectorAll('.img-container')[0]
    this.$containerBox = this.$el.querySelectorAll('.container-bg')[0]
  },
  methods: {
    clipData () {
      if (!this.rec || !this.rec.w || !this.rec.h) {
        return ''
      }

      this.bufferCanvas = document.createElement('canvas')
      this.bufferCanvas.width = this.computedRec.w
      this.bufferCanvas.height = this.computedRec.h
      const bfx = this.bufferCanvas.getContext('2d')
      bfx.drawImage(this.$srcImg, -this.computedRec.l, -this.computedRec.t, this.nw, this.nh)
    },
    selectChange () {
      this.clipData()
    },
    selectEnd () {
      if (this.bufferCanvas !== null) {
        var vm = this
        this.bufferCanvas.toBlob(function (blob) {
          vm.$emit('select-image', blob)
        })
      }
    },
    srcImgLoaded () {
      this.nw = this.$srcImg.naturalWidth
      this.nh = this.$srcImg.naturalHeight
      this.clearSelect()
      this.setImgSize()
      this.rec = this.$refs.box.rec
      this.selectChange()
    },
    clearSelect () {
      const box = this.$refs.box
      box.clearRec()
    },
    setImgSize () {
      // image's naturalWidth naturalHeight ratio
      const nr = this.nw / this.nh
      const scw = this.$containerBox.offsetWidth
      const sch = this.$containerBox.offsetHeight
      let rw = 0 // select box width
      let rh = 0 // select box height
      if (nr >= this.ratio) {
        this.imgSize.w = scw
        this.imgSize.h = scw / nr
        this.containerTop = (sch - this.imgSize.h) / 2
        rh = this.imgSize.h
        rw = rh * this.ratio
      } else {
        this.imgSize.h = sch
        this.imgSize.w = sch * nr
        this.containerTop = 0
        rw = this.imgSize.w
        rh = rw / this.ratio
      }
      this.$srcImg.setAttribute('style', `width:${this.imgSize.w}px;height:${this.imgSize.h}px;`)
      this.$imgContainer.setAttribute('style',
        `width:${this.imgSize.w}px;height:${this.imgSize.h}px;top:${this.containerTop}px;`)
      this.$refs.box.rec = { w: rw, h: rh, l: 0, t: 0 }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/css/constants';

$crop-container-width: 480px;

.container-bg {
  display: inline-block;
  width: $crop-container-width;
  height: 300px;
  background-color: #000;
  border-radius: 4px;
}

.img-container {
  position: relative;
  height: 0;
  margin: auto;
}

.img-container img {
  position: relative;
  width: 100%;
  height: 100%;
}

.img-container .shadow-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  z-index: 1;
}

.img-preview {
  display: inline-block;
  @include calc(width, '100% - #{$crop-container-width}');
  vertical-align: top;
  text-align: center;
}

.modal-btn {
  display: inline-block;
  width: 110px;
  height: 32px;
  font-size: 14px;
  line-height: 32px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.btn-confirm {
  border: 1px solid #00a1d6;
  color: #fff;
  background-color: #00a1d6;
}

.btn-confirm:hover {
  background-color: #00b5e5;
}
</style>
