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
      this.chartLeft = option.chartLeft || 30
      this.bandStyleX = option.bandStyleX
      this.bandStyleY = option.bandStyleY
  
      this.x0 = 0
      this.y0 = 0
      const self = this
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
  
    },
    drawCsy () {
      // 绘制坐标系
      const csysRect = new Konva.Rect({
        x: this.x0,
        y: this.y0,
        width: this.bandWidth ,
        height: this.bandHeight,
        stroke: 'black',
        strokeWidth: .8,
        // fill: 'red',
      })
      this.csysRectGroup.add(csysRect)
      const originX = new Konva.Text({
        x: -5,
        y: -20,
        fontSize: 16,
        text: '0',
        fill: 'black',
        // width: 20,
        align: 'center'
      })
      this.csysRectGroup.add(originX) 
      const originY = new Konva.Text({
        x: -20,
        y: -5,
        fontSize: 16,
        text: '0',
        fill: 'black',
        // width: 20,
        align: 'center'
      })
      this.csysRectGroup.add(originY) 
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
          strokeWidth: .6,
          stroke: 'black'
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
          strokeWidth: .6,
          stroke: 'black'
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
              context.font = '55px'
              context.strokeRect(0,0,15,15)
              context.fillText(self.dataListX[i].name, 5, 10)
              context.moveTo(0, 15)
              context.lineTo(7, 27)
              context.moveTo(15, 15)
              context.lineTo(7, 27)
              context.closePath()
              context.fillStrokeShape(this);
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
        for (let i = bandYSectionNum; i< this.bandWidth; i += bandYSectionNum) {
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
        // console.log('bbb',item.y())
        nodeItemY = itemY + self.y + this.chartLeft -25
      })
      return { nodeItemArray, nodeItemY }
    },
    addMouseEvent (stage, layer,emitData) {
      let self = this,
          updataNum = 1,
          startX = 0,
          startY = 0,
          dragNodeXIndex = -1,
          dragNodeYIndex = -1,
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
              dragNodeXIndex = index
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
              dragNodeYIndex = index
            }
          })
        }
        
      })
      stage.on('contentMousemove', function(e) {
              const moveX = e.evt.layerX
              const moveY = e.evt.layerY
              if(dragNodeXIndex !== -1) {
                // 横轴为百分比，向左拖拽
                if (nodeMoved && startX - moveX > miniLineWidth * updataNum - miniLineWidth / 2) {
                  nodeMoved = false
                  if (dragNodeXIndex === self.dataListX.length - 1) {
                    return
                  }
                  for (let i = dragNodeXIndex; i >= 0; i--) {
                    if (self.dataListX[i].value > self.miniAccuracyX) {
                      self.dataListX[i].value = self.dataListX[i].value - self.miniAccuracyX
                      self.dataListX[dragNodeXIndex + 1].value = (+self.dataListX[dragNodeXIndex + 1].value) + (+self.miniAccuracyX)
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
                  for (let i = dragNodeXIndex + 1; i < self.dataListX.length; i++) {
                    if (+self.dataListX[i].value > +self.miniAccuracyX) {
                      self.dataListX[dragNodeXIndex].value = (+self.dataListX[dragNodeXIndex].value) + (+self.miniAccuracyX)
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
              } else if (dragNodeYIndex !== -1) {
                // 纵轴为百分比，向上拖拽
                if (nodeMoved && startY - moveY > miniLineHeight * updataNum - miniLineHeight / 2) {
                  nodeMoved = false
                  if (dragNodeYIndex === self.dataListY.length - 1) {
                    return
                  }
                  for (let i = dragNodeYIndex; i >= 0; i--) {
                    if (self.dataListY[i].value > self.miniAccuracyY) {
                      self.dataListY[i].value = self.dataListY[i].value - self.miniAccuracyY
                      self.dataListY[dragNodeYIndex + 1].value = (+self.dataListY[dragNodeYIndex + 1].value) + (+self.miniAccuracyY)
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
                  for (let i = dragNodeYIndex + 1; i < self.dataListY.length; i++) {
                    if (+self.dataListY[i].value > +self.miniAccuracyY) {
                      self.dataListY[dragNodeYIndex].value = (+self.dataListY[dragNodeYIndex].value) + (+self.miniAccuracyY)
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
      })
      stage.on('contentMouseup', (e) => {
              if (dragNodeXIndex !== -1 || dragNodeYIndex !== -1) {
                // self.$emit('input', self.bandData)
                emitData({
                  dataListX: self.dataListX,
                  dataListY: self.dataListY,
                  dataItemColor: self.dataItemColor
                })
              }
              startX = 0
              startY = 0
              updataNum = 1
              nodeMoved = true
              dragNodeXIndex = -1
              dragNodeYIndex = -1
      })
      window.document.onmouseup = (e) => {
        dragNodeXIndex = -1
        dragNodeYIndex = -1
        nodeMoved = true
      }
    }
    
      
    
  }
  