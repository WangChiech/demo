<template>
  <div 
    class="comb-dimensional-band" 
    :style="{ 
      height: bandHeight + inputDivlength.x + 50 + 'px', 
      width: bandWidth + inputDivlength.y + 140 + 'px' 
    }">
    <div id="container"></div>
    <div class="band-label-group">
      <!-- band x轴input -->
      <div 
        class="x-band-input-group"
        :style="{
          width: `${bandWidth}px`,
          height: `${inputDivlength.x / 4}px`,
          top: `${inputDivlength.x / 2}px`,
          left: `${inputDivlength.y}px`
        }">
        <input
          v-for="(item, index) in xNum"
          :key="item"
          v-model="xValueList[index]"
          class="x-band-label-item"
          :style="{
            width: `${bandWidth / xNum}px`,
            'line-height': `${inputDivlength.x / 4}px`
          }"
          :disabled="
            index > (bandStyle[0].csyType ? 
              xNum - 3 :
              xNum - 2)
          "
          @change="handleChangeXValList(index)"
        />
      </div>
      <div 
        class="x-band-label-group"
        :style="{
          width: `${bandWidth}px`,
          height: `${inputDivlength.x / 4}px`,
          top: `${inputDivlength.x / 4 * 3}px`,
          left: `${inputDivlength.y}px`
        }">
        <div
          v-for="item in xNum"
          :key="item"
          class="x-band-label-item"
          :style="{
            'line-height': `${inputDivlength.x / 4}px`
          }"
        >
          {{ `${csyLabel.xAxis}${item}` }}
        </div>
      </div>
      <div 
        class="y-band-input-group"
        :style="{
          width: `${inputDivlength.x / 4 * 3}px`,
          height: `${bandHeight}px`,
          top: `${inputDivlength.x}px`
        }">
        <input
          v-for="(item, index) in yNum"
          :key="item"
          v-model="yValueList[index]"
          class="x-band-label-item"
          :disabled="
            index > (bandStyle[1].csyType ? 
              yNum - 3 :
              yNum - 2)
          "
          :style="{
            width: `${inputDivlength.y / 4 * 3}px`,
            height: `${bandHeight / yNum}px`,
            'line-height': `${bandHeight / yNum - 2}px`
          }"
          @change="handleChangeYValList(index)"
        />
      </div>
      <div 
        class="y-band-label-group"
        :style="{
          width: `${inputDivlength.y / 4}px`,
          height: `${bandHeight}px`,
          top: `${inputDivlength.x}px`,
          left: `${inputDivlength.y / 4 * 3}px`
        }">
        <div
          v-for="item in yNum"
          :key="item"
          class="y-band-label-item"
          :style="{
            'line-height': `${bandHeight / yNum - 2}px`
          }"
        >
          {{ `${csyLabel.yAxis}${item}` }}
        </div>
      </div>
    </div>
    
    <!-- 横轴band增减按钮 -->
    <div 
      class="x-band-btn"
      :style="{
        top: inputDivlength.x / 2 + 'px',
        left: bandWidth + 20 + inputDivlength.y + 'px' 
      }">
      <div class="x-name">{{ bandStyle[0].name }}</div>
      <div class="x-btn">
        <lui-button id="x-btn-increase" type="primary" icon="lui-icon-plus" @click="handleXIncrease"></lui-button>
        <lui-button id="x-btn-reduce" type="danger" icon="lui-icon-minus" @click="handleXReduce"></lui-button>
      </div>
    </div>
    <!-- 纵轴band增减按钮 -->
    <div 
      class="y-band-btn"
      :style="{
        top: bandHeight + inputDivlength.x + 4 + 'px' 
      }">
      <div class="y-name">{{ bandStyle[1].name }}</div>
      <div class="y-btn">
        <lui-button id="y-btn-increase" type="primary" icon="lui-icon-plus" @click="handleYIncrease"></lui-button>
        <lui-button id="y-btn-reduce" type="danger" icon="lui-icon-minus" @click="handleYReduce"></lui-button>
      </div>
    </div>
    <!-- 重置 -->
    <div 
      class="reset-btn"
      :style="{
        top: bandHeight + inputDivlength.x + 20 + 'px' ,
        left: bandWidth - 62 + inputDivlength.y + 'px'
      }">
      <div class="y-btn">
        <lui-button id="y-btn-increase" type="primary" plain @click="handleReset">重置</lui-button>
      </div>
    </div>
    <!-- band库存对应颜色显示条 -->
    <div
      class="stock-color-associate"
      :style="{
        top: bandHeight + inputDivlength.x - 10 - 40 * bandColorRect.length + 'px', 
        left: bandWidth + inputDivlength.y + 20 + 'px'
      }">
      <div v-for="item in bandColorRect" :key="item.name" class="stock-color-item">
        <div
          class="stock-color-rect"
          :style="{
            background: item.color
          }">
        </div>
        <div class="stock-name">{{ item.name }}</div>
      </div>
    </div>
    <!-- 下拉框触发颜色更改 -->
    <div 
      class="band-item-color-select"
      :style="{
        left: stockSelectPosition.x + 'px',
        top: stockSelectPosition.y + 'px' 
      }"
      @mousedown="bandSelectMouseDown"
      @mouseup="bandSelectMouseUp">
      <lui-popover
        v-model="stockSelectVis"
        placement="bottom"
        width="300"
        trigger="manual">
        <div id="close-stock-selecte">
          <span @click="handleStockSelecteClose">×</span>
        </div>
        <lui-form ref="form" label-width="100px">
          <lui-form-item :label="prop.dlgSelectName">
            <lui-select v-model="stockSelected" placeholder="请选择" @change="handleStockSelectChange">
              <lui-option
                v-for="item in stockOptions"
                :key="+item[prop.value]"
                :label="item[prop.label]"
                :value="+item[prop.value]">
              </lui-option>
            </lui-select>
          </lui-form-item>
        </lui-form>
      </lui-popover>
    </div>
  </div>
</template>


<script>
import Cdb from './index'

export default {
  props: {
    // 设置弹框下拉数据key
    prop: { 
      type: Object,
      default() {
        return {
          dlgSelectName: 'Band选择', // 设置弹框下拉文字描述
          label: 'name', // 自定义传入下拉数据格式
          value: 'code' // 自定义传入下拉数据格式
        }
      }
    },
    // 横纵坐标轴，index：0为横轴 1为纵轴； csyType：0代表数值 1代表百分比; maxLevel: band最大级别数
    bandStyle: {
      type: Array,
      default() {
        return [
          { name: '价格带', csyType: 0, maxLevel: 6 },
          { name: '销售件数', csyType: 1, maxLevel: 6 }
        ]
      } 
    },
    // band宽度
    bandWidth: {
      type: Number,
      default: 500
    },
    // band高度
    bandHeight: {
      type: Number,
      default: 500
    },
    // band 左右间隙
    cPadding: {
      type: Number,
      default: 15
    },
    // 横轴为百分比是，最小精度 100份占比为多少 ※ 能被100整除////////////////
    miniAccuracyX: {
      type: Number,
      default: 5
    },
    // 纵轴为百分比时，最小精度 100份占比为多少 ※ 能被100整除/////////////
    miniAccuracyY: {
      type: Number,
      default: 5
    },
    // Band顺序，对应每个颜色
    levelColorArr: {
      type: Array,
      default() {
        return [
          '#9fbfff', // DDF6CD A
          '#79cda7', // CBECE2 B
          '#a09fa0', // FCEBA5 C
          '#ffe262', // FFD6B8 D
          '#f39993', // FBCEE7 E
          '#dcdddd', // FFBCBC F
          '#f3f4f5', // ccc 空
          '#EBD9AD' // EBD9AD
        ]
      }
    },
    // band 涉及等级、百分占比，等级对应颜色的数据
    value: {
      type: Array,
      default() {
        return [
          { detailName: 'M5P4', bandName: 'E', valueX: 50, valueY: 40 },
          { detailName: 'M6P4', bandName: 'F', valueX: 60, valueY: 40 },
          { detailName: 'M1P5', bandName: 'E', valueX: 10, valueY: 50 },
          { detailName: 'M2P5', bandName: 'E', valueX: 20, valueY: 50 },
          { detailName: 'M3P5', bandName: 'E', valueX: 30, valueY: 50 },
          { detailName: 'M4P5', bandName: 'E', valueX: 40, valueY: 50 },
          { detailName: 'M5P5', bandName: 'E', valueX: 50, valueY: 50 },
          { detailName: 'M6P5', bandName: 'F', valueX: 60, valueY: 50 },
          { detailName: 'M1P6', bandName: 'F', valueX: 10, valueY: 60 },
          { detailName: 'M2P6', bandName: 'F', valueX: 20, valueY: 60 },
          { detailName: 'M3P6', bandName: 'F', valueX: 30, valueY: 60 },
          { detailName: 'M4P6', bandName: 'F', valueX: 40, valueY: 60 },
          { detailName: 'M5P6', bandName: 'F', valueX: 50, valueY: 60 },
          { detailName: 'M1P1', bandName: 'A', valueX: 10, valueY: 10 },
          { detailName: 'M2P1', bandName: 'B', valueX: 20, valueY: 10 },
          { detailName: 'M3P1', bandName: 'C', valueX: 30, valueY: 10 },
          { detailName: 'M4P1', bandName: 'D', valueX: 40, valueY: 10 },
          { detailName: 'M5P1', bandName: 'E', valueX: 50, valueY: 10 },
          { detailName: 'M6P1', bandName: 'F', valueX: 60, valueY: 10 },
          { detailName: 'M1P2', bandName: 'B', valueX: 10, valueY: 20 },
          { detailName: 'M2P2', bandName: 'B', valueX: 20, valueY: 20 },
          { detailName: 'M3P2', bandName: 'C', valueX: 30, valueY: 20 },
          { detailName: 'M4P2', bandName: 'D', valueX: 40, valueY: 20 },
          { detailName: 'M5P2', bandName: 'E', valueX: 50, valueY: 20 },
          { detailName: 'M6P2', bandName: 'F', valueX: 60, valueY: 20 },
          { detailName: 'M1P3', bandName: 'C', valueX: 10, valueY: 30 },
          { detailName: 'M2P3', bandName: 'C', valueX: 20, valueY: 30 },
          { detailName: 'M3P3', bandName: 'C', valueX: 30, valueY: 30 },
          { detailName: 'M4P3', bandName: 'D', valueX: 40, valueY: 30 },
          { detailName: 'M5P3', bandName: 'E', valueX: 50, valueY: 30 },
          { detailName: 'M6P3', bandName: 'F', valueX: 60, valueY: 30 },
          { detailName: 'M1P4', bandName: 'D', valueX: 10, valueY: 40 },
          { detailName: 'M2P4', bandName: 'D', valueX: 20, valueY: 40 },
          { detailName: 'M3P4', bandName: 'D', valueX: 30, valueY: 40 },
          { detailName: 'M4P4', bandName: 'D', valueX: 40, valueY: 40 },
          { detailName: 'M6P6', bandName: 'F', valueX: 60, valueY: 60 }
        ]
      }
    },
    // 库存策略下拉数据
    stockOptions: {
      type: Array,
      default() {
        return [
          {
            name: 'A',
            code: '1'
          },
          {
            name: 'B',
            code: '2'
          },
          {
            name: 'C',
            code: '3'
          },
          {
            name: 'D',
            code: '4'
          },
          {
            name: 'E',
            code: '5'
          },
          {
            name: 'F',
            code: '6'
          }
        ]
      } 
    },
    getValueXY: {
      type: Function,
      default: () => {}
    }
  },
  data() { 
    return {
      bandData: _.cloneDeep(this.value), // band 涉及等级、百分占比，等级对应颜色的数据
      combineDimBand: {}, // 存储所有canvas数据方法
      chartLeft: 30, // band边距
      colorChangeIndexArr: [], // 选中改变库存策略区域的index数组
      stockSelectVis: false, // 库存策略框是否可见
      stockSelectPosition: {}, // 库存策略显示框相对坐标
      stockSelected: '', // 已选中的库存策略对应的value
      bandColorAssociate: {}, // 库存策略value值与 每个颜色之间的对应关系{0: "#DDF6CD", 1: "#CBECE2"...}
      dataItemColorKey: [], // 每个小格子对应的name值数组
      bandColorArr: [], // 每个小格子对应的颜色值数组
      bandCodeNameAssociate: {}, // 总计几种库存策略，汉字与颜色值对应关系 {0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F"}
      colorNumberValue: [], // 当前data中color数据所有value
      bandColorRect: [], // 当前band中库存策略种类数
      bandSelectClick: false,
      xNum: 1,
      yNum: 1,
      bandNameList: [],
      inputDivlength: {
        x: 100,
        y: 100
      },
      csyLabel: {
        xAxis: 'A',
        yAxis: 'B'
      },
      xValueList: [],
      yValueList: [],
      // 只改变横轴纵轴值，不重新渲染band图表
      isReRenderBand: true
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.initBandData(newVal)
      },
      deep: true
    }
  },
  mounted() {
    this.initBandData()
    window.document.onmousedown = (e) => {
      if (this.stockSelectVis && !this.bandSelectClick) {
        this.closeStockSelect()
        this.combineDimBand.removeChangeColorRect()
      }
    }
  },
  methods: {
    // 初始化canvas
    initBand() {
      // 创建舞台
      const stage = new window.Konva.Stage({
        container: 'container',
        width: this.bandWidth + this.inputDivlength.y,
        height: this.bandHeight + this.inputDivlength.x
      })
      // 创建层
      const layer = new window.Konva.Layer()
      stage.add(layer)  
      const bandData = {
        x: this.inputDivlength.y, // band 相对 canvas 画布的左边距
        y: this.inputDivlength.x,
        bandData: this.bandData,
        cPadding: this.cPadding,
        bandWidth: this.bandWidth,
        bandHeight: this.bandHeight,
        maxLevel: this.maxLevel,
        xNum: this.xNum,
        yNum: this.yNum,
        yAxis: this.csyLabel.yAxis,
        xAxis: this.csyLabel.xAxis,
        bandNameList: this.bandNameList,
        dataItemColor: this.bandColorArr,
        chartLeft: 0,
        inputDivlength: this.inputDivlength,
        layer
      }
      this.combineDimBand = new Cdb.CombineDimBand(bandData)
      this.combineDimBand.addToGroupOrLayer(layer)
      this.combineDimBand.addMouseEvent(
        stage, 
        layer, 
        this.emitData, 
        this.fillColorDataChange,
        this.closeStockSelect
      )
      layer.draw()
    },
    // 初始化数据
    initBandData(newVal) {
      const bandXIndexList = []
      const bandYIndexList = []
      const bandDataArr = []
      const bandData = _.cloneDeep(this.value)
      this.bandData = _.cloneDeep(this.value)
      this.bandData.forEach((item, index) => {
        if (!index) {
          this.csyLabel.xAxis = item.detailName.charAt(0)
          this.csyLabel.yAxis = item.detailName.charAt(2)
        }
        bandXIndexList.push(item.detailName.charAt(1))
        bandYIndexList.push(item.detailName.charAt(3))
      })
      this.xNum = Array.from(new Set(bandXIndexList)).length
      this.yNum = Array.from(new Set(bandYIndexList)).length
      this.bandNameList = []
      this.xValueList = []
      this.yValueList = []
      bandData.forEach((item, index) => {
        for (let xItem = 1; xItem <= this.yNum; xItem += 1) {
          if (+item.detailName.charAt(3) === +xItem) {
            const targetIndex = this.xNum * (xItem - 1) - 1 + (+item.detailName.charAt(1))
            this.bandData[targetIndex] = item
            this.bandNameList[+targetIndex] = item.bandName
            if (!(targetIndex %  this.xNum)) {
              this.yValueList[targetIndex /  this.xNum] = item.valueY
            }
            if (targetIndex < this.xNum) {
              this.xValueList[targetIndex] = item.valueX
            }
          }
        }
      })
      this.getValueXY(this.xValueList, this.yValueList)
      if (this.isReRenderBand) {
        this.initBandColorAssociate()
        this.transformDataItemColor()
        this.initBand()
      }
      
    },
    // 向父组件传出数据
    emitData(val, isReRenderBand) {
      this.isReRenderBand = isReRenderBand ? false : true
      this.getValueXY(this.xValueList, this.yValueList)
      this.$emit('input', val)
    },
    // 横轴增加band
    handleXIncrease() {
      if (this.xNum >= this.bandStyle[0].maxLevel) {
        return
      }
      const fn = (item) => {
        if (this.bandStyle[0].csyType) {
          item[this.xNum] = item[this.xNum - 1]
          item[this.xNum - 1] = item[this.xNum - 2]
          item[this.xNum - 2] = {
            bandName: '空',
            valueX: +item[this.xNum - 2].valueX + 1, 
            valueY: +item[this.xNum - 2].valueY
          }
        } else {
          item[this.xNum] = item[this.xNum - 1]
          item[this.xNum - 1] = {
            bandName: '空',
            valueX: +item[this.xNum - 2].valueX + 1, 
            valueY: +item[this.xNum - 2].valueY
          }
        }
      }
      if (this.bandStyle[0].csyType) {
        this.xValueList[this.xNum] = this.xValueList[this.xNum - 1]
        this.xValueList[this.xNum - 1] = this.xValueList[this.xNum - 2]
        this.xValueList[this.xNum - 2] = this.xValueList[this.xNum - 3] + 1
      } else {
        this.xValueList[this.xNum] = this.xValueList[this.xNum - 1]
        this.xValueList[this.xNum - 1] = this.xValueList[this.xNum - 2] + 1
      }
      this.increaseOrReduceLength(fn, 0)
    },
    // 横轴减少band
    handleXReduce() {
      if (this.xNum <= 3) {
        return
      }
      const fn = (item) => {
        if (this.bandStyle[0].csyType) {
          item[this.xNum - 3] = item[this.xNum - 2]
          item[this.xNum - 2] = item[this.xNum - 1]
        } else {
          item[this.xNum - 2] = item[this.xNum - 1]
        }
        item.pop()
      }
      if (this.bandStyle[0].csyType) {
        this.xValueList[this.xNum - 3] = this.xValueList[this.xNum - 2]
        this.xValueList[this.xNum - 2] = this.xValueList[this.xNum - 1]
      } else {
        this.xValueList[this.xNum - 2] = this.xValueList[this.xNum - 1]
      }
      this.xValueList.pop()
      this.increaseOrReduceLength(fn, 1)
    },
    // 纵轴增加band
    handleYIncrease() {
      if (this.yNum >= this.bandStyle[1].maxLevel) {
        return
      }
      const fn = (item, index, arr) => {
        if (
          index === (arr.length - 2 - this.bandStyle[1].csyType)
        ) {
          this.xValueList.forEach((val, index) => {
            item.push({
              bandName: '空',
              valueX: val, 
              valueY: item[0].valueY + 1
            })
          })
        }
      }
      if (this.bandStyle[1].csyType) {
        this.yValueList[this.yNum] = this.yValueList[this.yNum - 1]
        this.yValueList[this.yNum - 1] = this.yValueList[this.yNum - 2]
        this.yValueList[this.yNum - 2] = this.yValueList[this.yNum - 3] + 1
      } else {
        this.yValueList[this.yNum] = this.yValueList[this.yNum - 1]
        this.yValueList[this.yNum - 1] = this.yValueList[this.yNum - 2] + 1
      }
      this.increaseOrReduceLength(fn, 2)
    },
    // 纵轴减少band
    handleYReduce() {
      if (this.yNum <= 3) {
        return
      }
      const fn = (item, index, arr) => {
        if (
          index === (arr.length - 2 - this.bandStyle[1].csyType)
        ) {
          item.length = 0
        }
      }
      if (this.bandStyle[1].csyType) {
        this.yValueList[this.yNum - 3] = this.yValueList[this.yNum - 2]
        this.yValueList[this.yNum - 2] = this.yValueList[this.yNum - 1]
      } else {
        this.yValueList[this.yNum - 2] = this.yValueList[this.yNum - 1]
      }
      this.yValueList.pop()
      this.increaseOrReduceLength(fn, 3)
    },
    handleChangeXValList(val) {
      this.bandData.forEach((item, index) => {
        if (index % this.xNum === val) {
          item.valueX = +this.xValueList[val]
        }
      })
      this.emitData(this.bandData, true)
    },
    handleChangeYValList(val) {
      const leftIndex = val * this.xNum
      const rightIndex = (val + 1) * this.xNum - 1
      this.bandData.forEach((item, index) => {
        if (index >= leftIndex && index <= rightIndex) {
          item.valueY = +this.yValueList[val]
        }
      })
      this.emitData(this.bandData, true)
    },
    // 库存策略显示
    fillColorDataChange(indexArr, position) {
      this.stockSelected = ''
      this.colorChangeIndexArr = indexArr
      this.stockSelectVis = true
      this.stockSelectPosition = position
      // 如果选中一个，则下拉框默认回显
      if (this.colorChangeIndexArr.length === 1) {
        const key = this.bandNameList[this.colorChangeIndexArr[0]]
        this.stockSelected = +(_.findKey(this.bandCodeNameAssociate, (val) => {
          return val === key
        }))
        if (!this.stockSelected) {
          this.stockSelected = ''
        }
      }
    },
    // 选择库存策略
    handleStockSelectChange() {
      this.stockSelectVis = false
      this.dataChangeToBandData(this.colorChangeIndexArr)
      this.stockSelected = ''
    },
    // 关闭库存策略
    closeStockSelect() {
      this.stockSelectVis = false
      this.stockSelected = ''
    },
    // 建立库存策略value与color对应关系
    initBandColorAssociate() {
      const stockOptionsNew = _.cloneDeep(this.stockOptions)
      stockOptionsNew[stockOptionsNew.length] = {
        name: '空',
        code: '0'
      }
      stockOptionsNew.forEach((item, index) => {
        this.bandColorAssociate[item[this.prop.value]] = this.levelColorArr[index]
        this.bandCodeNameAssociate[item[this.prop.value]] = item[this.prop.label]
      })
    },
    // 转换库存策略为所需颜色数据
    transformDataItemColor() {
      this.bandColorArr = []
      // 获取当前data中color数据所有value
      this.bandNameList.forEach((item, index) => {
        this.bandColorArr.push(
          this.bandColorAssociate[
            _.findKey(this.bandCodeNameAssociate, (val) => {
              return val === item
            })
          ]
        )
      })
      const bandColorRect = Array.from(new Set(this.bandNameList)).sort()
      this.bandColorRect = []
      bandColorRect.forEach((item, index) => {
        this.bandColorRect[index] = {
          name: item,
          color: this.bandColorAssociate[
            _.findKey(this.bandCodeNameAssociate, (val) => {
              return val === item
            })
          ]
        }
      })
    },
    // 关闭库存策略
    handleStockSelecteClose() {
      this.combineDimBand.removeChangeColorRect()
      this.closeStockSelect()
    },
    // 是否点击select框
    bandSelectMouseDown() {
      this.bandSelectClick = true
    },
    // 是否点击select框
    bandSelectMouseUp() {
      this.bandSelectClick = false
    },
    dataChangeToBandData(arr) {
      const bandData = []
      this.bandData.forEach((item, index) => {
        if (arr.includes(index)) {
          item.bandName = this.bandCodeNameAssociate[+this.stockSelected]
        }
        bandData.push(item)
      })
      this.emitData(bandData)
    },
    increaseOrReduceLength(fn, type) {
      // 数据排序
      const totle = this.xNum * this.yNum
      const itemList = []
      for(let i = 0; i < totle; i += this.xNum) {
        itemList.push(this.bandData.slice(i, i + this.xNum))
      }
      const bandData = []
      itemList.forEach((item, index) => {
        fn(item, index, itemList)
        bandData.push(...item)
      })
      this.rectLabel(bandData, type)
      this.emitData(bandData)
    },
    // 求算detailName，并根据bandName合并排序
    rectLabel(bandData, type) {
      const label = []
      let xNum = this.xNum
      let yNum = this.yNum
      if (!type) {
        xNum += 1
      } else if (type === 1) {
        xNum -= 1
      } else if (type === 2) {
        yNum += 1
      } else if (type === 3) {
        yNum -= 1
      }
      for (let i = 0; i < yNum; i += 1) {
        for (let j = 0; j < xNum; j += 1) {
          label.push(`${this.csyLabel.xAxis}${j + 1}${this.csyLabel.yAxis}${i + 1}`)
        }
      }
      bandData.forEach((item, index) => {
        item.detailName = label[index]
      })
    },
    // 改变横轴输入值
    handleReset() {
      this.bandData.forEach((item, index) => {
        item.bandName = '空'
      })
      this.emitData(this.bandData)
    }
  }
    
}
</script>

<style lang="scss" scoped>
.comb-dimensional-band {
  display: inline-block;
  position: relative;
}
.konvajs-content {
  display: inline-block;
}
#csys-x {
  position: absolute;
  display: flex;
  height: 20px;
}
.x-node {
  width: 30px;
}
.item-node-x {
  flex: 1;
  text-align: right;
}
#csys-y {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 45px;
}
.item-node-y {
  position: relative;
  flex: 1;
}
.node-y {
  position: absolute;
  bottom: 0;
}
.x-node-reg, .y-node-reg {
  color: red;
  font-size: 12px;
  line-height: 12px;
}
.x-band-btn {
  position: absolute;
  top: 20px;
  text-align: left;
}
.y-band-btn {
  position: absolute;
  left: 20px;
}
.band-item-color-select {
  position: absolute;
  font-size: 16px;
}
#close-stock-selecte {
  padding-bottom: 10px;
  text-align: right;
  cursor: pointer;
  span {
    display: inline-block;
    width: 15px;
    height: 15px;
    font-size: 16px;
    line-height: 15px;
    text-align: center;
  }
}
.stock-color-associate {
  position: absolute;
  font-size: 16px;
  text-align: left;
}
.stock-color-item {
  padding-top: 15px;
}
.stock-color-rect {
  display: inline-block;
  width: 30px;
  height: 10px;
  vertical-align: center;
}
.stock-name {
  display: inline-block;
  padding-left: 10px;
}
.x-band-input-group,
.y-band-input-group
 {
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 40px;
}
.x-band-label-group,
.y-band-label-group
 {
  display: flex;
  position: absolute;
  background-color: #f3f4f5;
}
.x-band-label-item,
.y-band-label-item
 {
  flex: 1;
  text-align: center;
  font-size: 14px;
  border: 0.5px solid #ccc;
}
.y-band-label-group {
  flex-flow: column;
}
.lui-button {
  padding: 3px;
}
.reset-btn {
  position: absolute;
  .lui-button {
    padding: 3px 16px;
  }
}
.y-name,
.x-name {
  padding: 4px 0 6px;
  font-size: 14px;
}
.band-item-color-select {
  ::v-deep .lui-form-item__content {
    margin-left: 120px!important;
  }
}

</style>
