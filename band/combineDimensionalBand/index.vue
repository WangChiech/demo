<template>
  <div class="one-dimensional-band" v-bind:style="{ height: bandHeight + 120 + 'px', width: bandWidth + 130 + 'px' }">
    <div id="container"></div>
    <!-- 横轴输入数值模式 -->
    <div 
      id="csys-x" 
      v-if="!bandStyle[0].csyType"
      v-bind:style="{ 
        width: bandWidth + 'px', 
        top: '10px', left: chartLeft + cPadding + 10 + 'px' 
      }">
      <div v-for="(item, index) in bandData.dataListX" :key="index" class="item-node-x">
        <span>{{item.name + ':'}}</span>
        <input 
          type="text" class="x-node"  
          v-model="item.value"  
          @blur="handleBandDataChange(0,index)" 
          :readonly="index === bandData.dataListX.length-1">
          <div class="x-node-reg"></div>
      </div>
    </div>
    <!-- 纵轴输入数值模式 -->
    <div 
      id="csys-y" 
      v-if="!bandStyle[1].csyType"
      v-bind:style="{ 
        height: bandHeight + 'px', 
        top: chartLeft + cPadding + 10 + 'px' 
      }">
      <div v-for="(item, index) in bandData.dataListY" :key="index" class="item-node-y">
        <div class="node-y">
          <span>{{item.name + ':'}}</span>
          <input 
            type="text" 
            class="x-node" 
            v-model="item.value" 
            @blur="handleBandDataChange(1,index)" 
            :readonly="index === bandData.dataListY.length-1">
          <div class="y-node-reg"></div>
        </div>
        
      </div>
    </div>
    <!-- 横轴band增减按钮 -->
    <div 
      class="x-band-btn"
      v-bind:style="{
        left: chartLeft + cPadding + bandWidth + 20 + 'px' 
      }">
      <div class="x-name">{{bandStyle[0].name}}</div>
      <div class="x-btn">
        <span id="x-btn-increase" @click="handleXIncrease">＋</span>
        <span id="x-btn-reduce" @click="handleXReduce">－</span>
      </div>
    </div>
    <!-- 纵轴band增减按钮 -->
    <div 
      class="y-band-btn"
      v-bind:style="{
        top: chartLeft + cPadding + bandHeight + 20 + 'px' 
      }">
      <div class="y-name">{{bandStyle[1].name}}</div>
      <div class="y-btn">
        <span id="y-btn-increase" @click="handleYIncrease">＋</span>
        <span id="y-btn-reduce" @click="handleYReduce">－</span>
      </div>
    </div>
    <!-- 下拉框触发颜色更改 -->
    <div 
      class="band-item-color-select"
      v-bind:style="{
        left: stockSelectPosition.x + 'px',
        top: stockSelectPosition.y + 'px' 
      }">
      <lui-popover
        placement="bottom"
        width="300"
        trigger="manual"
        v-model="stockSelectVis">
        <div id="close-stock-selecte"><span @click="handleStockSelecteClose">×</span></div>
        <lui-form ref="form" label-width="100px">
        <lui-form-item label="库存策略选择">
        <lui-select v-model="stockSelected" placeholder="请选择" @change="handleStockSelectChange">
          <lui-option
            v-for="item in stockOptions"
            :key="+item.code"
            :label="item.name"
            :value="+item.code">
          </lui-option>
        </lui-select>
        </lui-form-item>
        </lui-form>
      </lui-popover>
    </div>
  </div>
</template>


<script>
import Utils from '@/utils/utils'
import { CombineDimBand } from './combineDimBand'

export default {
  props: {
    // 横纵坐标轴，index：0为横轴 1为纵轴； csyType：0代表数值 1代表百分比
    bandStyle: {
      type: Array,
      default () {
        return [
          { name: '价格带', csyType: 0, maxLevel: 8},
          { name: '销售件数', csyType: 1, maxLevel: 8}
        ]
      } 
    },
    // band宽度
    bandWidth: {
      type: Number,
      default: 600
    },
    // band高度
    bandHeight: {
      type: Number,
      default: 600
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
    miniAccuracyX: {
      type: Number,
      default: 5
    },
    // 最小精度 100份占比为多少 ※ 能被100整除
    miniAccuracyY: {
      type: Number,
      default: 5
    },
    // band 涉及等级、百分占比，等级对应颜色的数据
    value: {
      type: Object,
      default() {
        return {
          dataListX: [
            { name: 'a', value: '30' },
            { name: 'b', value: '10' },
            { name: 'c', value: '20' },
            { name: 'd', value: '20' },
            { name: 'e', value: '20' }
          ],
          dataListY: [
            { name: 'A', value: '10' },
            { name: 'B', value: '20' },
            { name: 'C', value: '30' },
            { name: 'D', value: '20' },
            { name: 'E', value: '20' }
          ],
          dataItemColor: {
            Aa: 0,
            Ab: 0,
            Ac: 0,
            Ad: 0,
            Ae: 0,
            Ba: 1,
            Bb: 1,
            Bc: 1,
            Bd: 1,
            Be: 1,
            Ca: 2,
            Cb: 2,
            Cc: 2,
            Cd: 2,
            Ce: 2,
            Da: 3,
            Db: 3,
            Dc: 3,
            Dd: 3,
            De: 3,
            Ea: 4,
            Eb: 4,
            Ec: 4,
            Ed: 4,
            Ee: 4 ,
          }
        }
      }
    },
    // 库存策略下拉数据
    stockOptions: {
      type: Array,
      default () {
        return [
          {
            name: 'R,s,S三点库存件数',
            code: '0'
          },
          {
            name: 'R,Q件数',
            code: '1'
          },
          {
            name: 'R,Q天数',
            code: '2'
          },
          {
            name: 'B,S定量',
            code: '3'
          },
          {
            name: 'B,S变量',
            code: '4'
          },
          {
            name: 'R,s,S三点库存天数',
            code: '5'
          },
          {
            name: 'R,s,S两点库存',
            code: '6'
          }
        ]
      } 
    },
  },
  data() { 
    return {
      bandData: Utils._.cloneDeep(this.value),
      combineDimBand: {},
      levelNameArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      levelNameLowerArr: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
      levelColorArr: ['#fcc9c9', '#dcbaf7', '#b6e8b1', '#ffd0ea', '#a7bde0', '#eab7d5', '#cbece2'],
      chartLeft: 30,
      colorChangeIndexArr: [],
      stockSelectVis: false,
      stockSelectPosition: {}, // 库存策略显示框相对坐标
      stockSelected: '', // 已选中的库存策略对应的value
      stockColorAssociate: {}, // 库存策略value值与 每个颜色之间的对应关系
      dataItemColorKey: [], // 每个小格子对应的name值数组
      stockColorArr: [], // 每个小格子对应的颜色值数组
      stockNum: {}, // 总计几种库存策略，汉字与颜色值对应关系
      colorNumberValue: []
    }
  },
  computed: {
       
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.bandData = Utils._.cloneDeep(newVal)
        console.log('ppppppp',this.bandData)
        this.transformDataItemColor()
        this.initBand()
      },
      deep: true
    }
  },
  mounted() {
    this.initStockColorAssociate()
    this.transformDataItemColor()
    this.initBand()
  },
  methods: {
    initBand() {
      // 创建舞台
      const stage = new Konva.Stage({
        container: 'container',
        width: this.bandWidth + this.chartLeft * 2,
        height: this.bandHeight + this.chartLeft *2
      })
      // 创建层
      const layer = new Konva.Layer()
      stage.add(layer)  
      const bandData = {
        x: this.cPadding, // band 相对 canvas 画布的左边距
        y: this.cPadding,
        cPadding: this.cPadding,
        bandWidth: this.bandWidth,
        bandHeight: this.bandHeight,
        maxLevel: this.maxLevel,
        miniAccuracyX: this.miniAccuracyX,
        miniAccuracyY: this.miniAccuracyY,
        dataListX: this.bandData.dataListX,
        dataListY: this.bandData.dataListY,
        dataItemColor: this.stockColorArr,
        originalDataItemColor: this.bandData.dataItemColor,
        chartLeft: this.chartLeft,
        bandStyleX: this.bandStyle[0].csyType,
        bandStyleY: this.bandStyle[1].csyType,
        layer: layer
      }
      this.combineDimBand = new CombineDimBand(bandData)
      if (this.bandStyle[0].csyType) {
        this.combineDimBand.drawXNode()
      }
      if (this.bandStyle[1].csyType) {
         this.combineDimBand.drawYNode()
      }
      this.combineDimBand.addToGroupOrLayer(layer)
      this.combineDimBand.addMouseEvent(stage, layer, this.emitData, this.fillColorDataChange)
      // combineDimBand.addFillItemEvent()
      layer.draw()
    },
    emitData (val) {
      console.log(val)
      this.$emit('input', val)
    },
    handleBandDataChange (type,index) {
      // 横轴输入模式处理
      if (!type) {
        let nodeXReg = document.querySelectorAll('.x-node-reg')
        if (index) {
          if (+this.bandData.dataListX[index].value <= +this.bandData.dataListX[index-1].value) {
            nodeXReg[index].innerText = '值应大于前方'
            return
          }
        }
        if (index !== this.value.dataListX.length - 1) {
          if (+this.bandData.dataListX[index].value >= +this.bandData.dataListX[index+1].value) {
            nodeXReg[index].innerText = '值应小于后方'
            return
          }
        }
        if (index === this.value.dataListX.length - 2) {
          this.bandData.dataListX[index + 1].value = this.bandData.dataListX[index].value + '+'
        }
        nodeXReg[index].innerText = ''
      }
      // 纵轴输入模式处理
      if (type) {
        let nodeYReg = document.querySelectorAll('.y-node-reg')
        if (index) {
          if (+this.bandData.dataListY[index].value <= +this.bandData.dataListY[index-1].value) {
            nodeYReg[index].innerText = '值应大于前方'
            return
          }
        }
        if (index !== this.value.dataListY.length - 2) {
          if (+this.bandData.dataListY[index].value >= +this.bandData.dataListY[index+1].value) {
            nodeYReg[index].innerText = '值应小于后方'
            return
          }
        }
        if (index === this.value.dataListY.length - 2) {
          this.bandData.dataListY[index + 1].value = this.bandData.dataListY[index].value + '+'
        }
        nodeYReg[index].innerText = ''
      }
      
      this.emitData(this.bandData)
    },
    // 横轴增加band
    handleXIncrease () {
      const nowBandLevel = this.bandData.dataListX.length
      // 横轴为百分比
      if (this.bandStyle[0].csyType && nowBandLevel < this.bandStyle[0].maxLevel) {
        const len = this.bandData.dataListY.length
        for (let i = 0; i < len; i++) {
          const lenX = this.bandData.dataListX.length
          const keyLast = this.levelNameArr[i] + this.levelNameLowerArr[lenX]
          this.bandData.dataItemColor[keyLast] = this.stockOptions[0].code
        }
        const item = {
          name: this.levelNameArr[nowBandLevel],
          value: this.miniAccuracyX,
        }
        for (let i = nowBandLevel - 1; i >= 0; i--) {
          if (this.bandData.dataListX[i].value > this.miniAccuracyX) {
            this.bandData.dataListX[i].value = this.bandData.dataListX[i].value - this.miniAccuracyX
            this.bandData.dataListX.push(item)
            this.emitData(this.bandData)
            return
          }
        }
      }
      // 横轴为输入模式
      if (!this.bandStyle[0].csyType && nowBandLevel < this.bandStyle[0].maxLevel) {
        const len = this.bandData.dataListY.length
        for (let i = 0; i < len; i++) {
          const lenX = this.bandData.dataListX.length
          const keyLast = this.levelNameArr[i] + this.levelNameLowerArr[lenX]
          const keyAdd = this.levelNameArr[i] + this.levelNameLowerArr[lenX-1]
          this.bandData.dataItemColor[keyLast] = this.bandData.dataItemColor[keyAdd]
          this.bandData.dataItemColor[keyAdd] = this.stockOptions[0].code
        }
        const addItem = {
          name: this.levelNameLowerArr[nowBandLevel-1],
          value: +this.bandData.dataListX[nowBandLevel-2].value + 1,
        }
        const lastItem = {
          name: this.levelNameLowerArr[nowBandLevel],
          value: (+this.bandData.dataListX[nowBandLevel-2].value + 1) + '+',
        }
        this.bandData.dataListX.length = nowBandLevel - 1
        this.bandData.dataListX.push(addItem)
        this.bandData.dataListX.push(lastItem)
        this.emitData(this.bandData)
      }
    },
    // 横轴减少band
    handleXReduce () {
      const nowBandLevel = this.bandData.dataListX.length
      // 横轴为百分比
      if (this.bandStyle[0].csyType && nowBandLevel > 1) {
        const len = this.bandData.dataListY.length
        for (let i = 0; i < len; i++) {
          const lenX = this.bandData.dataListX.length
          const keyDel = this.levelNameArr[i] + this.levelNameLowerArr[lenX-1]
          delete this.bandData.dataItemColor[keyDel]
        }
        this.bandData.dataListX[nowBandLevel - 2].value = (+this.bandData.dataListX[nowBandLevel - 2].value) + (+this.bandData.dataListX[nowBandLevel - 1].value)
        this.bandData.dataListX.length = nowBandLevel - 1
        this.emitData(this.bandData)
      }
      // 横轴为固定值
      if (!this.bandStyle[0].csyType && nowBandLevel > 2) {
        const len = this.bandData.dataListY.length
        for (let i = 0; i < len; i++) {
          const lenX = this.bandData.dataListX.length
          const keyLast = this.levelNameArr[i] + this.levelNameLowerArr[lenX-2]
          const keyDel = this.levelNameArr[i] + this.levelNameLowerArr[lenX-1]
          this.bandData.dataItemColor[keyLast] = this.bandData.dataItemColor[keyDel]
          delete this.bandData.dataItemColor[keyDel]
        }
        this.bandData.dataListX.splice((nowBandLevel - 2), 1)
        this.bandData.dataListX[nowBandLevel - 2].name = this.levelNameArr[nowBandLevel - 2]
        this.bandData.dataListX[nowBandLevel - 2].value = (+this.bandData.dataListX[nowBandLevel - 3].value) + '+'
        this.emitData(this.bandData)
      }
    },
    // 纵轴增加band
    handleYIncrease () {
      const nowBandLevel = this.bandData.dataListY.length
      // 纵轴为百分比
      if (this.bandStyle[1].csyType && nowBandLevel < this.bandStyle[1].maxLevel) {
        const item = {
          name: this.levelNameArr[nowBandLevel],
          value: this.miniAccuracyY,
        }
        const lenX = this.bandData.dataListX.length
        for (let i = 0; i < lenX; i++) {
          const lenY = this.bandData.dataListY.length
          const keyAdd = this.levelNameArr[lenY] + this.levelNameLowerArr[i]
          this.bandData.dataItemColor[keyAdd] = this.stockOptions[0].code
        }
        for (let i = nowBandLevel - 1; i >= 0; i--) {
          if (this.bandData.dataListY[i].value > this.miniAccuracyY) {
            this.bandData.dataListY[i].value = this.bandData.dataListY[i].value - this.miniAccuracyY
            this.bandData.dataListY.push(item)
            this.emitData(this.bandData)
            return
          }
        }
      }
      // 纵轴为输入模式
      if (!this.bandStyle[1].csyType && nowBandLevel < this.bandStyle[1].maxLevel) {
        const lenX = this.bandData.dataListX.length
        for (let i = 0; i < lenX; i++) {
          const lenY = this.bandData.dataListY.length
          const keyLast = this.levelNameArr[lenY] + this.levelNameLowerArr[i]
          const keyAdd = this.levelNameArr[lenY-1] + this.levelNameLowerArr[i]
          this.bandData.dataItemColor[keyLast] = this.bandData.dataItemColor[keyAdd]
          this.bandData.dataItemColor[keyAdd] = this.stockOptions[0].code
        }
        const addItem = {
          name: this.levelNameArr[nowBandLevel-1],
          value: +this.bandData.dataListY[nowBandLevel-2].value + 1,
        }
        const lastItem = {
          name: this.levelNameArr[nowBandLevel],
          value: (+this.bandData.dataListY[nowBandLevel-2].value + 1) + '+',
        }
        // let startIndex = this.bandData.dataItemColor.length -this.bandData.dataListX.length
        // let insertNum = this.bandData.dataListX.length
        // for (let i = 0; i < insertNum; i++) {
        //   this.bandData.dataItemColor.splice(startIndex, 0, 'skyBlue')
        // }
        console.log(this.bandData.dataItemColor)
        this.bandData.dataListY.length = nowBandLevel - 1
        this.bandData.dataListY.push(addItem)
        this.bandData.dataListY.push(lastItem)
        this.emitData(this.bandData)
      }
    },
    // 纵轴减少band
    handleYReduce () {
      const nowBandLevel = this.bandData.dataListY.length
      // 横轴为百分比
      if (this.bandStyle[1].csyType && nowBandLevel > 1) {
        const lenX = this.bandData.dataListX.length
        for (let i = 0; i < lenX; i++) {
          const lenY = this.bandData.dataListY.length
          const keyDel = this.levelNameArr[lenY-1] + this.levelNameLowerArr[i]
          delete this.bandData.dataItemColor[keyDel]
        }
        this.bandData.dataListY[nowBandLevel - 2].value = (+this.bandData.dataListY[nowBandLevel - 2].value) + (+this.bandData.dataListY[nowBandLevel - 1].value)
        this.bandData.dataListY.length = nowBandLevel - 1
        this.emitData(this.bandData)
      }
      // 纵轴为固定值
      if (!this.bandStyle[1].csyType && nowBandLevel > 2) {
        const lenX = this.bandData.dataListX.length
        for (let i = 0; i < lenX; i++) {
          const lenY = this.bandData.dataListY.length
          const keyLast = this.levelNameArr[lenY-2] + this.levelNameLowerArr[i]
          const keyDel = this.levelNameArr[lenY-1] + this.levelNameLowerArr[i]
          this.bandData.dataItemColor[keyLast] = this.bandData.dataItemColor[keyDel]
          delete this.bandData.dataItemColor[keyDel]
        }
        this.bandData.dataListY.splice((nowBandLevel - 2), 1)
        this.bandData.dataListY[nowBandLevel - 2].name = this.levelNameArr[nowBandLevel - 2]
        this.bandData.dataListY[nowBandLevel - 2].value = (+this.bandData.dataListY[nowBandLevel - 3].value) + '+'
        this.emitData(this.bandData)
      }
    },
    fillColorDataChange (indexArr,position) {
      this. stockSelected = ''
      this.colorChangeIndexArr = indexArr
      this.stockSelectVis = true
      this.stockSelectPosition = position
      if (this.colorChangeIndexArr.length === 1) {
        const key = this.dataItemColorKey[this.colorChangeIndexArr[0]]
        this.stockSelected = +this.bandData.dataItemColor[key]
      }
    },
    handleStockSelectChange () {
      this.stockSelectVis = false
      this.colorChangeIndexArr.forEach((item, index) => {
        this.bandData.dataItemColor[this.dataItemColorKey[item]] = this.stockSelected
      })
      this.emitData(this.bandData)
      this. stockSelected = ''
    },
    initStockColorAssociate () {
      // 建立库存策略value与color对应关系
      this.stockOptions.forEach((item, index) => {
        this.stockColorAssociate[item.code] = this.levelColorArr[index]
      })
    },
    transformDataItemColor () {
      this.stockColorArr = []
      this.dataItemColorKey = []
      // 获取当前data中color数据所有key
      const lenX = this.bandData.dataListX.length
      const lenY = this.bandData.dataListY.length
      for (let i = 0; i < lenY; i++) {
        for (let j = 0; j < lenX; j++) {
          const key = this.levelNameArr[i] + this.levelNameLowerArr[j]
          this.dataItemColorKey.push(key)
        }
      }
      // 获取当前data中color数据所有value
      const colorNumberValue = []
      this.dataItemColorKey.forEach((item, index) => {
        colorNumberValue.push(this.bandData.dataItemColor[item])
        this.stockColorArr.push(this.stockColorAssociate[this.bandData.dataItemColor[item]])
      })
    },
    handleStockSelecteClose () {
      this.combineDimBand.removeChangeColorRect()
      this.stockSelectVis = false
      this. stockSelected = ''
    }
  }
    
}
</script>

<style lang="stylus">
#container
  float left
  display inline-block
.konvajs-content
  display inline-block
.one-dimensional-band
  position relative
#csys-x
  position absolute
  display flex
  height 20px
.x-node
  width 30px
.item-node-x
  flex 1
  text-align right
#csys-y
  position absolute
  display flex
  flex-direction: column
  width 45px
.item-node-y
  position relative
  flex 1
.node-y 
  position absolute
  bottom 0
.x-node-reg, .y-node-reg 
  color red
  font-size 12px
  line-height 12px
.x-band-btn
  position absolute
  top 20px
  font-size 14px
#x-btn-increase, 
#x-btn-reduce, 
#y-btn-increase,
#y-btn-reduce
  display inline-block
  margin-right 10px
  width 20px
  height 20px
  border 1px solid black
  border-radius 5px
  text-align center
.y-band-btn
  position absolute
  left 20px
  font-size 14px
.band-item-color-select
  position absolute
  font-size 16px
#close-stock-selecte
  padding-bottom 10px
  text-align right
  span
    display inline-block
    width 15px
    height 15px
    font-size 16px
    line-height 15px
    text-align center
</style>
