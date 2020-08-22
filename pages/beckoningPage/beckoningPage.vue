<template>
    <view>
        <div class="stars-wrapper">
            <view class="stars">
                <view :class="'star' + (index+1)" style="" v-for="(item,index) in 150" :key="index"></view>
            </view>
            <view class="stars">
                <view :class="'star' + (index+1)" style="" v-for="(item,index) in 150" :key="index"></view>
            </view>
        </div>
        <view class="aixin">
            <view style="font-size: 24rpx; text-align: center; margin:40rpx 0;color: #ffff;">有时候爱情来自于缘分,这里可以找到你的有缘人哦~
            </view>
            <view style="position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%); height: 50vh;width: 50vh;border: #AAAAAA solid  1rpx;border-radius: 50%; "></view>
            <view style="position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);height: 40vh;width: 40vh;border: #AAAAAA solid 1rpx;border-radius: 50%;"></view>
            <view style="position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);height: 30vh;width: 30vh;border: #AAAAAA solid 1rpx;border-radius: 50%;"></view>
            <view style="position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);height: 20vh;width: 20vh;border: #AAAAAA solid 1rpx;border-radius: 50%;"></view>


            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3882965100,1215744740&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 41%;left: 6%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3137788164,3047565970&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 26%;left: 43%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2176278262,3880914969&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 67%;left: 58%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1425556110,3594995578&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 35%;left: 75%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>
            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3715266424,2105950746&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 39%;left: 54%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1408754782,2716501159&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 32%;left: 29%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3010381143,3139585776&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 34%;left: 20%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2972292751,477878368&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 60%;left: 55%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>


            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1491243003,3243338389&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 64%;left: 20%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2424276626,1818680797&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 71%;left: 43%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2877389213,2599167416&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 49%;left: 27%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3845519701,2443907131&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 32%;left: 78%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1555549871,3534027392&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 54%;left: 68%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2382918433,2255241348&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 71%;left: 46%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>
            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=152159322,843580480&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 30%;left: 69%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2373957739,3101362962&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 57%;left: 50%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>

            <image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1935305313,1780754080&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 50%;left: 6%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=160904937,292575384&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 40%;left: 43%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3791410418,1422775378&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 38%;left: 27%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2196335857,1963202493&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 48%;left: 75%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>
            <image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3307215210,3880575437&fm=11&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 37%;left: 78%;border-radius: 50%;"
                   v-if="showOnce ==1"></image>
            <image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1741910632,706818033&fm=11&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 54%;left: 30%;border-radius: 50%;"
                   v-if="showOnce ==0"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2459304394,2737429761&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 30%;left: 66%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3118284406,1254551003&fm=26&gp=0.jpg"
                   style="width: 5vh;height: 5vh;position: absolute;top: 55%;left: 25%;border-radius: 50%;"
                   v-if="showOnce ==2"></image>


            <view class="time">{{setTime}}</view>
            <view>
                <button class="continue" @click="reStart" v-if="showSetTime">继续等待~</button>
            </view>
        </view>

        <u-popup height="100%" mode="center" v-model="showChat" width="100%">


            <view class="matchingBox">
                <view class="matching">

                    <view class="popLeft">

                        <view class="matchingLeftImgBox">
                            <view class="popLeftBg">
                                <image src="/static/images/boy.png" class="auto-img" mode="aspectFit"></image>
                            </view>
                            <view class="leftSrc">
                                <image :src="leftsrc" class="auto-img" mode="aspectFit"></image>
                            </view>
                        </view>

                        <view class="matchingUser">{{userName}}</view>
                    </view>


                    <view class="popRight">

                        <view class="matchingRightImgBox">
                            <view class="popRightBg">
                                <image src="/static/images/girl.png" class="auto-img" mode="aspectFit"></image>
                            </view>
                            <view class="rightSrc">
                                <image :src="Rightsrc" class="auto-img" mode="aspectFit"></image>
                            </view>
                        </view>

                        <view class="matchingUser">{{matchingName}}</view>
                    </view>

                </view>

                <view class="matchingSuccess">
                    还有{{lastTime}}秒马上进入聊天室....
                </view>
            </view>




        </u-popup>


    </view>
</template>

<script>
    import constant from "../../utils/constant";
    import api from '../../utils/request/api'

    export default {
        data() {
            return {
                aiXinSrc: '../../static/images/Beckoning.gif',
                setTime: 30,
                time: null,
                matchingTime: null,
                matchingTimeInterval: null,
                showSetTime: false,
                matchType: 1,
                showChat: false,
                leftsrc: '../../static/images/peoples.png',
                Rightsrc: '../../static/images/peoples.png',
                matchingNum: null,
                showOnce: 0,


                matchingName: '郭建林',
                userName: '郭建林',
                lastTime: 3
            };
        },
        onLoad() {
            uni.setNavigationBarTitle({
                title: '怦然心动'
            })
            this.setIntervals()

            this.setImage()

            setTimeout(() => {
                this.setImage()
            }, 10000)
            setTimeout(() => {
                this.setImage()
            }, 20000)

        },
        onUnload() {
            clearInterval(this.time)
            clearInterval(this.matchingTime)
        },
        methods: {
            /*头像闪烁*/
            setImage() {
                //第一次
                setTimeout(() => {
                    this.showOnce = 1
                }, 1500)

                setTimeout(() => {
                    this.showOnce = 2
                }, 2500)

                setTimeout(() => {
                    this.showOnce = 0
                }, 3500)

                setTimeout(() => {
                    this.showOnce = 1
                }, 4500)

                setTimeout(() => {
                    this.showOnce = 0
                }, 5500)

                setTimeout(() => {
                    this.showOnce = 2
                }, 6500)

                setTimeout(() => {
                    this.showOnce = 0
                }, 7500)


                setTimeout(() => {
                    this.showOnce = 1
                }, 8500)

                setTimeout(() => {
                    this.showOnce = 0
                }, 9500)


            },

            setIntervals() {
                //时间倒计时
                this.time = setInterval(() => {

                    this.setTime = this.setTime - 1

                }, 1000)


                //接口倒计时
                this.matchingTime = setInterval(() => {
                    console.log('adad', this.setTime)
                    this.matchingTimeFun()

                    if (this.setTime <= 0) {

                        // 测试2
                        this.showSetTime = true
                        clearInterval(this.time)
                    }
                    let timesLeave = this.setTime;
                    new Promise((resolve, reject) => {
                        if (this.setTime == 0) {
                            --timesLeave;
                            resolve(timesLeave)
                        }
                    }).then(res => {
                        if (res > -2) {
                            // this.showChat=true
                            clearInterval(this.matchingTime)
                        }
                    })


                }, 2000)
            },

            async matchingTimeFun() {
                const sign = constant.getUserSign()

                var res = await api.getRandomMatchUser({
                    query: {
                        sign: sign
                    }
                })
                console.log(res.data)


                if (res.data.errcode == 200) {
                    this.aiXinSrc = '../../static/images/staticXin.png'
                    var num = Math.random();
                    this.matchingNum = (num.toFixed(2)) * 100;
                    let userInfo = constant.getUserLogin()
                    this.userName = userInfo.name
                    this.matchingName = res.data.matchUser.name
                    this.leftsrc = userInfo.pic
                    this.Rightsrc = res.data.matchUser.pic
                    this.showChat = true
                    this.matchingTimeGetFun()
                    clearInterval(this.time)
                    clearInterval(this.matchingTime)
                    setTimeout(() => {
                        uni.redirectTo({
                            url: '/pages/chatRoom/chatRoom?roomSign=' + res.data.matchUser.sign + '&roomName=' + res.data.matchUser.name + '&chatType=' + 0 + '&avatar=' + res.data.matchUser.pic + '&matching=' + 'matching'
                        });
                        this.matchingNum = null
                    }, 3000)
                } else if (this.setTime <= 0) {
                    this.showSetTime = true
                    clearInterval(this.time)
                    clearInterval(this.matchingTime)
                }


            },

            matchingTimeGetFun() {
                //匹配到时间倒计时
                let matchingTimeInterval = setInterval(() => {
                    if (this.lastTime <= 0) {
                        clearInterval(matchingTimeInterval)
                    } else {
                        this.lastTime = this.lastTime - 1
                    }


                }, 1000)

            },


            reStart() {
                this.setTime = 30
                this.showSetTime = false

                this.setIntervals()
                this.setImage()
                setTimeout(() => {
                    this.setImage()
                }, 10000)
                setTimeout(() => {
                    this.setImage()
                }, 20000)
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../static/style.css';

    .aixin {
        position: fixed;
        height: 100vh;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }

    .time {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 50rpx;
        text-align: center;
        color: rgba(213, 165, 253, 0.9);
        font-weight: 600;
    }

    .stars {
        @for $i from 1 to 150 {
            $myWidth: floor(3 + random() *(7-3)) + 'rpx !important';
            .star#{$i} {
                width: #{$myWidth};
                height: #{$myWidth};
                transform: translate(#{floor(1 + random()  * (600 - 1)) + 'px'}, #{floor(1 + random()  * (200 - 1)) + 'px'});
                background-color: #FFFFFF;
                border-radius: 100% !important;
            }

            .star#{$i}:nth-child(3n) {
                opacity: 0.8;
            }
            .star#{$i}:nth-child(7n) {
                opacity: 0.6;
            }
            .star#{$i}:nth-child(13n) {
                opacity: 0.4;
            }
            .star#{$i}:nth-child(19n) {
                opacity: 0.2;
            }
        }
    }

    .continue {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10%;
        width: 440rpx;
        height: 100rpx;
        background-color: rgba(213, 165, 253, 0.9);
        text-align: center;
        color: #FFFFFF;
        line-height: 100rpx;
    }


    .matchingBox {
        width: 100%;
        height: 100vh;
        font-family: 'Microsoft YaHei';
        background: url('/static/images/BG@2x.png');
        background-size: 100% 100%;

        .matching {
            display: flex;
            justify-content: center;
            width: 100%;
            padding-top: 280rpx;

        }

        .popLeft {
            flex: 1;

            .matchingLeftImgBox{
                position: relative;
                width: 320rpx;
                height: 264rpx;
                left: 50%;
                transform: translateX(-50%);

            }

            .popLeftBg {
                position: absolute;
                width: 320rpx;
                height: 264rpx;
                margin-left: 10rpx;
            }

            .leftSrc {
                position: absolute;
                width: 180rpx;
                height: 180rpx;
                right: 75rpx;
                bottom: 0;
                border-radius:100% ;
                overflow: hidden;
                z-index: -1;
            }
        }

        .popRight {
            flex: 1;
            .matchingRightImgBox{
                position: relative;
                width: 320rpx;
                height: 264rpx;
                left: 50%;
                transform: translateX(-50%);
            }

            .popRightBg {
                position: absolute;
                width: 320rpx;
                height: 264rpx;
                margin: 0 auto;
                margin-left: 10rpx;
            }

            .rightSrc {
                position: absolute;
                width: 180rpx;
                height: 180rpx;
                left: 75rpx;
                bottom: 0;
                border-radius:100% ;
                overflow: hidden;
                z-index: -1;
            }
        }
        .matchingUser {
            margin-top: 20rpx;
            text-align: center;
            font-size:32rpx;
            font-family:Source Han Sans SC;
            font-weight:400;
            color:rgba(255,255,255,1);
            letter-spacing:2px;
        }
    }

    .matchingSuccess{
        font-size: 18px;
        color: #ffff;
        text-align: center;
        background:rgba(255,255,255,0.1);
        border-radius:26px;
        width: 466rpx;
        height: 104rpx;
        margin:  274rpx auto 0;
        line-height:104rpx ;
    }

    .middleImg {
        width: 5vh;
        height: 5vh;
        position: relative;
        top: 43vh;
        left: 46%;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        background-color: tomato;
    }


    .middleImg:before {
        content: "";
        position: absolute;
        top: -31rpx;
        left: 0;
        width: 5vh;
        height: 5vh;
        border-radius: 50%;
        background-color: tomato;
    }

    .middleImg:after {
        content: "";
        position: absolute;
        top: 0px;
        left: 33rpx;
        width: 5vh;
        height: 5vh;
        background-color: tomato;
        border-radius: 50%;
    }

</style>
