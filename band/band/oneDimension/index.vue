<template>
  <div class="one-dimensional-band">
    <div id="container">
    </div>
    <!-- 输入模式文本框 -->
    <div v-if="isInputType" class="band-input-group">
      <div v-for="(item, index) in value" :key="`${index}${item.value}`" class="band-input">
        <input
          :ref="`input-${index}`"
          v-model="inputData[index].value"
          type="text"
          :style="{
            left: inputXList[index] - 23 + 'px', 
            top: '15px'
          }"
          @focus="handleInputFocus(index)"
          @blur="handleInputBlur(index)"
          @change="handleInputChange(index)"
        >
      </div>
    </div>
    <!-- 横轴band增减按钮 -->
    <div 
      id="band-btn"
      :style="{
        left: cPadding + bandWidth + 130 + 'px', 
        top: '65px'
      }">
      <lui-button type="primary" icon="lui-icon-plus" @click="handleBandLevelIncrease"></lui-button>
      <lui-button type="danger" icon="lui-icon-minus" @click="handleBandLevelReduce"></lui-button>
    </div>
  </div>
</template>


<script>
import Konva from 'konva'
import Odb from './index'

export default {
  props: {
    // 设置下拉数据key
    prop: { 
      type: Object,
      default() {
        return {
          label: 'name', // 自定义传入下拉数据格式
          value: 'code' // 自定义传入下拉数据格式
        }
      }
    },
    // band宽度，含左右间隙
    bandWidth: {
      type: Number,
      default: 1300
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
      type: Number | String,
      default: 5
    },
    // 库存策略顺序，对应每个颜色
    levelColorArr: {
      type: Object,
      default() {
        return {
          A: '#9fbfff', // DDF6CD
          B: '#79cda7', // CBECE2
          C: '#a09fa0', // FCEBA5
          D: '#ffe262', // EBD9AD
          E: '#f39993', // FFD6B8
          F: '#dcdddd', // FBCEE7
          G: '#FFBCBC' //
        }
      }
    },
    // band 涉及等级、百分占比，等级对应颜色的数据
    value: {
      type: Array,
      default() {
        return [
          { name: 'A', value: '30' },
          { name: 'B', value: '10' },
          { name: 'C', value: '20' },
          { name: 'D', value: '20' },
          { name: 'E', value: '20' }
        ]
      }
    },
    // 库存策略下拉数据
    stockOptions: {
      type: Array,
      default() {
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
    // 百分比时是否这是展示百分比文本
    isShowPercentText: {
      type: Boolean,
      default: true
    },
    // 是否是是输入模式
    isInputType: {
      type: Boolean,
      default: false
    },
    // 是否绘制F节点
    isHasFixedBand: {
      type: Boolean,
      default: true
    },
    // F节点文本
    lastNodeText: {
      type: String | Number,
      default: '无销量'
    }
  },
  data() { 
    return {
      bandList: _.cloneDeep(this.value),
      inputXList: [],
      inputData: _.cloneDeep(this.value)
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.reRender()
      },
      deep: true
    },
    isInputType() {
      this.reRender()
    },
    bandWidth() {
      this.reRender()
    },
    lastNodeText(val) {
      this.oneDimensionalBand.removeLastBand()
      this.oneDimensionalBand.drawLastBand(val)
      this.layer.draw()
    }
  },
  beforeCreate() {
    this.levelNameArr = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'
    ]
  },
  mounted() {
    this.reRender()
  },
  methods: {
    initBand() {
      // 创建舞台
      const stage = new Konva.Stage({
        container: 'container',
        width: this.bandWidth + ((this.bandWidth / 100) * this.miniAccuracy + 2) + 200,
        height: 100,
        background: 'red'
      })
      // 创建层
      this.layer = new Konva.Layer()
      stage.add(this.layer)
      const bandData = {
        x: this.cPadding, // band 相对 canvas 画布的左边距
        y: (3 / 4) * stage.height(),
        cPadding: this.cPadding,
        bandWidth: this.bandWidth,
        maxLevel: this.maxLevel,
        miniAccuracy: this.miniAccuracy,
        bandData: this.bandList,
        dataItemColor: this.levelColorArr,
        isShowPercentText: this.isShowPercentText,
        isHasFixedBand: this.isHasFixedBand,
        isInputType: this.isInputType,
        lastNodeText: this.lastNodeText
      }
      this.oneDimensionalBand = new Odb.OneDimensionalBand(bandData)
      this.oneDimensionalBand.addToGroupOrLayer(this.layer, this.getInputXList)
      if (!this.isInputType) {
        this.oneDimensionalBand.addMouseEvent(stage, this.layer, this.emitData)
      }
      this.layer.draw()
    },
    emitData(val) {
      this.$emit('input', val)
    },
    handleBandLevelIncrease() {
      const nowBandLevel = this.bandList.length
      if (this.maxLevel <= nowBandLevel) {
        return
      }
      if (this.isInputType) {
        const newVal = +this.inputData[nowBandLevel - 1].value + 1
        this.inputData[nowBandLevel] = {
          name: this.levelNameArr[nowBandLevel],
          value: newVal
        }
        this.emitData(this.inputData)
      } else {
        const item = {
          name: this.levelNameArr[nowBandLevel],
          value: this.miniAccuracy
        }
        for (let i = nowBandLevel - 1; i >= 0; i -= 1) {
          if (this.bandList[i].value > this.miniAccuracy) {
            this.bandList[i].value = this.bandList[i].value - this.miniAccuracy
            this.bandList.push(item)
            this.emitData(this.bandList)
            return
          }
        }
      }
    },
    handleBandLevelReduce() {
      const nowBandLevel = this.bandList.length
      if (nowBandLevel <= 2) {
        return
      }
      if (this.isInputType) {
        this.inputData.length = nowBandLevel - 1
        this.emitData(this.inputData)
      } else {
        this.bandList[nowBandLevel - 2].value = 
          (+this.bandList[nowBandLevel - 2].value) + (+this.bandList[nowBandLevel - 1].value)
        this.bandList.length = nowBandLevel - 1
        this.emitData(this.bandList)
      }
    },
    getInputXList(val) {
      this.inputXList = val
    },
    handleInputChange(index) {
      this.emitData(this.inputData)
    },
    handleInputFocus(index) {
      this.$refs[`input-${index}`][0].className = 'input__inner'
    },
    handleInputBlur(index) {
      this.$refs[`input-${index}`][0].className = ''
    },
    reRender() {
      if (this.isInputType) {
        this.bandList = [
          { name: 'A', value: '20' },
          { name: 'B', value: '20' },
          { name: 'C', value: '20' },
          { name: 'D', value: '20' },
          { name: 'E', value: '20' }
        ]
        const len = this.value.length
        const num = 5 - len
        this.bandList.length = len
        this.bandList[len - 1].value = 
          +this.bandList[len - 1].value + 20 * num
        this.inputData = _.cloneDeep(this.value)
      } else {
        this.bandList = _.cloneDeep(this.value)
      }
      this.initBand()
    }
  }
    
}
</script>

<style lang="scss" scoped>
.one-dimensional-band {
  display: inline-block;
  position: relative;
}
#band-btn {
  position: absolute;
  height: 20px;
}
#btn-increase,
#btn-reduce {
  display: inline-block;
  margin-right: 10px;
  width: 20px;
  height: 20px;
  border: 1px solid black;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}
.band-input-group {
  input {
    position: absolute;
    padding: 0 5px;
    width: 80px;
    border-radius: 5px;
    border: 1px solid #333;
    text-align: center;
  }
}  
.input__inner:focus {
  outline: none;
  border-color: #3c6ef0;
}  
.lui-button {
  padding: 3px;
}
</style>
