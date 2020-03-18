export function OneDimensionalBand(option) {
  this._init(option)
}
  
OneDimensionalBand.prototype = {
  _init(option) {
    this.x = option.x || 15
    this.y = option.y || 45
    this.cPadding = option.cPadding || 15
    this.bandWidth = option.bandWidth || 600
    this.maxLevel = option.maxLevel || 5
    this.miniAccuracy = option.miniAccuracy || 5
    this.data = option.data || []
  
    const x0 = 0
    const y0 = 0
  
    // band所有元素的组
    this.group = new Konva.Group({
      x: this.x,
      y: this.y
    })
    // band节所有组
    this.miniLineGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.miniLineGroup)

    // 拖拽小节点所有组
    this.nodeGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.nodeGroup)

    // 水滴所有组 
    this.curveGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.curveGroup)
        
    // 水滴中文本所有组
    this.textGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.textGroup)

    // 整个band一共多少节
    const bandSectionNum = 100 / this.miniAccuracy
    // 每节band宽度
    const bandSectionWidth = (this.bandWidth + 2) / bandSectionNum - 2
    // 画出整个band
    for (let i = 0; i < bandSectionNum; i++) {
      const miniLine = new Konva.Line({
        points: [x0 + i * (bandSectionWidth + 2), y0, x0 + (i + 1) * (bandSectionWidth + 2) - 2, y0],
        strokeWidth: 5,
        stroke: '#fff'
      })
      this.miniLineGroup.add(miniLine)
    }
    const miniLineList = this.miniLineGroup.getChildren()
    let miniLineRenderColorNum = 0
    let miniLineRenderedColorNum = 0
    const self = this
    this.data.forEach((item, index) => {
      miniLineRenderColorNum = item.value / this.miniAccuracy
      // 给每节band上色
      for (let i = 0; i < miniLineList.length; i++) {
        if (
          i >= miniLineRenderedColorNum &&
            i < miniLineRenderColorNum + miniLineRenderedColorNum 
        ) {
          miniLineList[i].stroke(item.color)
        }
      }
      miniLineRenderedColorNum += item.value / this.miniAccuracy
      // 绘制拖拽小节点
      const rect = new Konva.Rect({
        x: x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 2,
        y: y0 - 7,
        width: 6,
        height: 10,
        stroke: item.color,
        strokeWidth: 1,
        fill: '#fff'
      })
      self.nodeGroup.add(rect)

      // 绘制水滴
      const curve = new Konva.Shape({
        x: x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 8,
        y: y0 - 32,
        sceneFunc(context) {
          context.beginPath()
          context.fillStyle = this.color
          context.arc(9, 9, 9, Math.PI, 0)
          context.moveTo(18, 9)
          context.quadraticCurveTo(18, 15, 9, 24)
          context.quadraticCurveTo(0, 15, 0, 9)
          context.fillShape(this)
        },
        fill: item.color
      })
      self.curveGroup.add(curve)  

      // 绘制下方文字
      const text = new Konva.Text({
        x: x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 9,
        y: y0 - 28,
        fontSize: 14,
        text: item.name,
        fill: '#fff',
        width: 20,
        align: 'center'
      })
      self.textGroup.add(text) 
    })

    // 绘制增加、减少band按钮
    const reduce = new Konva.Rect({
      x: this.bandWidth + 2 * this.cPadding,
      y: y0 - 15,
      width: 20,
      height: 20,
      fill: '#fff',
      stroke: '#d9d9d9',
      cornerRadius: 3
    })
    this.group.add(reduce)
    const reduceHorizontaLine = new Konva.Line({
      points: [
        this.bandWidth + 2 * this.cPadding + 4,
        y0 - 5,
        this.bandWidth + 2 * this.cPadding + 16, 
        y0 - 5
      ],
      strokeWidth: 2,
      stroke: '#939393'
    })
    this.group.add(reduceHorizontaLine)
    

    const increase = new Konva.Rect({
      x: this.bandWidth + 5 / 2 * this.cPadding + 20,
      y: y0 - 15,
      width: 20,
      height: 20,
      fill: '#fff',
      stroke: '#d9d9d9',
      cornerRadius: 3
    })
    this.group.add(increase) 
    const increaseHorizontaLine = new Konva.Line({
      points: [
        this.bandWidth + this.cPadding * 5 / 2 + 24,
        y0 - 5,
        this.bandWidth + this.cPadding * 5 / 2 + 36, 
        y0 - 5
      ],
      strokeWidth: 2,
      stroke: '#939393'
    })
    this.group.add(increaseHorizontaLine)
    const increaseVertical = new Konva.Line({
      points: [
        this.bandWidth + 2 * 3 / 2 * this.cPadding + 23,
        y0 - 10,
        this.bandWidth + 2 * 3 / 2 * this.cPadding + 23, 
        y0 + 1
      ],
      strokeWidth: 2,
      stroke: '#939393'
    })
    this.group.add(increaseVertical)
  },
  addToGroupOrLayer(arg) {
    arg.add(this.group)
  },
  getAllNode() {
    const self = this
    const nodeArray = []
    let nodeY = 0
    this.nodeGroup.getChildren().each((item, index) => {
      nodeArray.push(item.x() + self.x)
      nodeY = item.y() + self.y
    })
    return { nodeArray, nodeY }
  },
  nodeAnimateLeft(dragNodeIndex) {
    const self = this
    const nodeAnimate = (item) => {
      item.to({
        duration: 0.01,
        x: item.x() - (self.bandWidth + 2) * self.miniAccuracy / 100 - 2
      })
    }
    const node = [
      this.nodeGroup,
      this.curveGroup,
      this.textGroup
    ]
    for (let i = dragNodeIndex; i >= 0; i--) {
      if (this.data[i].value > this.miniAccuracy) {
        node.forEach((nodeGroup, index) => {
          nodeGroup.getChildren().each((item, index) => {
            if (index === i) {
              nodeAnimate(item)
            }   
          })
        }) 
        for (let index = dragNodeIndex; index >= i; index--) {
          if (this.data[index].value > this.miniAccuracy) {
            this.data[index].value = this.data[index].value - this.miniAccuracy
            // if (dragNodeIndex !== this.data.length - 1) {
            this.data[index + 1].value = (+this.data[index + 1].value) + (+this.miniAccuracy)
            // }
          }
        }
        return { nodeMoved: 1, dataList: this.data }
      }
    }
    return { nodeMoved: 0, dataList: this.data }
  },
  nodeAnimateRight(dragNodeIndex) {
    const self = this
    let dataAllPersent = 0
    this.data.forEach((item, index) => {
      dataAllPersent += +item.value
    })
    const nodeAnimate = (item) => {
      item.to({
        duration: 0.01,
        x: item.x() + (self.bandWidth + 2) * self.miniAccuracy / 100
      })
    }
    const node = [
      this.nodeGroup,
      this.curveGroup,
      this.textGroup
    ]
    for (let i = dragNodeIndex + 1; i < self.data.length; i++) {
      if (dataAllPersent === 100 &&
          +this.data[i].value > +this.miniAccuracy) {
        node.forEach((nodeGroup, index) => {
          nodeGroup.getChildren().each((item, index) => {
            if (index === i) {
              nodeAnimate(item)
            }   
          })
        })
        this.data[dragNodeIndex].value = Number(this.data[dragNodeIndex].value) + Number(this.miniAccuracy)
        this.data[i].value = this.data[i].value - this.miniAccuracy
        return { nodeMoved: 1, dataList: this.data }
      }
    }
    return { nodeMoved: 0, dataList: this.data }
  }
}
