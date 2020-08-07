<template>
    <view class="container">
        <canvas canvas-id="canvasId" id="canvasId" :style="{width: canvasW + 'px',height: canvasH + 'px',backgroundColor:' #ddd'}" @error="canvasIdErrorCallback"></canvas>
    </view>
</template>
<script>

    let hue = 217,
        stars = [],
        count = 0,
        maxStars = 1300;//星星数量

    export default {
        data(){
            return{
                canvasW:0,
                canvasH:0
            }
        },
        onLoad(){
            uni.getSystemInfo({
                success:(res)=>{
                    this.canvasW = res.windowWidth;
                    this.canvasH = res.windowHeight;
                }
            })
        },
        onReady(){
            var context = uni.createCanvasContext('canvasId')

            context.setStrokeStyle("#00ff00")
            context.setLineWidth(5)
            context.rect(0, 0, 200, 200)
            context.stroke()
            context.draw()
        },
        methods:{
            canvasIdErrorCallback: function (e) {
                console.error(e.detail.errMsg)
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>
