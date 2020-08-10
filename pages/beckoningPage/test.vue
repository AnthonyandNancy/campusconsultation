<template>
    <view class="containerBox">
        <!--        <web-view  src="http://www.jq22.com/demo/jQueryBg201705120055/"></web-view>-->

        <view class="container">
            <!--展示星星的画布-->
            <canvas canvas-id="canvasId" id="canvasId" :style="{width: canvasW + 'px',height: canvasH + 'px'}"></canvas>

        </view>
    </view>

</template>
<script>

    let hue = 217,
        stars = [],
        count = 0,
        maxStars = 10,//要绘制的星星数量
        that;
    var lastFrameTime = 0;
    var context = uni.createCanvasContext('canvasId')

    export default {
        data() {
            return {
                canvasW: 0,
                canvasH: 0
            }
        },
        onLoad() {
            uni.getSystemInfo({
                success: (res) => {
                    this.canvasW = res.windowWidth;
                    this.canvasH = res.windowHeight;
                }
            })
        },
        onReady() {
            that = this;
            var half = 100 / 2,
            gradient2 = context.createCircularGradient(75, 50, 50)
            gradient2.addColorStop(0.025, '#CCC');
            gradient2.addColorStop(0.1, '#fff');
            gradient2.addColorStop(0.25, 'transparent');
            gradient2.addColorStop(1, 'transparent');
            context.fillStyle = gradient2;
            context.beginPath();
            context.arc(half + 50, half + 100, half, 0, Math.PI * 2);

            context.closePath();

            // context.arc(234, 250, half, 0, Math.PI * 2);

            context.fill();
            context.draw();

            context.beginPath();
            context.arc(half + 50, half + 100, half, 0, Math.PI * 2);

            context.closePath();

            // context.arc(234, 250, half, 0, Math.PI * 2);

            context.fill();
            context.draw();

        // this.animation();
        //
        // for (var i = 0; i < maxStars; i++) {
        //    new this.Star();
        // }

        },
        methods: {
            //随机绘制星星
            random(min, max) {
                if (arguments.length < 2) {
                    max = min;
                    min = 0;
                }

                if (min > max) {
                    var hold = max;
                    max = min;
                    min = hold;
                }

                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            maxOrbit(x, y) {
                var max = Math.max(x, y),
                    diameter = Math.round(Math.sqrt(max * max + max * max));
                return diameter / 2;
                //星星移动范围，值越大范围越小，
            },

            Star() {
                this.orbitRadius = that.random(that.maxOrbit(that.canvasW, that.canvasH));
                this.radius = that.random(60, this.orbitRadius) / 8;
                //星星大小
                this.orbitX = that.canvasW / 2;
                this.orbitY = that.canvasH / 2;
                this.timePassed = that.random(0, maxStars);
                this.speed = that.random(this.orbitRadius) / 50000;
                //星星移动速度
                this.alpha = that.random(2, 10) / 10;

                //添加绘制原型
                this.__proto__.draw = () => {

                    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
                        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
                        twinkle = that.random(10);

                    if (twinkle === 1 && this.alpha > 0) {
                        this.alpha -= 0.05;
                    } else if (twinkle === 2 && this.alpha < 1) {
                        this.alpha += 0.05;
                    }

                    context.globalAlpha = this.alpha;

                    context.drawImage('https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/draw-image.png?t=201859', x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);

                    console.log('111111111 this.__proto__.draw 111111')
                    this.timePassed += this.speed;
                }
                count++;
                stars[count] = this;
            },
            doAnimationFrame(callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
                var id = setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastFrameTime = currTime + timeToCall;
                return id;
            },
            animation() {

                context.globalCompositeOperation = 'source-over';
                context.globalAlpha = 0.5; //尾巴
                context.fillStyle = '#b2b2b2';
                context.fillRect(0, 0, that.canvasW, that.canvasW)

                context.globalCompositeOperation = 'lighter';
                for (var i = 1, l = stars.length; i < l; i++) {
                    stars[i].draw();
                }
                ;

                that.doAnimationFrame(that.animation);
            }

        }
    }
</script>
<style lang="scss" scoped>
    .containerBox {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0 auto;
        background: url("https://game.xunyi.online/static/SchoolLian/bannerImg/in_top_bj.jpg") no-repeat 100% 100%;
    }
</style>
