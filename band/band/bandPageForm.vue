<template>
  <div class="band-page-form">
    <lui-card>
    <div slot="header" class="band-page-form-title prefix">
      <h1>
        {{ action === 'add' ? '新增' : '编辑'}}
        Band分级管理
      </h1>
    </div>
    <lui-form ref="form" :model="dto" label-width="160px" v-loading="loading">
      <lui-form-item label="事业部：">
        <lui-select 
          v-model="dto.deptNo"
          placeholder="请选择">
          <lui-option
            v-for="item in deptList"
            :key="item.deptNo"
            :label="item.deptName"
            :value="item.deptNo">
          </lui-option>
        </lui-select>
      </lui-form-item>
      <lui-form-item label="Band统计时间段：">
        参考近
        <lui-select 
          v-model="dto.periodDays"
          placeholder="请选择"
          class="time-range-select"
          @change="handlePeriodDaysChange">
          <lui-option
            v-for="item in enumList.periodDays"
            :key="item.code"
            :label="item.name"
            :value="+item.name">
          </lui-option>
        </lui-select>
        天历史销量
      </lui-form-item>
      <lui-form-item label="Band设置维度：">
        <lui-radio-group v-model="dto.bandWarehouseType">
          <lui-radio
            v-for="item in enumList.bandWarehouseType"
            :key="item.code"
            :label="+item.code">
            {{ item.name }}
          </lui-radio>
        </lui-radio-group>
      </lui-form-item>
      <lui-form-item label="Band划分维度：">
        <lui-radio-group 
          v-model="dto.bandDimention"
          @change="handleChangeBandDimention">
          <lui-radio
            v-for="item in enumList.bandDimention"
            :key="item.code"
            :label="+item.code">
            {{ item.name }}
          </lui-radio>
        </lui-radio-group>
      </lui-form-item>
      <!-- 一维band -->
      <lui-form-item
        v-if="!dto.bandDimention"
        label="" 
        class="band-type"
      >
        <lui-radio-group 
          v-model="dto.detailName" 
          @change="handleChangeOneDimensionType">
          <lui-radio
            v-for="item in enumList.bandType"
            :key="item.name"
            :label="item.code">
            {{ `${item.name}(${item.value.charAt(0)})` }}
          </lui-radio>
        </lui-radio-group>
      </lui-form-item>
      <!-- 二维band -->
      <lui-form-item v-else label="" class="band-type">
        <lui-checkbox-group 
          v-model="dto.detailNameList" 
          :min="1"
          :max="2"
          @change="handleChangeTwoDimensionType">
          <lui-checkbox
            v-for="item in enumList.bandType"
            :key="item.name"
            :label="item.code"
            :disabled="+detailQOrLDis===+item.code">
            {{ `${item.name}(${item.value.charAt(0)})` }}
          </lui-checkbox>
        </lui-checkbox-group>
      </lui-form-item>
      <div class="band">
        <!-- band组件 -->
        <!-- <transition name="lui-zoom-in-center"> -->
          <div v-if="!dto.bandDimention" :key="dto.detailName" class="one-dim-band">
            <one-dim-band
              v-model="oneDimensionBandData[bandTypeChoosedIndex]"
              :is-input-type="isInputType"
              :mini-accuracy="isInputType ? 20 : 5"
              :band-width="bandWidth"
              :last-node-text="
                !isInputType ? '无销量' : bandTypeChoosedIndex ? '+∞' : dto.periodDays
              "
            />
          </div>
        <!-- </transition> -->
        <!-- 二维band组件 -->
        <!-- <transition name="lui-zoom-in-center"> -->
          <div v-if="dto.bandDimention" class="two-dim-band">
            <two-dim-band
              v-model="twoDimensionBandData"
              :get-value-x-y="getValueXY"
              :band-style="twoDimensionBandStyle"
            />
          </div>
        <!-- </transition> -->
      </div>
      <lui-form-item label="设置维度详情展示：">
        <div class="table-view">
          <lui-table
            :data="
              !dto.bandDimention ? tableBandData : twoDimensionTableBandData
            "
            :span-method="objectSpanMethod"
            border
          >
          <!-- <lui-table
            :data="
              !dto.bandDimention ? tableBandData : twoDimensionTableBandData
            "
            border
          > -->
            <lui-table-column
              v-for="item in tabaleBandHead"
              :key="item.key"
              :prop="item.key"
              :label="item.name"
              align="center">
            </lui-table-column>
          </lui-table>
        </div>
      </lui-form-item>
      <lui-form-item label="更新频率：">
        <lui-radio-group v-model="dto.updateType">
          <lui-radio
            v-for="item in enumList.bandUpdateType"
            :key="item.code"
            :label="+item.code">
            {{ item.name }}
          </lui-radio>
        </lui-radio-group>
        <div class="updata-week-tip">
          默认每周一
        </div>
        <div class="updata-month-tip">
          默认每月一号
        </div>
      </lui-form-item>
      <lui-form-item label="生效时间：">
        <lui-radio-group v-model="dto.enableType">
          <lui-radio
            v-for="item in enumList.bandEnableType"
            :key="item.code"
            :label="+item.code">
            {{ item.name }}
          </lui-radio>
        </lui-radio-group>
      </lui-form-item>
    </lui-form>
    <div class="footer">
        <lui-button @click="handleCancel">取消</lui-button>
        <lui-button
          v-if="!dto.bandStatus"
          type="primary" 
          @click="handleOk(0)"
        >
          草稿
        </lui-button>
        <lui-button type="primary" @click="handleOk(1)">提交</lui-button>
    </div>
    </lui-card>
  </div>
</template>

<script>
export default {
  name: 'bandPageForm',
  components: {
    OneDimBand: () => import('./oneDimension/index.vue'),
    TwoDimBand: () => import('./twoDimendion/index.vue')
  },
  mixins: [ 
    // PageList 
  ],
  props: {
    // add | edit
    action: {
      type: String,
      default: 'add'
    },
    entity: {
      type: Object,
      default() {
        return {}
      }
    },
    handleSave: {
      type: Function,
      default: () => {}
    },
    handleCancel: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    this.allFieldKeys = this.getFieldKeys(this.allFields)
    return {
      dto: this.toFront(),
      id: '',
      bandTypeChoosedIndex: 0,
      isInputType: true,
      bandWidth: 0,
      oneDimensionBandData: [],
      tableBandData: [],
      twoDimensionTableBandData: [],
      tabaleBandHead: [
        { key: 'name', name: 'Band'},
        { key: 'value', name: '动销天数(M)'}
      ],
      deptList: [],
      loading: true,
      enumList: {},
      needMergeArr: ['bandName'],
      rowMergeArrs: [],
      twoDimensionBandData: _.cloneDeep(this.twoDimensionBandDataDefault),
      valXList: [5, 10, 15, 20, 25, 30],
      valYList: [10, 20, 30, 40, 50, '+∞'],
      twoDimensionBandStyle: [
        { name: '动销天数', csyType: 0, maxLevel: 6 },
        { name: '价格带(元)', csyType: 0, maxLevel: 6 }
      ],
      detailQOrLDis: -1,
      // twoDimensionEditFirst: false
    }
  },
  watch: {
    entity() {
      this.dto = this.toFront()
      if (this.entity.bandDimention) {
        
        this.sortTwoDimensionBandData(this.entity.bandData)
        this.getDefaultvalXYList(true)
        this.getTwoDimensionTableData()
      }
    },
    oneDimensionBandData: {
      handler(newVal, oldVal) {
        this.bandDataTransformTableBandData()
      },
      deep: true
    },
    twoDimensionBandData: {
      handler(newVal, oldVal) {
        this.getTabaleBandHead(this.dto.bandDimention)
        this.getTwoDimensionBandParams(this.dto.detailNameList)
        this.getTwoDimensionTableData()
      },
      deep: true
    }
  },
  beforeCreate() {
    this.allFields = [
      'id',
      'deptNo',
      {
        key: 'periodDays',
        default: 30
      },
      {
        key: 'bandWarehouseType',
        default: 0
      },
      {
        key: 'bandDimention',
        default: 0
      },
      {
        key: 'detailName',
        default: 0
      },
      {
        key: 'detailNameList',
        default: [0, 1]
      },
      {
        key: 'bandData',
        default: []
      },
      {
        key: 'updateType',
        default: 1
      },
      {
        key: 'enableType',
        default: 0
      },
      {
        key: 'bandStatus',
        default: 0
      }
    ]
    this.twoDimensionBandDataDefault = [
      { detailName: 'M1P1', bandName: 'A', valueX: 5, valueY: 5 },
      { detailName: 'M2P1', bandName: 'B', valueX: 10, valueY: 5 },
      { detailName: 'M3P1', bandName: 'C', valueX: 15, valueY: 5 },
      { detailName: 'M4P1', bandName: 'D', valueX: 20, valueY: 5 },
      { detailName: 'M5P1', bandName: 'E', valueX: 25, valueY: 5 },
      { detailName: 'M6P1', bandName: 'F', valueX: 30, valueY: 5 },
      { detailName: 'M1P2', bandName: 'B', valueX: 5, valueY: 10 },
      { detailName: 'M2P2', bandName: 'B', valueX: 10, valueY: 10 },
      { detailName: 'M3P2', bandName: 'C', valueX: 15, valueY: 10 },
      { detailName: 'M4P2', bandName: 'D', valueX: 20, valueY: 10 },
      { detailName: 'M5P2', bandName: 'E', valueX: 25, valueY: 10 },
      { detailName: 'M6P2', bandName: 'F', valueX: 30, valueY: 10 },
      { detailName: 'M1P3', bandName: 'C', valueX: 5, valueY: 15 },
      { detailName: 'M2P3', bandName: 'C', valueX: 10, valueY: 15 },
      { detailName: 'M3P3', bandName: 'C', valueX: 15, valueY: 15 },
      { detailName: 'M4P3', bandName: 'D', valueX: 20, valueY: 15 },
      { detailName: 'M5P3', bandName: 'E', valueX: 25, valueY: 15 },
      { detailName: 'M6P3', bandName: 'F', valueX: 30, valueY: 15 },
      { detailName: 'M1P4', bandName: 'D', valueX: 5, valueY: 20 },
      { detailName: 'M2P4', bandName: 'D', valueX: 10, valueY: 20 },
      { detailName: 'M3P4', bandName: 'D', valueX: 15, valueY: 20 },
      { detailName: 'M4P4', bandName: 'D', valueX: 20, valueY: 20 },
      { detailName: 'M5P4', bandName: 'E', valueX: 25, valueY: 20 },
      { detailName: 'M6P4', bandName: 'F', valueX: 30, valueY: 20 },
      { detailName: 'M1P5', bandName: 'E', valueX: 5, valueY: 25 },
      { detailName: 'M2P5', bandName: 'E', valueX: 10, valueY: 25 },
      { detailName: 'M3P5', bandName: 'E', valueX: 15, valueY: 25 },
      { detailName: 'M4P5', bandName: 'E', valueX: 20, valueY: 25 },
      { detailName: 'M5P5', bandName: 'E', valueX: 25, valueY: 25 },
      { detailName: 'M6P5', bandName: 'F', valueX: 30, valueY: 25 },
      { detailName: 'M1P6', bandName: 'F', valueX: 5, valueY: 30 },
      { detailName: 'M2P6', bandName: 'F', valueX: 10, valueY: 30 },
      { detailName: 'M3P6', bandName: 'F', valueX: 15, valueY: 30 },
      { detailName: 'M4P6', bandName: 'F', valueX: 20, valueY: 30 },
      { detailName: 'M5P6', bandName: 'F', valueX: 25, valueY: 30 },
      { detailName: 'M6P6', bandName: 'F', valueX: 30, valueY: 30 }
    ]
    this.twoDimensionBandStyleList = [
      { name: '动销天数', csyType: 0, maxLevel: 6 },
      { name: '价格带(元)', csyType: 0, maxLevel: 6 },
      { name: '销售占比(%)', csyType: 1, maxLevel: 6 },
      { name: '销售金额占比(%)', csyType: 1, maxLevel: 6 },
      { name: '订单行占比(%)', csyType: 1, maxLevel: 6 },
      { name: '日均销售件数', csyType: 0, maxLevel: 6 },
      { name: '日均订单行数', csyType: 0, maxLevel: 6 },
      { name: '销售波动', csyType: 0, maxLevel: 6 },
    ], 
    this.bandLevelList = [
      { code: 'A' },
      { code: 'B' },
      { code: 'C' },
      { code: 'D' },
      { code: 'E' },
      { code: 'F' },
      { code: '空' }
    ]
    this.disFields = []
    this.inputCodeList = [ 0, 1, 5, 6, 7 ]
    this.bandTypeList = [ 0, 1, 2, 3, 4, 5, 6, 7 ]
  },
  mounted() {
    this.getDefaultBandData()
    this.queryEnumList()
    this.queryTaskAndDept()
    this.bandWidth = (56 / 100) * document.body.clientWidth
    window.addEventListener('resize', () => {
      this.bandWidth = (56 / 100) * document.body.clientWidth
      if (this.bandWidth < 600) {
        this.bandWidth = 600
      }
    }, false)
  },
  methods: {
    getFieldKeys(fields = []) {
      const keys = []
      for (let i = 0, len = fields.length; i < len; i += 1) {
        if (_.isObject(fields[i])) {
          keys[i] = fields[i].key
        } else {
          keys[i] = fields[i]
        }
      }
      return keys
    },
    getDefaultDto() {
      const fields = this.allFields || []
      const dto = {}
      for (let i = 0, len = fields.length; i < len; i += 1) {
        if (_.isObject(fields[i])) {
          dto[fields[i].key] = fields[i].default
        } else {
          dto[fields[i]] = undefined
        }
      }
      return dto
    },
    toFront() {
      const afterData = {
        ...this.getDefaultDto(),
        ..._.cloneDeep(this.entity)
      }
      this.loading = false
      if (
        !this.entity.bandDimention &&
        this.action === 'edit' && 
        this.entity.detailName !== undefined
      ) {
        this.bandTypeChoosedIndex = +this.entity.detailName
        this.isInputType = this.inputCodeList.includes(+this.entity.detailName) ? true : false
        this.oneDimensionBandData[+this.entity.detailName] = _.cloneDeep(this.entity.bandData)
        this.bandDataTransformTableBandData('editFirst')
      }
      if (this.enumList && this.enumList.length) {
        this.getTabaleBandHead()
      }
      return afterData
    },
    toEnd() {
      const bandPageData = _.pick(this.dto, this.allFieldKeys)
      this.deptList.forEach((item, index) => {
        if (item.deptNo === bandPageData.deptNo) {
          bandPageData.deptName = item.deptName
        }
      })
      if (!this.dto.bandDimention) {
        const bandData = _.cloneDeep(this.oneDimensionBandData[this.bandTypeChoosedIndex])
        if (!this.isInputType) {
          bandData.forEach((item, index) => {
            if (index) {
              bandData[index].value =  +bandData[index - 1].value + (+item.value)
            }
          })
        }
        bandPageData.bandData = _.cloneDeep(bandData)
        bandPageData.bandData.push(this.tableBandData[this.tableBandData.length - 1])
      } else {
        for (let i = 0; i < this.twoDimensionBandData.length; i += 1) {
          if (this.twoDimensionBandData[i].bandName === '空') {
            this.$message({
              message: '二维band设置不能存在空值，请返回设置band',
              type: 'warning'
            })
            return false
          }
        }
        bandPageData.valXList = this.valXList
        bandPageData.valYList = this.valYList
        bandPageData.bandData = _.cloneDeep(this.twoDimensionBandData)
      }
      jt.removeNullProperty(bandPageData)
      return bandPageData
    },
    handleOk(val) {
      if (!this.$refs.form) {
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        const params = this.toEnd()
        if (!params) {
          return
        }
        this.loading = true
        const updataLoading = () => {
          this.loading = false
        }
        this.handleSave({ params, action: this.action, type: val, updataLoading })
      })
    },
    getDefaultBandData() {
      this.bandTypeList.forEach((item, index) => {
        if (this.inputCodeList.includes(item)) {
          this.oneDimensionBandData[index] = [
            { name: 'A', value: '5' },
            { name: 'B', value: '10' },
            { name: 'C', value: '15' },
            { name: 'D', value: '20' },
            { name: 'E', value: '25' }
          ]
        } else {
          this.oneDimensionBandData[index] = [
            { name: 'A', value: '20' },
            { name: 'B', value: '20' },
            { name: 'C', value: '20' },
            { name: 'D', value: '20' },
            { name: 'E', value: '20' }
          ]
        }
      })
      if (this.action === 'add') {
        this.loading = false
        this.bandDataTransformTableBandData()
      }
    },
    handleChangeOneDimensionType(val) {
      this.enumList.bandType.forEach((item, index) => {
        if (val === item.code) {
          this.bandTypeChoosedIndex = index
          if (item.type) {
            this.isInputType = false
            this.getPercentTableBandData(this.oneDimensionBandData[index])
          } else {
            this.isInputType = true
            this.getAbsoluteTableBandData(this.oneDimensionBandData[index])
          }
        }
      })
      this.rowMergeArrs = jt.rowMergeHandle(this.needMergeArr, this.tableBandData)
      this.getTabaleBandHead()
    },
    getTabaleBandHead(val = this.dto.bandDimention) {
      if (!val) {
        const tabaleBandHeadItemName = jt.selectItem(this.enumList.bandType, +this.dto.detailName)
        const tabaleBandHeadItemCode = jt.selectItem(this.enumList.bandType, +this.dto.detailName, 'code', 'value')
        this.tabaleBandHead = [
          { key: 'name', name: 'Band'},
          { key: 'value', name: `${tabaleBandHeadItemName}(${tabaleBandHeadItemCode.charAt(0)})`}
        ]
      } else {
        if (!this.enumList.bandType || !this.enumList.bandType.length) {
          return
        }
        const tabaleBandHeadItemNameX = jt.selectItem(this.enumList.bandType, +this.dto.detailNameList[0])
        const tabaleBandHeadItemCodeX = jt.selectItem(this.enumList.bandType, +this.dto.detailNameList[0], 'code', 'value')
        const tabaleBandHeadItemNameY = jt.selectItem(this.enumList.bandType, +this.dto.detailNameList[1])
        const tabaleBandHeadItemCodeY = jt.selectItem(this.enumList.bandType, +this.dto.detailNameList[1], 'code', 'value')
        this.tabaleBandHead = [
          { key: 'bandName', name: 'Band'},
          { key: 'detailName', name: '细分Band'},
          { key: 'valueX', name: `${tabaleBandHeadItemNameX}(${tabaleBandHeadItemCodeX.charAt(0)})`},
          { key: 'valueY', name: `${tabaleBandHeadItemNameY}(${tabaleBandHeadItemCodeY.charAt(0)})`}
        ]
      }
      
    },
    getPercentTableBandData(val) {
      const tableBandData = []
      const valList = []
      val.forEach((item, index) => {
        if (!index) {
          valList.push(+item.value)
          tableBandData.push({
            name: item.name,
            value: `0% ~ ${item.value}%`
          })
        } else {
          valList.push(+item.value + (+valList[index - 1]))
          tableBandData.push({
            name: item.name,
            value: `${valList[index - 1]}% ~ ${(+valList[index - 1]) + (+item.value)}%`
          })
        }
      })
      tableBandData.push({
        name: 'F',
        value: `无销量`
      })
      this.tableBandData = tableBandData
    },
    getAbsoluteTableBandData(val, time) {
      const tableBandData = []
      const valList = []
      val.forEach((item, index) => {
        if (!index) {
          valList.push(+item.value)
          tableBandData.push({
            name: item.name,
            value: `0 ~ ${item.value}`
          })
        } else {
          valList.push(+item.value + (+valList[index - 1]))
          tableBandData.push({
            name: item.name,
            value: `${val[index - 1].value} ~ ${(+item.value)}`
          })
        }
      })
      let fVal = null
      if (this.action === 'edit' && time === 'editFirst') {
        fVal = !this.bandTypeChoosedIndex ? `${this.entity.periodDays}` : '+∞'
      } else {
        fVal = !this.bandTypeChoosedIndex ? `${this.dto.periodDays}` : '+∞'
      }
      tableBandData.push({
        name: 'F',
        value: `${val[val.length - 1].value} ~ ${fVal}`
      })
      this.tableBandData = tableBandData
    },
    bandDataTransformTableBandData(time) {
      if (this.isInputType) {
        this.getAbsoluteTableBandData(this.oneDimensionBandData[this.bandTypeChoosedIndex], time)
      } else {
        this.getPercentTableBandData(this.oneDimensionBandData[this.bandTypeChoosedIndex])
      }
      this.rowMergeArrs = jt.rowMergeHandle(this.needMergeArr, this.tableBandData)
    },
    handlePeriodDaysChange(val) {
      if (!this.bandTypeChoosedIndex) {
        this.bandDataTransformTableBandData()
      }
      if (this.dto.bandDimention && this.dto.detailNameList.includes(0)) {
        const twoDimensionBandData = _.cloneDeep(this.twoDimensionBandData)
        if (!this.dto.detailNameList[0]) {
          this.twoDimensionBandData.forEach((item, index) => {
            if (+item.detailName.charAt(1) === this.valXList.length) {
              twoDimensionBandData[index].valueX = val
            }
          })
          this.valXList[this.valXList.length - 1] = val
        }
        if (!this.dto.detailNameList[1]) {
          this.twoDimensionBandData.forEach((item, index) => {
            if (+item.detailName.charAt(3) === this.valYList.length) {
              twoDimensionBandData[index].valueY = val
            }
          })
          this.valYList[this.valYList.length - 1] = val
        }
        this.twoDimensionBandData = twoDimensionBandData
      }
    },
    PeriodDaysChangeGetwoDimensionData() {
      
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'bandName') {
        const _row = this.rowMergeArrs['bandName'].rowArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return [ _row, _col]
      }
    },
    // 事业部下拉列表
    queryTaskAndDept() {
      api.band.getTaskAndDeptList().then((res) => {
        if (res.success) {
          this.deptList = _.get(res, 'data') || []
          if (this.action === 'add') {
            this.dto.deptNo = this.deptList[0].deptNo
          }
        }
      })
    },
    // 查询枚举数据
    queryEnumList() {
      api.band.enums().then((res) => {
        if (res.success) {
          this.enumList = _.get(res.data, 'bandEnumListCoList') || []
          const item = this.enumList.bandUpdateType.shift()
          this.enumList.bandUpdateType.push(item)
          if (this.action === 'edit') {
            this.getTabaleBandHead(this.entity.bandDimention)
          }
        }
      })
    },
    handleChangeBandDimention(val) {
      this.getTabaleBandHead()
      if (val) {
        this.getTwoDimensionBandParams(this.dto.detailNameList)
        this.getTwoDimensionBandDataDefault()
        this.getTwoDimensionTableData()
      } else {
        this.bandDataTransformTableBandData()
      }
    },
    getTwoDimensionBandDataDefault() {
      const twoDimensionBandData = _.cloneDeep(this.twoDimensionBandDataDefault)
      let lastItemX = '+∞'
      let lastItemY = '+∞'
      if (!this.dto.detailNameList[0]) {
        lastItemX = this.dto.periodDays
      } else if ([2, 3, 4].includes(+this.dto.detailNameList[0])) {
        lastItemX = '无销量'
      }
      if (!this.dto.detailNameList[1]) {
        lastItemY = this.dto.periodDays
      } else if ([2, 3, 4].includes(+this.dto.detailNameList[1])) {
        lastItemY= '无销量'
      }
      // 更改detailName
      const codeX = jt.selectItem(this.enumList.bandType, +this.dto.detailNameList[0], 'code', 'value').charAt(0)
      const codeY = jt.selectItem(this.enumList.bandType, +this.dto.detailNameList[1], 'code', 'value').charAt(0)
      twoDimensionBandData.forEach((item, index) => {
        if (index % this.valXList.length === this.valXList.length - 1) {
          item.valueX = lastItemX
        }
        if (parseInt(index / this.valXList.length) === this.valYList.length - 1) {
          item.valueY = lastItemY
        }
        if (lastItemX === '无销量') {
          if (!((index + 2) % this.valXList.length)) {
            item.valueX = 100
          }
        }
        if (lastItemY === '无销量') {
          if (parseInt(index / this.valXList.length) === this.valYList.length - 2) {
            item.valueY = 100
          }
        }
        item.detailName = `${codeX}${index % this.valXList.length + 1}${codeY}${parseInt(index / this.valXList.length) + 1}`
      })
      this.twoDimensionBandData = _.cloneDeep(twoDimensionBandData)
    },
    getTwoDimensionBandParams(val) {
      this.twoDimensionBandStyle = [
        this.twoDimensionBandStyleList[+val[0]],
        this.twoDimensionBandStyleList[+val[1]]
      ]
    },
    getValueXY(valXList, valYList) {
      this.valXList = valXList
      this.valYList = valYList
    },
    getTwoDimensionTableData(val) {
      const twoDimensionTableBandData = {}
      this.bandLevelList.forEach((item, index) => {
        twoDimensionTableBandData[item. code] = []
      })
      this.twoDimensionBandData.forEach((item, index) => {
        const tableItem = {
          bandName: item.bandName,
          detailName: item.detailName
        }
        // x轴为绝对值的情况
        if (!this.twoDimensionBandStyle[0].csyType) {
          tableItem.valueX = 
            !(index % this.valXList.length) ? `0 ~ ${this.valXList[0]}` :
              `${this.valXList[index % this.valXList.length - 1]} ~ ${this.valXList[index % this.valXList.length]}`
          // this.valXList[this.valXList.length - 1] = this.dto.detailName ? '+∞' : this.dto.periodDays
        } else {
          tableItem.valueX = 
            !(index % this.valXList.length) ? `0% ~ ${this.valXList[0]}%` :
              (index % this.valXList.length) === this.valXList.length - 1 ?
                '无销量' :
                `${this.valXList[index % this.valXList.length - 1]}% ~ ${this.valXList[index % this.valXList.length]}%`
          // this.valXList[this.valXList.length - 1] = this.dto.periodDays
        }
        const rowIndex = parseInt(index / this.valXList.length)
        if (!this.twoDimensionBandStyle[1].csyType) {
          tableItem.valueY = 
            !rowIndex ? `0 ~ ${item.valueY}` : 
              `${this.valYList[rowIndex - 1]} ~ ${this.valYList[rowIndex]}`
        } else {
          tableItem.valueY = 
            !rowIndex ? `0% ~ ${item.valueY}%` : 
              rowIndex === this.valYList.length - 1 ?
              '无销量' :
              `${this.valYList[rowIndex - 1]}% ~ ${this.valYList[rowIndex]}%`
        }
        this.bandLevelList.forEach((name, i) => {
          if (item.bandName === name.code) {
            twoDimensionTableBandData[item.bandName].push(tableItem)
          }
        })
      })
      this.twoDimensionTableBandData = []
      Object.keys(twoDimensionTableBandData).forEach((item, index) => {
        this.twoDimensionTableBandData.push(...twoDimensionTableBandData[item])
      })
      this.rowMergeArrs = jt.rowMergeHandle(this.needMergeArr, this.twoDimensionTableBandData)
    },
    sortTwoDimensionBandData(val) {
      const twoDimensionBandData = []
      val.forEach((item, index) => {
        if (!twoDimensionBandData[item.detailName.charAt(3) - 1]) {
          twoDimensionBandData[item.detailName.charAt(3) - 1] = []
        }
        twoDimensionBandData[item.detailName.charAt(3) - 1][item.detailName.charAt(1) - 1] = item
      })
      this.twoDimensionBandData = []
      twoDimensionBandData.forEach((item, index) => {
        this.twoDimensionBandData.push(...item)
      })
    },
    getDefaultvalXYList (editFirst) {
      // 更新this.valXList, this.valYList
      if (editFirst) {
        this.valXList = []
        this.valYList = []
        this.entity.bandData.forEach((item, index) => {
          this.valXList[item.detailName.charAt(1) - 1] = item.valueX
          this.valYList[item.detailName.charAt(3) - 1] = item.valueY
        })
      } else {
        this.valXList = [5, 10, 15, 20, 25, 30]
        this.valYList = [10, 20, 30, 40, 50, '+∞']
        if (!this.twoDimensionBandStyle[0].csyType) {
          this.valXList[this.valXList.length - 2] = 25
          this.valXList[this.valXList.length - 1] = this.dto.detailNameList[0] ? '+∞' : this.dto.periodDays
        } else {
          this.valXList[this.valXList.length - 2] = 100
          this.valXList[this.valXList.length - 1] = '无销量'
        }
        if (!this.twoDimensionBandStyle[1].csyType) {
          this.valYList[this.valYList.length - 2] = 25
          this.valYList[this.valYList.length - 1] = this.dto.detailNameList[1] ? '+∞' : this.dto.periodDays
        } else {
          this.valYList[this.valYList.length - 2] = 100
          this.valYList[this.valYList.length - 1] = '无销量'
        }
      }
    },
    handleChangeTwoDimensionType(val) {
      if (val.length === 2) {
        this.getTwoDimensionBandParams(val)
        this.getDefaultvalXYList()
        this.getTwoDimensionBandDataDefault()
        this.getTabaleBandHead()
        this.getTwoDimensionTableData()
      } else {
        if (+this.dto.detailNameList[0] === 2) {
          this.detailQOrLDis = 5
        } else if (+this.dto.detailNameList[0] === 4) {
          this.detailQOrLDis = 6
        } else if (+this.dto.detailNameList[0] === 5) {
          this.detailQOrLDis = 2
        } else if (+this.dto.detailNameList[0] === 6) {
          this.detailQOrLDis = 4
        } else {
          this.detailQOrLDis = -1
        }
         
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.band-page-form-title {
  position: relative;
  margin: 6px;
  font-size: 16px;
  font-weight: 700;
}
.band-page-form {
  .time-range-select {
    width: 90px;
  }
  .table-view {
    display: inline-block;
    padding-top: 38px;
    width: 600px;
  }
  .band-type {
    margin-bottom: 0;
    .lui-radio {
      margin-bottom: 24px;
    }
  }
  .one-dim-band {
    padding-left: 160px;
  }
  .lui-radio {
    margin-right: 42px;
  }
  .updata-week-tip {
    position: absolute;
    font-size: 12px;
    left: 80px;
    top: 21px;
    color: #ccc;
  }
  .updata-month-tip {
    position: absolute;
    font-size: 12px;
    left: 164px;
    top: 21px;
    color: #ccc;
  }
  .footer {
    padding: 24px;
    text-align: center;
  }
  ::v-deep .lui-form-item__content {
    margin-left: 172px!important;
  }
  .two-dim-band {
    margin-top: -24px;
    padding-left: 164px;
  }
}
</style>
