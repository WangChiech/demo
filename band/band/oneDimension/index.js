function OneDimensionalBand(option) {
  this.initData(option)
  this.drawBandLine()
  this.drawBandNode()
  if (this.isHasFixedBand) {
    this.drawLastBand()
  }
}
    
OneDimensionalBand.prototype = {
  initData(option) {
    this.x = option.x || 15
    this.y = option.y || 45
    this.cPadding = option.cPadding || 15
    this.bandWidth = option.bandWidth || 600
    this.maxLevel = option.maxLevel || 5
    this.miniAccuracy = option.miniAccuracy || 5
    this.bandData = option.bandData || []
    this.dataItemColor = option.dataItemColor || []
    this.isShowPercentText = option.isShowPercentText || false
    this.isHasFixedBand = option.isHasFixedBand || false
    this.isInputType = option.isInputType || false
    this.lastNodeText = option.lastNodeText || '无销量'
    // this.lastNodeName = option.lastNodeName || 'F'
  
    this.nodeXToInputList = []
    this.x0 = 0
    this.y0 = 0
    this.dragNodeIndex = -1
  
    // band所有元素的组
    this.group = new Konva.Group({
      x: this.x,
      y: this.y
    })
        
    // band F
    this.lastBandGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.lastBandGroup)

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

    this.rectCursorGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.rectCursorGroup)
  },
  drawBandLine() {
    // 整个band一共多少节
    const bandSectionNum = 100 / this.miniAccuracy
    // 每节band宽度
    const bandSectionWidth = ((this.bandWidth + 2) / bandSectionNum) - 2
    // 画出整个band
    for (let i = 0; i < bandSectionNum; i += 1) {
      const miniLine = new Konva.Line({
        points: 
          [
            this.x0 + i * (bandSectionWidth + 2), 
            this.y0, 
            this.x0 + (i + 1) * (bandSectionWidth + 2) - 2, 
            this.y0
          ],
        strokeWidth: 5
      })
      this.miniLineGroup.add(miniLine)
    }
    const miniLineList = this.miniLineGroup.getChildren()
    let miniLineRenderColorNum = 0
    let miniLineRenderedColorNum = 0
    const self = this
    this.bandData.forEach((item, index) => {
      miniLineRenderColorNum = item.value / this.miniAccuracy
      // 给每节band上色
      for (let i = miniLineRenderColorNum; i > 0; i -= 1) {
        if (miniLineList[miniLineRenderedColorNum]) {
          miniLineList[miniLineRenderedColorNum].stroke(self.dataItemColor[item.name])
          miniLineRenderedColorNum += 1
        }
        
      }
    })
  },
  drawBandNode() {
    // 整个band一共多少节
    const bandSectionNum = 100 / this.miniAccuracy
    // 每节band宽度
    const bandSectionWidth = (this.bandWidth + 2) / bandSectionNum - 2
    let miniLineRenderedColorNum = 0
    const self = this
    let valText = +self.bandData[0].value
    this.bandData.forEach((item, index) => {
      miniLineRenderedColorNum += item.value / self.miniAccuracy
      // 绘制拖拽小节点
      const x = self.x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 2
      const rect = new Konva.Rect({
        x: self.dragNodeIndex === index ? x - 1 : x,
        y: self.y0 - 7,
        width: self.dragNodeIndex === index ? 10 : 6,
        height: self.dragNodeIndex === index ? 12 : 10,
        stroke: self.dataItemColor[item.name],
        strokeWidth: self.dragNodeIndex === index ? 3 : 1,
        fill: '#fff'
      })
      self.nodeGroup.add(rect)
  
      // 绘制水滴
      const curve = new Konva.Shape({
        x: self.x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 8,
        y: self.y0 - 32,
        sceneFunc(context) {
          context.beginPath()
          context.arc(9, 9, 9, Math.PI, 0)
          context.moveTo(18, 9)
          context.quadraticCurveTo(18, 15, 9, 24)
          context.quadraticCurveTo(0, 15, 0, 9)
          context.fillShape(this)
        },
        fill: self.dataItemColor[item.name]
      })
      self.curveGroup.add(curve) 
  
      // 绘制下方文字
      const text = new Konva.Text({
        x: self.x0 + (miniLineRenderedColorNum * (bandSectionWidth + 2)) - 9,
        y: self.y0 - 28,
        fontSize: 14,
        text: item.name,
        fill: '#fff',
        width: 20,
        align: 'center'
      })
      self.textGroup.add(text) 
      if (this.isInputType) {
        this.nodeXToInputList.push(self.x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 2)
        return
      }
      // cursor事件
      const rectCursor = new Konva.Rect({
        x: self.x0 + miniLineRenderedColorNum * (bandSectionWidth + 2) - 12,
        y: self.y0 - 32,
        width: 24,
        height: 31,
        strokeWidth: 1
      })
      self.rectCursorGroup.add(rectCursor) 
      self.addCursor(rectCursor, rect)

      // 绘制对应百分比
      if (this.isShowPercentText && !this.isInputType) {
        const valueText = new Konva.Text({
          x: self.x0 + (miniLineRenderedColorNum * (bandSectionWidth + 2)) - 9,
          y: self.y0 - 50,
          fontSize: 14,
          text: `${valText}%`,
          fill: '#333333',
          align: 'center'
        })
        self.textGroup.add(valueText) 
        if (index < this.bandData.length - 1) {
          valText += (+self.bandData[index + 1].value)
        }
      }
    })
  },
  drawLastBand(val) {
    const bandSectionWidth = 100
    const miniLine = new Konva.Line({
      points: 
        [
          this.bandWidth + 2, 
          this.y0, 
          (this.bandWidth + 2) + bandSectionWidth, 
          this.y0
        ],
      strokeWidth: 5,
      stroke: '#ccc'
    })
    this.lastBandGroup.add(miniLine)
    
    // 绘制拖拽小节点
    const rect = new Konva.Rect({
      x: this.bandWidth + 2 + bandSectionWidth - 2,
      y: this.y0 - 7,
      width: 6,
      height: 10,
      stroke: '#ccc',
      strokeWidth: 1,
      fill: '#fff'
    })
    this.lastBandGroup.add(rect)

    // 绘制水滴
    const curve = new Konva.Shape({
      x: this.bandWidth + 2 + bandSectionWidth - 8,
      y: this.y0 - 32,
      sceneFunc(context) {
        context.beginPath()
        context.arc(9, 9, 9, Math.PI, 0)
        context.moveTo(18, 9)
        context.quadraticCurveTo(18, 15, 9, 24)
        context.quadraticCurveTo(0, 15, 0, 9)
        context.fillShape(this)
      },
      fill: '#ccc'
    })
    this.lastBandGroup.add(curve)  

    // 绘制下方文字
    const text = new Konva.Text({
      x: this.bandWidth + bandSectionWidth - 7,
      y: this.y0 - 28,
      fontSize: 14,
      text: 'F',
      fill: '#fff',
      width: 20,
      align: 'center'
    })
    this.lastBandGroup.add(text)

    // 绘制无销量
    const valueText = new Konva.Text({
      x: this.bandWidth + bandSectionWidth / 2,
      y: this.isInputType ? this.y0 - 60 : this.y0 - 50,
      fontSize: this.lastNodeText === '+∞' ? 24 : 14,
      text: val ? val : this.lastNodeText,
      // text: this.isInputType ? '+∞' : '无销量',
      fill: '#333333',
      width: bandSectionWidth,
      align: 'center'
    })
    this.lastBandGroup.add(valueText) 
  },
  removeBandLine(layer) {
    this.miniLineGroup.destroyChildren()
  },
  removeBandNode(layer) {
    this.nodeGroup.destroyChildren()
    this.curveGroup.destroyChildren()
    this.textGroup.destroyChildren()
  },
  removeLastBand() {
    this.lastBandGroup.destroyChildren()
  },
  addMouseEvent(stage, layer, emitData) {
    let startX = 0, // 鼠标拖拽起始点坐标
      nodeArr = [],
      nodeY = 0,
      // 拖拽的是第几个band
      dragNodeIndex = -1
    const miniLineWidth = ((this.bandWidth + 2) * this.miniAccuracy) / 100
    const self = this

    stage.on('contentMousedown', (e) => {
      const mouseX = e.evt.layerX
      const mouseY = e.evt.layerY
      const node = this.getAllNode()
      nodeArr = node.nodeArray
      nodeY = node.nodeY
      if (
        mouseY > (nodeY - 26) &&
        mouseY < (nodeY + 3)
      ) {
        nodeArr.forEach((item, index) => {
          if (mouseX > item - 12 && mouseX < item + 15) { // 2-8
            if (nodeArr.length - 1 === index) {
              return
            }
            startX = mouseX
            dragNodeIndex = index
            self.dragNodeIndex = index
            self.choosedNodeChange(layer)
          }
        })
      }
    })
    stage.on('contentMousemove', (e) => {
      const moveX = e.evt.layerX
      const moveY = e.evt.layerY
      if (dragNodeIndex !== -1 && moveY > 0 && moveY < 100) {
        // 向左拖拽
        if (startX - moveX > miniLineWidth / 2) {
          if (+dragNodeIndex === self.bandData.length - 1) {
            return
          }
          document.body.style.cursor = 'pointer'
          for (let i = dragNodeIndex; i >= 0; i -= 1) {
            if (+self.bandData[i].value > +self.miniAccuracy) {
              self.bandData[i].value -= self.miniAccuracy
              self.bandData[dragNodeIndex + 1].value =
                +self.bandData[dragNodeIndex + 1].value + (+self.miniAccuracy)
              self.removeBandNode()
              self.removeBandLine()
              self.drawBandLine()
              self.drawBandNode()
              layer.draw()
              const node = this.getAllNode()
              nodeArr = node.nodeArray
              startX = node.nodeArray[dragNodeIndex]
              return
            }
          }

        } else if (moveX - startX > miniLineWidth / 2) {
          document.body.style.cursor = 'pointer'
          // 向右拖拽
          for (let i = dragNodeIndex + 1; i < self.bandData.length; i += 1) {
            if (+self.bandData[i].value > +self.miniAccuracy) {
              self.bandData[dragNodeIndex].value = 
              (+self.bandData[dragNodeIndex].value) + (+self.miniAccuracy)
              self.bandData[i].value -= self.miniAccuracy
              self.removeBandNode()
              self.removeBandLine()
              self.drawBandLine()
              self.drawBandNode()
              layer.draw()
              const node = this.getAllNode()
              nodeArr = node.nodeArray
              startX = node.nodeArray[dragNodeIndex]
              return
            }
          }
        }
      }
    })
    stage.on('contentMouseup', (e) => {
      if (self.dragNodeIndex !== -1) {
        emitData(self.bandData)
      }
      startX = 0
      document.body.style.cursor = 'default'
    })
    window.document.onmouseup = (e) => {
      if (self.dragNodeIndex !== -1) {
        emitData(self.bandData)
      }
      dragNodeIndex = -1
      self.dragNodeIndex = -1
    }
  },
  addToGroupOrLayer(arg, getInputXList) {
    arg.add(this.group)
    getInputXList(this.nodeXToInputList)
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
  addCursor(item, rect) {
    item.on('mouseover', () => {
      document.body.style.cursor = 'pointer'
    })
    item.on('mouseout', () => {
      document.body.style.cursor = 'default'
    })
    // rect.on('mouseover', function() {
    //   // this.stroke('blue')
    //   // this.strokeWidth(3)
    // })
  },
  choosedNodeChange(layer, val) {
    console.log('&&&', this.dragNodeIndex)
    const x = this.nodeGroup.getChildren()[this.dragNodeIndex].x()
    this.nodeGroup.getChildren()[this.dragNodeIndex].setAttrs({
      x: !val ? x - 1 : x,
      width: !val ? 10 : 6,
      height: !val ? 12 : 10,
      strokeWidth: !val ? 3 : 1
    })
    layer.draw()
  }
}
export default {
  OneDimensionalBand
}
