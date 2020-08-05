<template>
	<view>
		<view class="aixin">
			<view style="font-size: 24rpx;margin-top: 1%;margin-left: 15%;">有时候爱情来自于缘分,这里可以找到你的有缘人哦~</view>
			<image :src="aiXinSrc" style="margin-left: 10%;"></image>
			<view class="time">{{setTime}}</view>
		</view>


		<u-popup height="40vh" mode="center" v-model="showSetTime" width="80%">
			<view @click="reStart" class="reStart" v-if="matchType ==1">重新来过吧~</view>
<!--			<view @click="goChat" class="reStart" v-if="matchType ==0">重新来过吧~</view>-->
		</u-popup>


		<u-popup height="100%" mode="center" v-model="showChat" width="100%">

				<!--			<view style="width: 100%;height: 100%;font-size: 40rpx;text-align: center;font-family: 'Microsoft YaHei';line-height: 87rpx;">缘分悄咪咪来了~</view>-->

				<view style="margin-top: 44%">
					<image :src="leftsrc" class="leftsrc" size="50vh"></image>
					<image src="../../static/images/staticXin.png" class="middleImg"></image>
					<image :src="Rightsrc" class="Rightsrc" size="50vh"></image>
				</view>
				<view style="font-size: 68rpx;margin-top: 1%;margin-left: 16%;">你们匹配度:{{matchingNum}}%</view>
				<view style="font-size: 24rpx;margin-top: 1%;margin-left: 18%;color: #2B83FF;">马上进入聊天室....</view>
		</u-popup>






	</view>
</template>

<script>
	import constant from "../../utils/constant";
	import api from '../../utils/request/api'
	export default {
		data() {
			return {
				aiXinSrc:'../../static/images/Beckoning.gif',
				setTime:10,
				time:null,
				matchingTime:null,
				showSetTime:false,
				matchType:1,
				showChat:false,
				leftsrc:'../../static/images/peoples.png',
				Rightsrc:'../../static/images/peoples.png',
				matchingNum:10
			};
		},
		onLoad() {
			uni.setNavigationBarTitle({
			    title: '怦然心动'
			})
			this.setIntervals()
		},
		onUnload(){
			clearInterval(this.time)
			clearInterval(this.matchingTime)
		},
		methods:{
			setIntervals(){
				//时间倒计时
				this.time =setInterval(()=>{

					this.setTime=this.setTime-1

				},1000)


				//接口倒计时
				this.matchingTime= setInterval( ()=>{
					console.log('adad',this.setTime)
					this.matchingTimeFun()
					if (this.setTime <= 0){
						// this.showChat=true
						this.showSetTime=true
						clearInterval(this.time)
						clearInterval(this.matchingTime)
					}
				},2000)
			},

		async	matchingTimeFun(){
				const sign =constant.getUserSign()

						var res= await api.getRandomMatchUser({
							query:{
								sign:sign
							}
						})
					console.log(res.data)




				if (res.data.errcode == 200){
					this.aiXinSrc='../../static/images/staticXin.png'
					this.matchingNum=Math.round(Math.random())*100
					let userInfo=	constant.getUserLogin()
					this.leftsrc=userInfo.pic
					this.Rightsrc=res.data.matchUser.pic
					this.showChat=true
					clearInterval(this.time)
					clearInterval(this.matchingTime)
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/chatRoom/chatRoom?roomSign=' + res.data.matchUser.sign + '&roomName=' + res.data.matchUser.name + '&chatType=' + 0 + '&avatar=' + res.data.matchUser.pic + '&matching=' + 'maching'
						});
					},5000)
				}else if (this.setTime <= 0){
					this.showSetTime=true
					clearInterval(this.time)
					clearInterval(this.matchingTime)
				}


			},



			reStart(){
				this.setTime=10
				this.showSetTime=false
				this.setIntervals()

			},
		}
	}
</script>

<style lang="scss" scoped>
.time{
	width: 100%;
	margin-top: 1%;
	font-size: 100rpx;
	text-align: center;
}
	.reStart{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 40rpx;
		line-height: 10vh;
		font-family: "Microsoft YaHei";
		background-color: #2979ff;
	}
	.leftsrc{
		width: 20vh;
		height: 20vh;
		margin-left: 7%;
		border-radius: 10vh;
		/*border: #2B83FF solid;*/
	}
	.middleImg{
		width: 10vh;
		height: 10vh;
	}
	.Rightsrc{
		/*border: #2B83FF solid;*/
		border-radius: 10vh;
		width: 20vh;
		height: 20vh;
	}
</style>
