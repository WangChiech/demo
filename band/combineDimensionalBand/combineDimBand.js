export function CombineDimBand(option) {
  this.initData(option)
  this.drawCsy()
  this.drawCsyLine()
}
  
CombineDimBand.prototype = {
  initData(option) {
    this.x = option.x || 15
    this.y = option.y || 45
    this.cPadding = option.cPadding || 15
    this.bandWidth = option.bandWidth || 600
    this.bandHeight = option.bandHeight || 600
    this.maxLevel = option.maxLevel || 5
    this.miniAccuracyX = option.miniAccuracyX || 5
    this.miniAccuracyY = option.miniAccuracyY || 5
    this.dataListX = option.dataListX || []
    this.dataListY = option.dataListY || []
    this.dataItemColor = option.dataItemColor || []
    this.originalDataItemColor = option.originalDataItemColor || []
    this.chartLeft = option.chartLeft || 30
    this.bandStyleX = option.bandStyleX
    this.bandStyleY = option.bandStyleY
    this.layer = option.layer

    this.x0 = 0
    this.y0 = 0
    this.fillRectClicked = false
    this.fillColorRectMoveType = 0
    this.dragNodeXIndex = -1,
    this.dragNodeYIndex = -1,
    // const self = this
    // band所有元素的组
    this.group = new Konva.Group({
      x: this.x + this.chartLeft,
      y: this.y + this.chartLeft
    })
    // 绘制图标填充格子所有组
    this.fillItemRectGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.fillItemRectGroup)
    // 绘制横轴band节点所有组
    this.nodeXItemRectGroup = new Konva.Group({
      x: -7,
      y: -25
    })
    this.group.add(this.nodeXItemRectGroup)
    // 绘制纵轴band节点所有组
    this.nodeYItemRectGroup = new Konva.Group({
      x: -25,
      y: -7
    })
    this.group.add(this.nodeYItemRectGroup)
    // 坐标系
    this.csysRectGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.csysRectGroup)
    // 横坐标对应线所有组
    this.csysHorizontaLineGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.csysHorizontaLineGroup)
    // 纵坐标对应线所有组
    this.csysVerticalLineGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.csysVerticalLineGroup)
    this.changeColorRectGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.changeColorRectGroup)
    

  },
  drawCsy () {
    // 绘制坐标系
    const csysRect = new Konva.Rect({
      x: this.x0,
      y: this.y0,
      width: this.bandWidth ,
      height: this.bandHeight,
      stroke: '#737373',
      strokeWidth: .8,
      // fill: 'red',
    })
    this.csysRectGroup.add(csysRect)
    const originX = new Konva.Text({
      x: -15,
      y: -15,
      fontSize: 16,
      text: '0',
      // fill: '#737373',
      // width: 20,
      align: 'center'
    })
    this.csysRectGroup.add(originX) 
  },
  drawCsyLine () {
    // 横坐标对应线
    let lengthX = 0
    for (let i = 0; i < this.dataListX.length-1; i++) {
      if (this.bandStyleX) {
        lengthX += this.bandWidth / 100 * this.dataListX[i].value
      } else {
        lengthX += this.bandWidth / this.dataListX.length
      }
      const csysHorizontaLine = new Konva.Line({
        points: [this.x0 + lengthX  , this.y0, this.x0 + lengthX, this.y0 + this.bandHeight],
        strokeWidth: 1,
        stroke: '#fff'
      })
      this.csysHorizontaLineGroup.add(csysHorizontaLine)
    }

    // 纵坐标对应线
    let lengthY = 0
    for (let i = 0; i < this.dataListY.length - 1; i++) {
      if (this.bandStyleY) {
        lengthY += this.bandHeight / 100 * this.dataListY[i].value
      } else {
        lengthY += this.bandHeight / this.dataListY.length
      }
      const csysVerticalLine = new Konva.Line({
        points: [this.x0, this.y0 + lengthY, this.x0 + this.bandWidth, this.y0 + lengthY],
        strokeWidth: 1,
        stroke: '#fff'
      })
      this.csysVerticalLineGroup.add(csysVerticalLine)
    }
    // 图标填充格子
    let colorItemIndex = 0
    lengthY = 0
    for (let i = 0; i < this.dataListY.length; i++) {
      lengthX = 0
      let height = 0
      let width = 0
      if (this.bandStyleY) {
        height = this.bandHeight / 100 * this.dataListY[i].value
      } else {
        height = this.bandHeight / this.dataListY.length
      }
      for (let j = 0; j < this.dataListX.length; j++) {
        if (this.bandStyleX) {
          width = this.bandWidth / 100 * this.dataListX[j].value
        } else {
          width = this.bandWidth / this.dataListX.length
        }
        const fillItemRect = new Konva.Rect({
          x: lengthX,
          y: lengthY,
          width: width ,
          height: height,
          // stroke: 'black',
          strokeWidth: 1,
          fill: this.dataItemColor[colorItemIndex],
        })
        this.fillItemRectGroup.add(fillItemRect)
        const transparentRect = new Konva.Rect({
          x: lengthX,
          y: lengthY,
          width: width ,
          height: height,
        })

        this.addFillItemEvent(transparentRect, this.layer)

        this.group.add(transparentRect)
        colorItemIndex++
        lengthX += width
      }
      lengthY += height
    }
  },
  drawXNode () {
    let self = this
    // 横轴百分比刻度、节点
    if (this.bandStyleX) {
      // 整个band横轴刻度
      const bandXSectionNum = this.bandWidth / 100 * this.miniAccuracyX
      // 横轴刻度
      for (let i = bandXSectionNum; i< this.bandWidth; i += bandXSectionNum) {
        const scaleLine = new Konva.Line({
          points: [this.x0 + i, this.y0, this.x0 + i, this.y0 + 5],
          strokeWidth: 1,
          stroke: 'black'
        })
        this.csysRectGroup.add(scaleLine)
      }
      // 横轴band
      let nodeXItemRectX = 0
      for (let i = 0; i < this.dataListX.length; i++) {
        nodeXItemRectX += (this.dataListX[i].value * this.bandWidth / 100)
        const nodeXItem = new Konva.Shape({
          sceneFunc: function(context) {
            context.beginPath()
            // context.font = '55px'
            context.strokeRect(0,0,15,15)
            context.fillText(self.dataListX[i].name, 5, 10)
            context.moveTo(0, 15)
            context.lineTo(7, 27)
            context.moveTo(15, 15)
            context.lineTo(7, 27)
            context.closePath()
            context.fillStrokeShape(this)
          },
          x: nodeXItemRectX,
          y: 0,
          fill: 'black',
          stroke: 'black',
          strokeWidth: 1
        })
        this.nodeXItemRectGroup.add(nodeXItem)
      }
    }
  },
  drawYNode () {
    let self = this
    // 纵轴百分比刻度、节点
    if (this.bandStyleY) {
      // 整个band纵轴刻度
      const bandYSectionNum = this.bandHeight / 100 * this.miniAccuracyY
      // 纵轴刻度
      for (let i = bandYSectionNum; i< this.bandHeight; i += bandYSectionNum) {
        const scaleLine = new Konva.Line({
          points: [this.x0, this.y0 + i, this.x0 + 5, this.y0 + i],
          strokeWidth: 1,
          stroke: 'black'
        })
        this.csysRectGroup.add(scaleLine)
      }
      // 纵轴band
      let nodeYItemRectY = 0
      for (let i = 0; i < this.dataListY.length; i++) {
        nodeYItemRectY += (this.dataListY[i].value * this.bandHeight / 100)
        const nodeYItem = new Konva.Shape({
          sceneFunc: function(context) {
            context.beginPath()
            context.font = '55px'
            context.strokeRect(0,0,15,15)
            context.fillText(self.dataListY[i].name, 5, 10)
            context.moveTo(15, 0)
            context.lineTo(27, 7)
            context.moveTo(15, 15)
            context.lineTo(27, 7)
            context.closePath()
            context.fillStrokeShape(this);
          },
          x: 0,
          y: nodeYItemRectY,
          fill: 'black',
          stroke: 'black',
          strokeWidth: 1
        })
        this.nodeYItemRectGroup.add(nodeYItem)
      }
    }
  },
  drawChangeColorRect (x, y, w, h) {
    let rect = new Konva.Rect({
      x: x,
      y: y,
      fill: 'blue',
      width: w,
      height: h,
      // strokeWidth: 2,
      opacity: .1
    })
    let rectStroke = new Konva.Rect({
      x: x,
      y: y,
      width: w,
      height: h,
      stroke: 'blue',
      strokeWidth: 1,
    })
    this.changeColorRectGroup.add(rect)
    this.changeColorRectGroup.add(rectStroke)
  },
  drawAddRect (x, y, w, h) {
    const addRect = new Konva.Shape({
      sceneFunc: function(context) {
        context.beginPath()
        context.font = 55
        context.strokeRect(0,0,w,h)
        context.moveTo(w/2-10, h/2)
        context.lineTo(w/2+10, h/2)
        context.moveTo(w/2, h/2-10)
        context.lineTo(w/2, h/2+10)
        context.closePath()
        context.fillStrokeShape(this)
      },
      x: x,
      y: y,
      stroke: 'black',
      strokeWidth: 1
    })
    // this.group.add(addRect)
    return addRect
  },
  removeYNode (layer) {
    this.nodeYItemRectGroup.destroyChildren()
    this.csysHorizontaLineGroup.destroyChildren()
    this.csysVerticalLineGroup.destroyChildren()
    this.fillItemRectGroup.destroyChildren()
  },
  removeXNode (layer) {
    this.nodeXItemRectGroup.destroyChildren()
    this.csysHorizontaLineGroup.destroyChildren()
    this.csysVerticalLineGroup.destroyChildren()
    this.fillItemRectGroup.destroyChildren()
  },
  removeChangeColorRect (layer) {
    this.changeColorRectGroup.destroyChildren()
  },
  addToGroupOrLayer(arg) {
    arg.add(this.group)
  },
  getAllNode(type) {
    const self = this
    const nodeItemArray = []
    let nodeItemY = 0
    this.nodeGroup = type? this.nodeYItemRectGroup:this.nodeXItemRectGroup
    this.nodeGroup.getChildren().each((item, index) => {
      const itemX = type? item.y(): item.x()
      const itemY = type? item.x(): item.y()
      nodeItemArray.push(itemX + self.x + this.chartLeft - 7)
      nodeItemY = itemY + self.y + this.chartLeft -25
    })
    return { nodeItemArray, nodeItemY }
  },
  addMouseEvent (stage, layer,emitData, fillColorDataChange) {
    let self = this,
        updataNum = 1,
        startX = 0,
        startY = 0,
        nodeMoved = true,
        miniLineWidth = this.bandWidth * this.miniAccuracyX / 100,
        miniLineHeight = this.bandHeight * this.miniAccuracyY / 100
    stage.on('contentMousedown', (e) => {
      const mouseX = e.evt.layerX
      const mouseY = e.evt.layerY
      const nodeX = this.getAllNode(0)
      // 当x轴为百分比
      if (
        mouseY > nodeX.nodeItemY && 
        mouseY < nodeX.nodeItemY + 15
      ) {
        nodeX.nodeItemArray.forEach((item, index) => {
          if (
            mouseX > item && 
            mouseX < item + 15
          ) {
            startX = mouseX
            self.dragNodeXIndex = index
          }
        })
      }
      // 当y轴为百分比
      const nodeY = this.getAllNode(1)
      if (
        mouseX > nodeY.nodeItemY && 
        mouseX < nodeY.nodeItemY + 15
      ) {
        nodeY.nodeItemArray.forEach((item, index) => {
          if (
            mouseY > item && 
            mouseY < item + 15
          ) {
            startY = mouseY
            self.dragNodeYIndex = index
          }
        })
      }
      
    })
    stage.on('contentMousemove', function(e) {
      const moveX = e.evt.layerX
      const moveY = e.evt.layerY
      // band节点拖拽
      if(self.dragNodeXIndex !== -1) {
        // 横轴为百分比，向左拖拽
        if (nodeMoved && startX - moveX > miniLineWidth * updataNum - miniLineWidth / 2) {
          nodeMoved = false
          if (self.dragNodeXIndex === self.dataListX.length - 1) {
            return
          }
          for (let i = self.dragNodeXIndex; i >= 0; i--) {
            if (self.dataListX[i].value > self.miniAccuracyX) {
              self.dataListX[i].value = self.dataListX[i].value - self.miniAccuracyX
              self.dataListX[self.dragNodeXIndex + 1].value = (+self.dataListX[self.dragNodeXIndex + 1].value) + (+self.miniAccuracyX)
              self.removeXNode()
              self.drawXNode()
              self.drawCsyLine()
              layer.draw()
              updataNum++
              nodeMoved = true
              return
            }
          }
        } else if (nodeMoved && moveX - startX > miniLineWidth * updataNum - miniLineWidth / 2) {
          // 横轴为百分比，向右拖拽
          nodeMoved = false
          for (let i = self.dragNodeXIndex + 1; i < self.dataListX.length; i++) {
            if (+self.dataListX[i].value > +self.miniAccuracyX) {
              self.dataListX[self.dragNodeXIndex].value = (+self.dataListX[self.dragNodeXIndex].value) + (+self.miniAccuracyX)
              self.dataListX[i].value = self.dataListX[i].value - self.miniAccuracyX
              self.removeXNode()
              self.drawXNode()
              self.drawCsyLine()
              layer.draw()
              updataNum++
              nodeMoved = true
              return
            }
          }
          
        }
      } else if (self.dragNodeYIndex !== -1) {
        // 纵轴为百分比，向上拖拽
        if (nodeMoved && startY - moveY > miniLineHeight * updataNum - miniLineHeight / 2) {
          nodeMoved = false
          if (self.dragNodeYIndex === self.dataListY.length - 1) {
            return
          }
          for (let i = self.dragNodeYIndex; i >= 0; i--) {
            if (self.dataListY[i].value > self.miniAccuracyY) {
              self.dataListY[i].value = self.dataListY[i].value - self.miniAccuracyY
              self.dataListY[self.dragNodeYIndex + 1].value = (+self.dataListY[self.dragNodeYIndex + 1].value) + (+self.miniAccuracyY)
              self.removeYNode()
              self.drawYNode()
              self.drawCsyLine()
              layer.draw()
              updataNum++
              nodeMoved = true
              return
            }
          }
        } else if (nodeMoved && moveY - startY > miniLineHeight * updataNum - miniLineHeight / 2) {
          // 纵轴为百分比，向下拖拽
          nodeMoved = false
          for (let i = self.dragNodeYIndex + 1; i < self.dataListY.length; i++) {
            if (+self.dataListY[i].value > +self.miniAccuracyY) {
              self.dataListY[self.dragNodeYIndex].value = (+self.dataListY[self.dragNodeYIndex].value) + (+self.miniAccuracyY)
              self.dataListY[i].value = (+self.dataListY[i].value) - (+self.miniAccuracyY)
              self.removeYNode()
              self.drawYNode()
              self.drawCsyLine()
              layer.draw()
              updataNum++
              nodeMoved = true
              return
            }
          }
        }
      }
      // 图表内拖拽
      if (self.fillRectClicked) {
        let moveX = e.evt.layerX-self.x - self.chartLeft
        let moveY = e.evt.layerY-self.x - self.chartLeft
        // 边界问题
        if (moveX < 2) {
          moveX = 2
        }
        if (moveX > self.bandWidth) {
          moveX = self.bandWidth 
        }
        if (moveY < 0) {
          moveY = 0
        }
        if (moveY > self.bandHeight) {
          moveY = self.bandHeight
        }
        // 向左上方拖拽
        if (moveX < self.startMouse.moveX && moveY < self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            moveX, 
            moveY, 
            self.fillColorRectStart.x + self.fillColorRectStart.width - moveX, 
            self.fillColorRectStart.y + self.fillColorRectStart.height - moveY
          )
          self.fillColorRectMoveType = 1
          layer.draw()
        }
        // 向右上方拖拽
        if (moveX > self.startMouse.moveX && moveY < self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            self.fillColorRectStart.x, 
            moveY, 
            moveX - self.fillColorRectStart.x, 
            self.fillColorRectStart.y + self.fillColorRectStart.height - moveY
          )
          self.fillColorRectMoveType = 2
          layer.draw()
        }
        // 向左下方拖拽
        if (moveX < self.startMouse.moveX && moveY > self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            moveX, 
            self.fillColorRectStart.y, 
            self.fillColorRectStart.x + self.fillColorRectStart.width - moveX, 
            moveY-self.fillColorRectStart.y
          )
          self.fillColorRectMoveType = 3
          layer.draw()
        }
        // 向右下方拖拽
        if (moveX > self.startMouse.moveX && moveY > self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            self.fillColorRectStart.x, 
            self.fillColorRectStart.y, 
            moveX-self.fillColorRectStart.x, 
            moveY-self.fillColorRectStart.y
          )
          self.fillColorRectMoveType = 4
          layer.draw()
        }
        
      }
    })
    stage.on('contentMouseup', (e) => {
      const mouseX = e.evt.layerX
      const mouseY = e.evt.layerY
      if (self.dragNodeXIndex !== -1 || self.dragNodeYIndex !== -1) {
        emitData({
          dataListX: self.dataListX,
          dataListY: self.dataListY,
          dataItemColor: self.originalDataItemColor
        })
      }
      // 图标内拖拽设置库存策略, 处理图标内选中区域index数据
      if (self.fillRectClicked) {
        // 边界问题处理
        let fillItemRectStartIndex = 0
        let fillItemRectEndIndex = 0
        self.fillItemRectGroup.getChildren().each((item, index) => {
          if (+self.fillColorRectStart.x === +item.x() && +self.fillColorRectStart.y === +item.y()) {
            fillItemRectStartIndex = index
            if (
              +self.fillColorRectStart.x === +self.fillColorRectEnd.x 
              && +self.fillColorRectStart.y === +self.fillColorRectEnd.y
            ) {
              fillItemRectEndIndex = index
            } 
          } else if (+self.fillColorRectEnd.x === +item.x() && +self.fillColorRectEnd.y === +item.y()) {
            fillItemRectEndIndex = index
          }
        })
        if (fillItemRectStartIndex > fillItemRectEndIndex) {
          let temp = fillItemRectStartIndex
          fillItemRectStartIndex = fillItemRectEndIndex
          fillItemRectEndIndex = temp
        }if (+self.fillColorRectMoveType === 3 || +self.fillColorRectMoveType === 2) {
          let spaceNum = fillItemRectStartIndex %  self.dataListX.length + 1 - fillItemRectEndIndex % self.dataListX.length
          fillItemRectStartIndex = fillItemRectStartIndex - spaceNum + 1
          fillItemRectEndIndex = fillItemRectEndIndex + spaceNum -1
        }
        let spaceBeforeNum = fillItemRectStartIndex % self.dataListX.length
        let spaceBehindNum = self.dataListX.length - fillItemRectEndIndex % self.dataListX.length - 1
        let spaceNum = spaceBeforeNum + spaceBehindNum
        let fillNum = self.dataListX.length - spaceNum
        let pushedNum = 0
        let fillColorChangeRectIndexArr = []
        for (let i = fillItemRectStartIndex; i <= fillItemRectEndIndex; i++) {
          if (pushedNum < fillNum) {
            fillColorChangeRectIndexArr.push(i)
            if (pushedNum === self.dataListX.length - 1) {
              pushedNum = -1
            }
          } else if (pushedNum === self.dataListX.length - 1) {
            pushedNum = -1
          }
          pushedNum++
        }
        fillColorDataChange(fillColorChangeRectIndexArr, {x: mouseX, y: mouseY})
        self.fillRectClicked = false
      }
      startX = 0
      startY = 0
      updataNum = 1
      nodeMoved = true
      self.dragNodeXIndex = -1
      self.dragNodeYIndex = -1
    })
    window.document.onmouseup = (e) => {
      self.dragNodeXIndex = -1
      self.dragNodeYIndex = -1
      nodeMoved = true
      // 图标内拖拽, 边界问题
      if (self.fillRectClicked) {
        self.removeChangeColorRect()
        self.fillRectClicked = false
      }
    }
  },
  addFillItemEvent (rect, layer) {
    const self = this
    rect.on('mousemove', function(){ 
      if (self.fillRectClicked || +self.dragNodeXIndex !== -1 || +self.dragNodeYIndex !== -1) {
        return
      }
      rect.setAttrs({
        stroke: 'rgba(225, 225, 225, 0.8)',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: {
          x: 2,
          y: 2
        }
      })
      layer.draw()
    })
    rect.on('mouseleave', function(){
      if (+self.dragNodeXIndex !== -1 || +self.dragNodeYIndex !== -1) {
        return
      }
      rect.setAttrs({
        stroke: '',
        shadowColor: '',
          shadowOffset: {
            x: 0,
            y: 0
          }
      })
      layer.draw()
    })
    rect.on('mousedown', (e) => {
      if (+self.dragNodeXIndex !== -1 || +self.dragNodeYIndex !== -1) {
        return
      }
      const moveX = e.evt.layerX-self.x - self.chartLeft
      const moveY = e.evt.layerY-self.x - self.chartLeft
      self.fillRectClicked = true
      self.startMouse = { moveX, moveY }
      let {x, y, width, height} = rect.attrs
      self.fillColorRectStart = { x, y, width, height }
    })
    rect.on('mouseup', (e) => {
      if (+self.dragNodeXIndex !== -1 || +self.dragNodeYIndex !== -1) {
        return
      }
      self.fillRectClicked = true
      let {x, y, width, height} = rect.attrs
      self.fillColorRectEnd = { x, y, width, height }
      self.removeChangeColorRect()
      if (+self.fillColorRectMoveType === 1 || !self.fillColorRectMoveType) {
        self.drawChangeColorRect(
          x, 
          y, 
          self.fillColorRectStart.x + self.fillColorRectStart.width - x, 
          self.fillColorRectStart.y + self.fillColorRectStart.height - y
        )
      } else if (+self.fillColorRectMoveType === 2) {
        self.drawChangeColorRect(
          self.fillColorRectStart.x, 
          y, 
          x + width - self.fillColorRectStart.x, 
          self.fillColorRectStart.y + self.fillColorRectStart.height - y
        )
      } else if (+self.fillColorRectMoveType === 3) {
        self.drawChangeColorRect(
          x, 
          self.fillColorRectStart.y, 
          self.fillColorRectStart.x + self.fillColorRectStart.width - x, 
          y + height - self.fillColorRectStart.y
        )
      } else if (+self.fillColorRectMoveType === 4) {
        self.drawChangeColorRect(
          self.fillColorRectStart.x, 
          self.fillColorRectStart.y, 
          x + width - self.fillColorRectStart.x, 
          y + height - self.fillColorRectStart.y
        )
      }
      
      layer.draw()
    })
  },
  addMouseCursorEvent () {
    this.group.on('mouseover', function(){ 
      document.body.style.cursor = 'pointer'
    })
    this.group.on('mouseout', function(){ 
      document.body.style.cursor = 'default'
    })
    if (this.bandStyleX) {
      this.nodeXItemRectGroup.on('mouseover', function(){ 
        console.log('mouseover')
        document.body.style.cursor = 'pointer'
      })
      this.nodeXItemRectGroup.on('mouseout', function(){ 
        console.log('mouseover')
        document.body.style.cursor = 'default'
      })
    }
    if (this.bandStyleY) {
      console.log('lllllllll')
      this.nodeYItemRectGroup.on('mouseover', function(){ 
        console.log('mouseover')
        document.body.style.cursor = 'pointer'
      })
      this.nodeYItemRectGroup.on('mouseout', function(){ 
        console.log('mouseover')
        document.body.style.cursor = 'default'
      })
    }
  }
  
    
  
}
