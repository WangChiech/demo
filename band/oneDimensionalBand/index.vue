<template>
  <div class="one-dimensional-band">
    <div id="container">
            
      <div id="reduce"></div>
    </div>
    <div id="increase"></div>
  </div>
</template>


<script>
import Utils from '@/utils/utils'
import { OneDimensionalBand } from './oneDimensionalBand'

export default {
  props: {
    // band宽度，含左右间隙
    cWidth: {
      type: Number,
      default: 60
    },
    // band 左右间隙
    cPadding: {
      type: Number,
      default: 15
    },
    // band 支持最大级数
    maxLevel: {
      type: Number,
      default: 5
    },
    // 最小精度 100份占比为多少 ※ 能被100整除
    miniAccuracy: {
      type: Number,
      default: 5
    },
    // band 涉及等级、百分占比，等级对应颜色的数据
    value: {
      type: Array,
      default() {
        return [
          { name: 'A', value: '20', color: '#3c6ef0' },
          { name: 'B', value: '20', color: '#19c77f' },
          { name: 'C', value: '20', color: '#ff8024' },
          { name: 'D', value: '20', color: '#75dcc8' },
          { name: 'E', value: '20', color: '#8a75dc' }
        ]
      }
    }
  },
  data() { 
    return {
      bandList: Utils.arrayDeepClone(this.value),
      levelNameArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      levelColorArr: ['#3c6ef0', '#19c77f', '#ff8024', '#75dcc8', '#8a75dc', '#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF', '#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373'],
      dragNodeIndex: -1,
      nodeClicked: false
    }
  },
  computed: {
       
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.bandList = Utils.arrayDeepClone(newVal)
        this.initBand()
      },
      deep: true
    }
  },
  mounted() {
    this.initBand()
    window.document.onmouseup = (e) => {
      this.dragNodeIndex = -1
      this.nodeClicked = false
    }
    window.addEventListener('resize', () => { 
      this.initBand()
    }, false)
  },
  methods: {
    initBand() {
      this.bandWidth = this.cWidth * document.body.clientWidth / 100
      // 创建舞台
      const stage = new Konva.Stage({
        container: 'container',
        width: this.bandWidth + 200,
        height: 60,
        background: 'red'
      })

      // 创建层
      const layer = new Konva.Layer()
      stage.add(layer)

            
      const h = new OneDimensionalBand({
        x: this.cPadding, // band 相对 canvas 画布的左边距
        y: 3 / 4 * stage.height(),
        cPadding: this.cPadding,
        bandWidth: this.bandWidth,
        maxLevel: this.maxLevel,
        miniAccuracy: this.miniAccuracy,
        data: this.value
      })
      h.addToGroupOrLayer(layer)

      layer.draw()

      let startX = 0, // 鼠标拖拽起始点坐标
        startY = 0,
        nodeArr = [],
        nodeY = 0,
        nodeMOved = 1,
        miniLineWidth = (this.bandWidth + 2) * this.miniAccuracy / 100,
        self = this,
        i = 1

      stage.on('contentMousedown', (e) => {
        const mouseX = e.evt.layerX
        const mouseY = e.evt.layerY
        const node = h.getAllNode()
        nodeArr = node.nodeArray
        nodeY = node.nodeY
        if (
          mouseY < (nodeY + 12) &&
            mouseY > (nodeY - 24)
        ) {
          nodeArr.forEach((item, index) => {
            if (mouseX > item - 2 && mouseX < item + 8) {
              if (nodeArr.length - 1 === index) {
                return
              }
              self.dragNodeIndex = index
              self.nodeClicked = true
            }
          })
        }
      })
      stage.on('contentMousemove', function(e) {
        const moveY = e.evt.layerY
        if (self.dragNodeIndex !== -1 && moveY > 0 && moveY < 58) {
          const moveX = e.evt.layerX
          const a = nodeArr[self.dragNodeIndex] - moveX
          const node = h.getAllNode()
          nodeArr = node.nodeArray
          if (nodeArr[self.dragNodeIndex] - moveX > miniLineWidth * i - miniLineWidth / 2) {
            const movedData = h.nodeAnimateLeft(self.dragNodeIndex)
            if (!movedData.nodeMoved) {
              return
            }
            i += movedData.nodeMoved
            this.dataList = movedData.dataList
            self.nodeClicked = true
          } else if (moveX - nodeArr[self.dragNodeIndex] > miniLineWidth * i - miniLineWidth / 2) {
            const movedData = h.nodeAnimateRight(self.dragNodeIndex)
            if (!movedData.nodeMoved) {
              return
            }
            i += movedData.nodeMoved
            this.dataList = movedData.dataList
            self.nodeClicked = true
          }
        }
      })
      stage.on('contentMouseup', (e) => {
        const mouseX = e.evt.layerX
        const mouseY = e.evt.layerY
        if (mouseY > 30 && mouseY < 50) {
          if (
            mouseX > this.bandWidth + 3 * this.cPadding && 
            mouseX < this.bandWidth + 3 * this.cPadding + 20
          ) {
            self.handleBandLevelReduce()
          } else if ( 
            mouseX > this.bandWidth + 7 / 2 * this.cPadding + 20 && 
            mouseX < this.bandWidth + 7 / 2 * this.cPadding + 40
          ) {
            self.handleBandLevelIncrease()
          }
        } 
        if (self.dragNodeIndex !== -1) {
          self.$emit('input', self.bandList)
        }
        startX = 0
        startY = 0
        self.dragNodeIndex = -1
        self.nodeClicked = false
      })
            
    },
    handleBandLevelIncrease() {
      const nowBandLevel = this.bandList.length
      if (this.maxLevel <= nowBandLevel) {
        return
      }
      let nowPersent = 0
      this.bandList.forEach((item, index) => {
        nowPersent += +item.value
      })
      if (nowPersent < 100) {
        const item = {
          name: this.levelNameArr[nowBandLevel],
          value: 100 - nowPersent,
          color: this.levelColorArr[nowBandLevel]
        }
        this.bandList.push(item)
        this.$emit('input', this.bandList)
      } else if (+nowPersent === 100) {
        const item = {
          name: this.levelNameArr[nowBandLevel],
          value: this.miniAccuracy,
          color: this.levelColorArr[nowBandLevel]
        }
        for (let i = nowBandLevel - 1; i >= 0; i--) {
          if (this.bandList[i].value > this.miniAccuracy) {
            this.bandList[i].value = this.bandList[i].value - this.miniAccuracy
            this.bandList.push(item)
            this.$emit('input', this.bandList)
            return
          }
        }
      }
    },
    handleBandLevelReduce() {
      const nowBandLevel = this.bandList.length
      if (nowBandLevel <= 1) {
        return
      }
      this.bandList[this.bandList.length - 2].value = Number(this.bandList[this.bandList.length - 2].value) + Number(this.bandList[this.bandList.length - 1].value)
      this.bandList.length = nowBandLevel - 1
      this.$emit('input', this.bandList)
    }
  }
    
}
</script>

<style lang="stylus">
#reduce
    display inline-block
    width 50px
    height 50px
    background red
</style>
