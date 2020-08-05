<template>
	<view>
		<view class="aixin">
			<image :src="aiXinSrc" style="margin-left: 10%;"></image>
			<view class="time">{{setTime}}</view>
		</view>


		<u-popup height="40vh" mode="center" v-model="showSetTime" width="80%">
			<view @click="reStart" class="reStart" v-if="matchType ==1">重新来过吧~</view>
<!--			<view @click="goChat" class="reStart" v-if="matchType ==0">重新来过吧~</view>-->
		</u-popup>
		<u-popup height="100vh" mode="center" v-model="showChat" width="80%">

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
				showChat:false
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
			// clearInterval(this.matchingTime)
		},
		methods:{
			setIntervals(){
				this.time =setInterval(()=>{

					this.setTime=this.setTime-1
					this.matchingTime= setInterval( ()=>{
						console.log('adad')
								// this.matchingTimeFun()
					},2000)
					if (this.setTime <= 0){
						this.showSetTime=true
						// console.log(this.matchingTime)
						clearInterval(this.matchingTime)
						clearInterval(this.time)

					}
				},1000)
			},

		async	matchingTimeFun(){
				const sign =constant.getUserSign()

						var res= await api.getRandomMatchUser({
							query:{
								sign:sign
							}
						})
					console.log(res.data)




				// if (res.data.errcode ==200){
				// 	this.showChat=true
				// 	clearInterval(this.time)
				// 	clearInterval(matchingTime)
				// 	console.log(res.data)
				// 	// setTimeout(()=>{
				// 	// 	uni.redirectTo({
				// 	// 		url: '/pages/chatRoom/chatRoom?roomSign=' + res.data.sign + '&roomName=' + res.data.name + '&chatType=' + 0 + '&avatar=' + res.data.pic + '&matching=' + 'maching'
				// 	// 	});
				// 	// },1000)
				//
				// }else if (this.setTime <= 0){
				// 	this.showSetTime=true
				// 	clearInterval(matchingTime)
				// 	clearInterval(this.time)
				// }


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
</style>
