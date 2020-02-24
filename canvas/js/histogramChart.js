function HistogramChart(option) {
  this._init(option);
}

HistogramChart.prototype = {
  _init: function(option) {
    this.x = option.x || 0; // 柱状图原点坐标
    this.y = option.y || 0;
    this.w = option.w || 0; // 柱状图总宽度
    this.h = option.h || 0; // 柱状图总高度

    this.data = option.data || [];

    var x0 = 0;
    var y0 = 0;

    // 柱状图中所有元素的组
    this.group = new Konva.Group({
      x: this.x,
      y: this.y
    });
    // 所有矩形的组
    this.rectGroup = new Konva.Group({
      x: 0,
      y: 0
    });
    this.group.add(this.rectGroup);
    // 放百分比文字的组
    this.textPercentGroup = new Konva.Group({
      x: 0,
      y:0
    });
    this.group.add(this.textPercentGroup);
    // 初始化底线
    var bsLine = new Konva.Line({
      points: [x0, y0, x0+this.w, y0],
      strokeWidth: 1,
      stroke: 'blueSky',
    });
    this.group.add(bsLine)

    var rectWidth = this.w/this.data.length; // 每个矩形占用的总宽度
    var height = this.h;
    var self = this;
    this.data.forEach(function(item,index) {
      // 生成一个矩形
      var rect = new Konva.Rect({
        x: (1/4+index)*rectWidth,
        y: -item.value*height,
        width: 1/2*rectWidth,
        height: item.value*height,
        fill: item.color,
        opacity: .8,
        cornerRadius: 10,
      });
      self.rectGroup.add(rect)

      // 把百分比的文字放到 柱状图的顶部
      var text = new Konva.Text({
        x: index*rectWidth,
        y: - item.value*height - 14,
        fontSize: 14,
        text: item.value*100 + '%',
        fill: item.color,
        width: rectWidth,
        align: 'center',
        name: 'textPercent'
      })
      self.textPercentGroup.add(text);

      // var group = new Konva.Group({
      //   x: x0 + index*rectWidth,
      //   y: y0 ,
      // })
      // 把文字放到 柱状图的底部
      var text_bottom = new Konva.Text({
        x: x0 + index*rectWidth,
        y: -14,
        fontSize: 14,
        text: item.name,
        fill: item.color,
        width: rectWidth,
        align: 'center',
        rotation: 30,
      })
      self.group.add(text_bottom);

    });
  },
  addToGroupOrLayer: function(arg) {
    arg.add(this.group);
  },
  playAnimate: function() {
    var self = this
    // 让柱状图 y->y0 height: 0
    this.rectGroup.getChildren().each(function(item, index) {
      item.y(0);
      item.height(0);
      // 经过一个动画还原
      item.to({
        duration: 1,
        y: -self.data[index].value*self.h,
        height: self.data[index].value*self.h,
      })
    });
    // 
    this.textPercentGroup.getChildren().each(function(item, index) {
      item.y(-14);
      // 经过一个动画还原
      item.to({
        duration: 1,
        y: -self.data[index].value*self.h - 14,
      })
    });
  }
}