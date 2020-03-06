function ProgressBar (option) {
  this._init(option);
}

ProgressBar.prototype = {
  // 类初始化的时候：创建内部矩形，外部矩形，然后把两个矩形放到group里面去
  _init: function (option) {
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.w = option.w || 0;
    this.h = option.h || 0;
    
    this.fillStyle = option.fillStyle || 'red';
    this.strokeStyle = option.strokeStyle || 'red';

    // 定义内部的进度条矩形
    var innerRect = new Konva.Rect({
      x: this.x, // stage.width(),获取当前舞台宽度
      y: this.y,
      width: 1/2*this.w,
      height: this.h,
      fill: this.fillStyle,
      cornerRadius: 1/2*this.h,
      id: 'innerRect',
    });

    // 添加一个外边框矩形
    var outerRect = new Konva.Rect({
      x: this.x,
      y: this.y,
      width: this.w,
      height: this.h,
      stroke: this.strokeStyle,
      strokeWidth: 4,
      cornerRadius: 1/2*this.h
    });

    this.group = new Konva.Group({
      x: 0,
      y: 0
    })
    this.group.add(innerRect);
    this.group.add(outerRect);
  },
  changeValue: function(val) {
    // 传进来的进度条
    if (val > 1) {
      val = val /100
    }
    // 做动画 val = .3 .7
    var width = this.w * val; // 最终进度条内部矩形的 宽度
    var innerRect = this.group.findOne('#innerRect')
    // to 动画系统： 让我们的物件变换到某个状态
    innerRect.to({
      width: width,
      duration: .3,
      easing: Konva.Easings.EasIn,
    })
  },
  addToGroupOrLayer: function(arg) {
    arg.add(this.group)
  }
}
