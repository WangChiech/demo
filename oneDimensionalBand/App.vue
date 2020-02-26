<template>
    <div>
        <OneDimBand :bandData="bandData"></OneDimBand>
    </div>
</template>

<script>
import OneDimBand from './one-dem-band'
export default {
    components: {
        OneDimBand
    },
    data () {
        return {
            bandData: {
                cWidth: 800, // band 宽度
                cLevel: 5, // band 允许的最大级数
                bandList: [
                    { name: 'A', value: '10', color: 'blueSky'},
                    { name: 'B', value: '10', color: 'blue'},
                    { name: 'C', value: '10', color: 'red'},
                    { name: 'D', value: '20', color: 'orange'},
                    { name: 'E', value: '50', color: 'purple'},
                ]
            }
        }
    }
}
</script>