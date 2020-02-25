var stage = new Konva.Stage({
  container: 'container',
  width: window.innerHeight,
  height: window.innerHeight
});


function addStageEvent() {
  var startX = 0;
  var endY = 0;
  stage.on('contentMousedown', function(e) {
    // console.log(e);
    startY = e.evt.screenY;
  });
  stage.on('contentMousemove', function(e) {
    // console.log(e);
    endY = e.evt.screenY;
  });
  stage.on('contentMouseup', function(e) {
    if (endY > startY) {
      console.log('下滑')
    } else if(endY < startY) {
      console.log('上话')
    }
    // console.log(e);
    endY = e.evt.screenY;
  });
}
