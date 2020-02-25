function OneDimensionalBand(option) {
  this._init(option)
}

OneDimensionalBand.prototype = {
  _init: function(option) {
    this.x = option.x || 0 // 原点坐标
    this.y = option.y || 0
    this.data = option.data || []

    var x0 = 0
    var y0 = 0

    // band所有元素的组
    this.group = new Konva.Group({
      x: this.x,
      y: this.y
    });
    // band节点所有组
    this.miniLineGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.miniLineGroup)

    // band节点所有组
    this.rectGroup = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(this.rectGroup)

    var miniLineX = x0
    var rectX = x0
    var self = this
    this.data.forEach(function (item,index) {
      var miniLineNum = item.value/5
      for (var i=0;i<miniLineNum;i++) {
        var miniLine = new Konva.Line({
          points: [miniLineX, y0, miniLineX+30, y0],
          strokeWidth: 5,
          stroke: item.color,
        })
        miniLineX += 32
        self.miniLineGroup.add(miniLine)
      }
      rectX += item.value/5*32
      var rect = new Konva.Rect({
        x: rectX-6,
        y: y0 - 7,
        width: 6,
        height: 10,
        stroke: item.color,
        // opacity: .8,
        strokeWidth: 1,
        fill: '#fff',
        index: 1,
        id: 'rect' + index
      })
      self.rectGroup.add(rect)
      
      // 绘制水滴
      var curveGroup = new Konva.Group({
        x: rectX -12,
        y: y0 -32
      })
      var curve = new Konva.Shape({
        sceneFunc: function(context) {
          context.beginPath()
          context.fillStyle=this.color
          context.arc(9,9,9,Math.PI,0)
          context.moveTo(18,9)
          context.quadraticCurveTo(18,15,9,24)
          context.quadraticCurveTo(0,15,0,9)
          context.fillShape(this)
        },
        fill: item.color
      });
      curveGroup.add(curve)
      self.group.add(curveGroup)

      // 绘制下方文字
      var textGroup = new Konva.Group({
        x: rectX -12,
        y: y0 -27
      })
      var text = new Konva.Text({
        x: 0,
        y: 0,
        fontSize: 14,
        text: item.name,
        fill: '#fff',
        width: 20,
        align: 'center',
      })
      textGroup.add(text);
      self.group.add(textGroup)
    })

  },
  addToGroupOrLayer: function(arg) {
    arg.add(this.group)
  },
  playAnimate: function() {
    var self = this
    var nodeArray = []
    this.rectGroup.getChildren().each(function(item, index) {
      nodeArray.push(item.x()+self.x)
    })
    console.log(222,nodeArray)
    return nodeArray
  }
}