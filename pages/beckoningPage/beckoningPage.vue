<template>
    <view>
        <view class="aixin">
            <view style="font-size: 24rpx;margin-top: 1%;margin-left: 15%;color: #ffff;">有时候爱情来自于缘分,这里可以找到你的有缘人哦~</view>
<!--            <image :src="aiXinSrc" style="margin: 0 auto;"></image>-->
            <view style="height: 50vh;width: 50vh;border: #AAAAAA solid  1rpx;border-radius: 50%;margin: 10rpx auto;"></view>
            <view style="height: 40vh;width: 40vh;border: #AAAAAA solid 1rpx;border-radius: 50%;margin: -75% auto"></view>
            <view style="height: 30vh;width: 30vh;border: #AAAAAA solid 1rpx;border-radius: 50%;margin: 18% auto"></view>
            <view style="height: 20vh;width: 20vh;border: #AAAAAA solid 1rpx;border-radius: 50%;margin: -59%auto"></view>


            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3882965100,1215744740&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 31%;left: 6%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3137788164,3047565970&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 6%;left: 43%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2176278262,3880914969&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 12%;left: 58%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1425556110,3594995578&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 25%;left: 75%;border-radius: 50%;" v-if="showOnce ==2"></image>
            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3715266424,2105950746&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 39%;left: 54%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1408754782,2716501159&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 18%;left: 8%;border-radius: 50%;" v-if="showOnce ==2"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3010381143,3139585776&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 20%;left: 20%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2972292751,477878368&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 50%;left: 55%;border-radius: 50%;" v-if="showOnce ==1"></image>


            <image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1491243003,3243338389&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 6%;left: 20%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2424276626,1818680797&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 6%;left: 43%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2877389213,2599167416&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 39%;left: 27%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3845519701,2443907131&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 22%;left: 78%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1555549871,3534027392&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 44%;left: 68%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2382918433,2255241348&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 8%;left: 46%;border-radius: 50%;" v-if="showOnce ==2"></image>
            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=152159322,843580480&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 20%;left: 69%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2373957739,3101362962&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 4%;left: 50%;border-radius: 50%;" v-if="showOnce ==0"></image>

            <image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1935305313,1780754080&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 20%;left: 6%;border-radius: 50%;" v-if="showOnce ==2"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=160904937,292575384&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 30%;left: 43%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3791410418,1422775378&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 28%;left: 58%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2196335857,1963202493&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 38%;left: 75%;border-radius: 50%;" v-if="showOnce ==2"></image>
            <image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3307215210,3880575437&fm=11&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 27%;left: 78%;border-radius: 50%;" v-if="showOnce ==1"></image>
            <image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1741910632,706818033&fm=11&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 44%;left: 30%;border-radius: 50%;" v-if="showOnce ==0"></image>
            <image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2459304394,2737429761&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 20%;left: 66%;border-radius: 50%;" v-if="showOnce ==2"></image>
            <image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3118284406,1254551003&fm=26&gp=0.jpg" style="width: 5vh;height: 5vh;position: absolute;top: 45%;left: 25%;border-radius: 50%;" v-if="showOnce ==2"></image>



            <view class="time">{{setTime}}</view>
        </view>


        <u-popup height="40vh" mode="center" v-model="showSetTime" width="80%">
            <view @click="reStart" class="reStart" v-if="matchType ==1">有缘人还在等你哦~</view>
            <!--			<view @click="goChat" class="reStart" v-if="matchType ==0">重新来过吧~</view>-->
        </u-popup>


        <u-popup height="100%" mode="center" v-model="showChat" width="100%">

            			<view style="width: 100%;height: 100%;font-family: 'Microsoft YaHei';background: linear-gradient(to bottom,#ad82db,pink);">

                            <view style="margin-top: 0%">
                                <image :src="leftsrc" class="leftsrc" size="50vh"></image>
<!--                                <image src="../../static/images/staticXin.png" class="middleImg"></image>-->
                                <view class="middleImg"></view>
                                <image :src="Rightsrc" class="Rightsrc" size="50vh"></image>
                            </view>
                            <view style="font-size: 68rpx;margin-top: 78%;margin-left: 16%;">你们匹配度:{{matchingNum}}%</view>
                            <view style="font-size: 34rpx;margin-top: 1%;margin-left: 18%;color: white;">Waiting....</view>
                            <view style="font-size: 18px;margin-top: 28vh;margin-left: 31%;color: #ffff;">马上进入聊天室....</view>
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
                setTime: 10,
                time: null,
                matchingTime: null,
                showSetTime: false,
                matchType: 1,
                showChat: false,
                leftsrc: '../../static/images/peoples.png',
                Rightsrc: '../../static/images/peoples.png',
                matchingNum: null,
                showOnce:2
            };
        },
        onLoad() {
            uni.setNavigationBarTitle({
                title: '怦然心动'
            })
            this.setIntervals()
            this.setImage()
        },
        onUnload() {
            clearInterval(this.time)
            clearInterval(this.matchingTime)
        },
        methods: {
            /*头像闪烁*/
            setImage(){
                //第一次
                setTimeout(()=>{
                    this.showOnce=1
                },1500)

                setTimeout(()=>{
                    this.showOnce=2
                },2500)

                setTimeout(()=>{
                    this.showOnce=0
                },3500)

                setTimeout(()=>{
                    this.showOnce=1
                },4500)

                setTimeout(()=>{
                    this.showOnce=0
                },5500)

                setTimeout(()=>{
                    this.showOnce=2
                },6500)

                setTimeout(()=>{
                    this.showOnce=0
                },7500)


                setTimeout(()=>{
                    this.showOnce=1
                },8500)

                setTimeout(()=>{
                    this.showOnce=0
                },9500)


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
                        // this.showChat=true
                        this.showSetTime = true
                        clearInterval(this.time)
                        clearInterval(this.matchingTime)
                    }
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
                    var num=Math.random();
                    this.matchingNum =(num.toFixed(2))*100;
                    let userInfo = constant.getUserLogin()
                    this.leftsrc = userInfo.pic
                    this.Rightsrc = res.data.matchUser.pic
                    this.showChat = true
                    clearInterval(this.time)
                    clearInterval(this.matchingTime)
                    setTimeout(() => {
                        uni.redirectTo({
                            url: '/pages/chatRoom/chatRoom?roomSign=' + res.data.matchUser.sign + '&roomName=' + res.data.matchUser.name + '&chatType=' + 0 + '&avatar=' + res.data.matchUser.pic + '&matching=' + 'maching'
                        });
                        this.matchingNum=null
                    }, 5000)
                } else if (this.setTime <= 0) {
                    this.showSetTime = true
                    clearInterval(this.time)
                    clearInterval(this.matchingTime)
                }


            },



            reStart() {
                this.setTime = 10
                this.showSetTime = false
                this.setIntervals()
                this.setImage()
            },
        }
    }
</script>

<style lang="scss" scoped>
    .aixin{
        /*background-image: url("../../static/images/starrysky.jpg");*/
        background: url("https://cdn4game.xunyi.online/static/SchoolLian/uploadFiles/137ffbd21dcea52f5abfe7793e43eaa4.png") no-repeat fixed center;
        height: 100vh;
    }
    .time {
        margin-top: 39%;
        font-size: 50rpx;
        text-align: center;

    }

    .reStart {
        width: 100%;
        height: 100%;
        text-align: center;
        font-size: 53rpx;
        line-height: 10vh;
        font-family: "Microsoft YaHei";

    }

    .leftsrc {
        width: 20vh;
        height: 20vh;
        position: absolute;
        top: 31%;
        left: 6%;
        border-radius: 10vh;


        /*border: #2B83FF solid;*/
    }

    .Rightsrc {
        /*border: #2B83FF solid;*/
        border-radius: 10vh;
        width: 20vh;
        height: 20vh;
        position: absolute;
        top: 31%;
        left: 62%;


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
    .middleImg:after{
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
