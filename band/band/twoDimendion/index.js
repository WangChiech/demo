function CombineDimBand(option) {
  this.initData(option)
  this.drawCsy()
  this.drawCsyLine()
}
  
CombineDimBand.prototype = {
  // 初始化所有数据，konva 所有组
  initData(option) {
    this.x = option.x || 0
    this.y = option.y || 0
    this.bandData = option.bandData || []
    this.cPadding = option.cPadding || 15
    this.bandWidth = option.bandWidth || 600
    this.bandHeight = option.bandHeight || 600
    this.maxLevel = option.maxLevel || 5
    this.xNum = option.xNum || 6,
    this.yNum = option.yNum || 6,
    this.yAxis = option.yAxis || 'A',
    this.xAxis = option.xAxis || 'B',
    this.bandNameList = option.bandNameList || [],
    this.dataItemColor = option.dataItemColor || [],
    this.chartLeft = option.chartLeft || 30,
    this.inputDivlength = option.inputDivlength || {},
    this.layer = option.layer

    this.x0 = this.x
    this.y0 = this.y
    this.fillRectClicked = false
    this.fillColorRectMoveType = 0
    this.dragNodeXIndex = -1
    this.dragNodeYIndex = -1
    // band所有元素的组
    this.group = new window.Konva.Group({
      x: this.x0,
      y: this.y0
    })
    // 绘制图标填充格子所有组
    this.fillItemRectGroup = new window.Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.fillItemRectGroup)
    // 绘制横轴band节点所有组
    this.nodeXItemRectGroup = new window.Konva.Group({
      x: -7,
      y: -25
    })
    this.group.add(this.nodeXItemRectGroup)
    // 绘制纵轴band节点所有组
    this.nodeYItemRectGroup = new window.Konva.Group({
      x: -25,
      y: -7
    })
    this.group.add(this.nodeYItemRectGroup)
    // 坐标系
    this.csysRectGroup = new window.Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.csysRectGroup)
    // 横坐标对应线所有组
    this.csysHorizontaLineGroup = new window.Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.csysHorizontaLineGroup)
    // 纵坐标对应线所有组
    this.csysVerticalLineGroup = new window.Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.csysVerticalLineGroup)
    this.changeColorRectGroup = new window.Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.changeColorRectGroup)
    

  },
  // 绘制坐标系
  drawCsy() {
    const csysRect = new window.Konva.Rect({
      x: 0,
      y: 0,
      width: this.bandWidth,
      height: this.bandHeight,
      stroke: '#737373',
      strokeWidth: 0.8
    })
    this.csysRectGroup.add(csysRect)
  },
  // 绘制横纵坐标对应线
  drawCsyLine() {
    // 横坐标对应线
    let lengthX = 0
    for (let i = 0; i < this.xNum - 1; i += 1) {
      lengthX += this.bandWidth / this.xNum
      const csysHorizontaLine = new window.Konva.Line({
        points: [lengthX, 0, lengthX, this.bandHeight],
        strokeWidth: 1,
        stroke: '#fff'
      })
      this.csysHorizontaLineGroup.add(csysHorizontaLine)
    }

    // 纵坐标对应线
    let lengthY = 0
    for (let i = 0; i < this.yNum - 1; i += 1) {
      lengthY += this.bandHeight / this.yNum
      const csysVerticalLine = new window.Konva.Line({
        points: [0, lengthY, this.bandWidth, lengthY],
        strokeWidth: 1,
        stroke: '#fff'
      })
      this.csysVerticalLineGroup.add(csysVerticalLine)
    }
    // 图标填充格子
    let colorItemIndex = 0
    lengthY = 0
    for (let i = 0; i < this.yNum; i += 1) {
      lengthX = 0
      let height = 0
      let width = 0
      height = this.bandHeight / this.yNum
      for (let j = 0; j < this.xNum; j += 1) {
        width = this.bandWidth / this.xNum
        const fillItemRect = new window.Konva.Rect({
          x: lengthX,
          y: lengthY,
          width,
          height,
          strokeWidth: 1,
          fill: this.dataItemColor[colorItemIndex]
        })
        this.fillItemRectGroup.add(fillItemRect)
        // 绘制文字
        const text = new window.Konva.Text({
          x: lengthX,
          y: lengthY + height / 2 - 20,
          fontSize: 14,
          text: `${this.bandData[i * this.xNum + j].detailName}\n\n${
            this.bandNameList[i * this.xNum + j] === '空' ? '' : `Band `+ this.bandNameList[i * this.xNum + j]
          }`,
          width,
          align: 'center'
        })
        this.fillItemRectGroup.add(text)

        const transparentRect = new window.Konva.Rect({
          x: lengthX,
          y: lengthY,
          width,
          height
        })

        this.addFillItemEvent(transparentRect, this.layer)

        this.group.add(transparentRect)
        colorItemIndex += 1
        lengthX += width
      }
      lengthY += height
    }
  },
  // 绘制拖拽浮层
  drawChangeColorRect(x, y, w, h) {
    const rect = new window.Konva.Rect({
      x,
      y,
      fill: 'blue',
      width: w,
      height: h,
      opacity: 0.2
    })
    const rectStroke = new window.Konva.Rect({
      x,
      y,
      width: w,
      height: h,
      stroke: 'blue',
      strokeWidth: 1
    })
    this.changeColorRectGroup.add(rect)
    this.changeColorRectGroup.add(rectStroke)
  },
  removeChangeColorRect(layer) {
    this.changeColorRectGroup.destroyChildren()
    this.layer.draw()
  },
  // 绘制
  addToGroupOrLayer(arg) {
    arg.add(this.group)
  },
  // 添加canvas事件
  addMouseEvent(stage, layer, emitData, fillColorDataChange, closeStockSelect) {
    const self = this
    stage.on('contentMousedown', (e) => {
      self.removeChangeColorRect()
      // closeStockSelect()
    })
    stage.on('contentMousemove', (e) => {
      const moveX = e.evt.layerX
      const moveY = e.evt.layerY
      // 图表内拖拽
      if (self.fillRectClicked) {
        let moveXInChart = e.evt.layerX - self.y
        let moveYInChart = e.evt.layerY - self.x
        // 边界问题
        if (moveXInChart < 2) {
          moveXInChart = 0
        }
        if (moveXInChart > self.bandWidth) {
          moveXInChart = self.bandWidth
        }
        if (moveYInChart < 0) {
          moveYInChart = 0
        }
        if (moveYInChart > self.bandHeight) {
          moveYInChart = self.bandHeight
        }
        // 向左上方拖拽
        if (moveXInChart < self.startMouse.moveX && moveYInChart < self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            moveXInChart,
            moveYInChart, 
            self.fillColorRectStart.x + self.fillColorRectStart.width - moveXInChart, 
            self.fillColorRectStart.y + self.fillColorRectStart.height - moveYInChart
          )
          self.fillColorRectMoveType = 1
          layer.draw()
        }
        // 向右上方拖拽
        if (moveXInChart > self.startMouse.moveX && moveYInChart < self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            self.fillColorRectStart.x, 
            moveYInChart, 
            moveXInChart - self.fillColorRectStart.x, 
            self.fillColorRectStart.y + self.fillColorRectStart.height - moveYInChart
          )
          self.fillColorRectMoveType = 2
          layer.draw()
        }
        // 向左下方拖拽
        if (moveXInChart < self.startMouse.moveX && moveYInChart > self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            moveXInChart, 
            self.fillColorRectStart.y, 
            self.fillColorRectStart.x + self.fillColorRectStart.width - moveXInChart, 
            moveYInChart - self.fillColorRectStart.y
          )
          self.fillColorRectMoveType = 3
          layer.draw()
        }
        // 向右下方拖拽
        if (moveXInChart > self.startMouse.moveX && moveYInChart > self.startMouse.moveY) {
          self.removeChangeColorRect()
          self.drawChangeColorRect(
            self.fillColorRectStart.x, 
            self.fillColorRectStart.y, 
            moveXInChart - self.fillColorRectStart.x, 
            moveYInChart - self.fillColorRectStart.y
          )
          self.fillColorRectMoveType = 4
          layer.draw()
        }
        
      }
    })
    stage.on('contentMouseup', (e) => {
      const mouseX = e.evt.layerX
      const mouseY = e.evt.layerY
      // closeStockSelect()
      // 图标内拖拽设置库存策略, 处理图标内选中区域index数据
      if (self.fillRectClicked) {
        // 边界问题处理
        let fillItemRectStartIndex = 0
        let fillItemRectEndIndex = 0
        const fillItemRectGroupList = []
        self.fillItemRectGroup.getChildren().each((item, index) => {
          if (!item.textArr) {
            fillItemRectGroupList.push(item)
          }
        })
        fillItemRectGroupList.forEach((item, index) => {
          if (
            +self.fillColorRectStart.x === +item.x() && 
            +self.fillColorRectStart.y === +item.y()
          ) {
            fillItemRectStartIndex = index
            if (
              +self.fillColorRectStart.x === +self.fillColorRectEnd.x && 
              +self.fillColorRectStart.y === +self.fillColorRectEnd.y
            ) {
              fillItemRectEndIndex = index
            } 
          } else if (
            +self.fillColorRectEnd.x === +item.x() && 
            +self.fillColorRectEnd.y === +item.y()
          ) {
            fillItemRectEndIndex = index
          }
        })
        if (fillItemRectStartIndex > fillItemRectEndIndex) {
          const temp = fillItemRectStartIndex
          fillItemRectStartIndex = fillItemRectEndIndex
          fillItemRectEndIndex = temp
        }
        // 向右上方、左下方拖拽
        if (
          (
            +self.fillColorRectStart.x < +self.fillColorRectEnd.x && 
            +self.fillColorRectStart.y > +self.fillColorRectEnd.y
          ) ||
          (
            +self.fillColorRectStart.x > +self.fillColorRectEnd.x && 
            +self.fillColorRectStart.y < +self.fillColorRectEnd.y
          )
        ) {
          const spaceNum =
            (fillItemRectStartIndex % self.xNum) + 1 - 
            (fillItemRectEndIndex % self.xNum)
          fillItemRectStartIndex = fillItemRectStartIndex - spaceNum + 1
          fillItemRectEndIndex = fillItemRectEndIndex + spaceNum - 1
        }
        const spaceBeforeNum = fillItemRectStartIndex % self.xNum
        const spaceBehindNum = 
          self.xNum - (fillItemRectEndIndex % self.xNum) - 1
        const spaceNum = spaceBeforeNum + spaceBehindNum
        const fillNum = self.xNum - spaceNum
        let pushedNum = 0
        const fillColorChangeRectIndexArr = []
        for (let i = fillItemRectStartIndex; i <= fillItemRectEndIndex; i += 1) {
          if (pushedNum < fillNum) {
            fillColorChangeRectIndexArr.push(i)
            if (pushedNum === self.xNum - 1) {
              pushedNum = -1
            }
          } else if (pushedNum === self.xNum - 1) {
            pushedNum = -1
          }
          pushedNum += 1
        }
        fillColorDataChange(
          fillColorChangeRectIndexArr, 
          {
            x: mouseX, y: mouseY
          }
        )
        self.fillRectClicked = false
      }
    })
    window.document.onmouseup = (e) => {
      // 图标内拖拽, 边界问题
      if (self.fillRectClicked) {
        self.removeChangeColorRect()
        self.fillRectClicked = false
      }
    }
  },
  // 添加拖拽格子事件
  addFillItemEvent(rect, layer) {
    const self = this
    rect.on('mousemove', (e) => { 
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
    rect.on('mouseleave', (e) => {
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
      const moveX = e.evt.layerX - self.x - self.chartLeft
      const moveY = e.evt.layerY - self.x - self.chartLeft
      self.fillRectClicked = true
      self.startMouse = { 
        moveX, moveY 
      }
      const {
        x, y, width, height
      } = rect.attrs
      self.fillColorRectStart = { 
        x, y, width, height 
      }
    })
    rect.on('mouseup', (e) => {
      if (+self.dragNodeXIndex !== -1 || +self.dragNodeYIndex !== -1 || !self.fillRectClicked) {
        return
      }
      const {
        x, y, width, height 
      } = rect.attrs
      self.fillColorRectEnd = { 
        x, y, width, height 
      }
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
  }
}
export default {
  CombineDimBand
}
