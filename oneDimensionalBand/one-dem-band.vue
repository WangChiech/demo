<template>
    <div class="one-dimensional-band">
        <div id="container"></div>
    </div>
</template>


<script>
import Vue from 'vue'
import Konva from 'konva'
Vue.use(Konva)
export default {
    name: 'OneDimBand',
    props: {
        bandData: {
            type: Object,
            default: () => {} 
        }
    },
    mounted () {
        console.log(this.bandData)
        this.initBand()
    },
    computed : {
        
    },
    data () { 
        return {
            
        }
    },
    methods: {
        initBand () {
            // 创建舞台
            const stage = new Konva.Stage({
                container: 'container',
                width: window.innerWidth,
                height: window.innerHeight
            });

            // 创建层
            const layer = new Konva.Layer();
            stage.add(layer);

            // 中心点坐标
            const cenX = stage.width()/2;
            const cenY = stage.height()/2;
            
            // 饼状图数据
            const data = [
                { name: '前端', value: '.25', color: 'green'},
                { name: 'php', value: '.2', color: 'blue'},
                { name: 'java', value: '.3', color: 'red'},
                { name: 'ui', value: '.05', color: 'orange'},
                { name: 'ios', value: '.1', color: 'purple'},
                { name: 'android', value: '.1', color: 'pink'},
            ];

            var x0 = cenX,
                y0 = cenY;

            // var group = new Konva.Group({
            //   x: x0,
            //   y: y0
            // })
            var tempAngle = -90;
            var textAngle = -45;
            data.forEach(function(item,index) {
                var wedge = new Konva.Wedge({
                    x: x0,
                    y: y0,
                    angle: 360*item.value,
                    radius: 100,
                    fill: item.color,
                    rotation: tempAngle,
                });
                textAngle = tempAngle + 360*item.value/2;
                tempAngle += item.value*360;
                layer.add(wedge);
                
                
                var text = new Konva.Text({
                    x: x0 +Math.cos(Math.PI*textAngle/180)*(140),
                    y: y0 +Math.sin(Math.PI*textAngle/180)*(120),
                    text: item.name,
                    fill: item.color,
                });
                if (textAngle > 90 && textAngle< 270) {
                    text.x(text.x()-text.getWidth());
                }
                layer.add(text)
            });
            var cir = new Konva.Circle({
                x: x0,
                y: y0,
                radius: 110,
                stroke: '#ccc',
                strokeWidth: 2
            });
            layer.add(cir)
            layer.draw();
            stage.on('contentMouseup',()=>{
                console.log('stage.click')
            })
        },
        text () {
            console.log('zujian')
        }
    }
    
}
</script>

<style lang="stylus">
 #container
    display inline-block
    width 100px
    height 100px
    background-color red
</style>