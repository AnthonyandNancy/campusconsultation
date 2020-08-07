import api from '../../utils/request/api'
import emojiJs from '../../utils/emoji'
import user from '../../utils/constant'
export default {

		data() {
			return {
				scrollTop:0,
				old: {
					scrollTop: 0
				},
				chatList:[],
				chatMessage:'',
				sendChatMessage:'',
				emojiList:[],
				emojiShow:false,
				autoplay:false,
				pictureShow:false,
				type: 'textarea',
				border: true,
				height:-3,
				autoHeight: true,
				sys:0,
				chatDisable:false,
				emojiJs:emojiJs,
				emojiId:0,
				emojiName:[],
				userInfo:[],
				userInfoSign:'',
				avatar:'',
				userName:'',
				getMsg:[],
				chatImg:'',
				tempFilePaths:'',
				getSign:[],
				tempVideoFilePaths:'',
				textAreaShow:0,
				sendPensonChatMsg:false,
				snedContent:'是否发起与xxx 的私聊',
				roomSign:''
			}
		},
		onLoad(option) {
			this.roomSign = option.roomSign;
			console.log('onLoad房间的sign',option)
			uni.connectSocket({
				url: 'wss://pets.neargh.com/tucaolove/ws/chat/'+option.roomSign,
				success:res=>{
					console.log('wss链接成功',res)

				},
				fail:err=>{
					console.log('wss链接失败',err)
				}

			});
			uni.setNavigationBarTitle({
				title: option.roomName
			});
			// this.emoji()
			const length=this.chatList.length
			this.scrollTop=1000*length
			uni.getSystemInfo({
				success: (res) => {
					// console.log('systemInfo', res.platform);
					const sys=res.platform
					if (sys == 'android' || sys == 'devtools'){
						this.sys =1
						this.height=30
						// console.log(this.height)
					}

					// this.viewHeight = res.windowHeight;
				}

			});
			//用户信息
			this.userInfo=user.getUserInfo()
			this.avatar=this.userInfo.pic
			this.userName=this.userInfo.name
			// this.chatList.map((e)=>{
			// 	// console.log(e.type)
			// 	// console.log(this.userInfo)
			// 	if (e.type == 'my'){
			// 		e.avatar=this.userInfo.pic
			// 		// this.avatar=this.userInfo.pic
			//
			// 	}
			// })
			this.userInfoSign=user.getUserSign()


		},
		onUnload(){
			// console.log('页面关闭了')
			uni.closeSocket({
				success:res=>{console.log(res)},
				fail:err=>{console.log(err)}
				})
			uni.onSocketClose(
				(res) =>{
				console.log('WebSocket 已关闭！');
				},

			)

		},
		onReady(){

		uni.onSocketMessage((res) =>{
			// this.getMsg.push(JSON.parse(res.data))
			// console.log(JSON.parse(res.data))
			const resMsg=JSON.parse(res.data).message
			this.getSign=JSON.parse(res.data).sign
				resMsg.type = 'orther'
			if (this.getSign != this.userInfoSign ){
				this.chatList.push(resMsg)

			}
			const getLength=this.chatList.length
			this.scrollTop=1500*getLength
			console.log('wss回来的数据1>1',resMsg)
			console.log('wss回来的本地数据2>2',this.chatList)
			// console.log(this.getSign.length)

		});
	},

		methods: {
			upper: function(e) {
				// console.log(e)
			},
			lower: function(e) {
				// console.log(e)
			},
			scroll: function(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			//进入私人聊天
			toPersonalChat(){
				this.snedContent = true;
			},
			// emoji() {
			// 		// const emojiList=[]
			// 	for (var i=0;i<=97;i++){
			// 		// ../../static/images/emoji/1.gif
			// 		const emojiList=[]
			//
			// 		// const emoji='../../static/images/emoji/'+[i]+'.gif'
			// 		const emoji='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/'+[i]+'.gif'
			// 		// console.log(emoji)
			// 		// console.log('"../../static/images/emoji/'+[i]+'.gif"')
			//
			// 		this.emojiList.push(emoji)
			// 		// console.log(this.emojiList)
			//
			// 	}
			//
			//
			// },
			showEmoji(){
				this.chatDisable=true
				this.emojiShow=true
				this.textAreaShow=1
			},
			//选择了emoji
			//左边
			chooseEmojiLeft(e){
				// console.log(e)
				const nowEmoji=e
				this.emojiJs.map((val)=>{
					if (nowEmoji == val.id){
						// console.log(val.name)
						this.chatMessage=this.chatMessage+val.name
					}
				})

			},

			//发送消息
			sendMessage(){
				// console.log(this.sendChatMessage)
				// console.log(this.chatMessage)
				this.emojiRe(this.chatMessage)
				if (this.chatMessage == ''){
					return
				}
				const options={
					type:"my",
					sign:this.userInfoSign,
					avatar:this.avatar,
					content: this.chatMessage,
					chatType:0,
					name:this.userName
				}

				this.chatList.push(options)
				// console.log('本地缓存',this.chatList)
				const length=this.chatList.length
				this.scrollTop=1500*length
				//通讯
				const timestamp = Date.parse(new Date());
				const msgData= {
					message: options,
					chatType: 0,
					name:this.userName,
					pic:this.avatar,
					timestamp:timestamp,
					sign:this.userInfoSign,
					roomId:this.roomSign
				}
				console.log('发送备点用')
				uni.sendSocketMessage({
					data:JSON.stringify(msgData),
					success:res=>{
						// console.log('4515',res)
					},
					fail:err=>{
						// console.log('454',err)
					}
				});
				this.chatMessage=''




			},
			emojiRe(val){
				// console.log(val)
				for (let i =0;i<this.emojiJs.length;i++){
					let n = val.indexOf(this.emojiJs[i].name);
					while (n >=0){
						this.chatMessage=this.chatMessage.replace(this.emojiJs[i].name,`<img src='${this.emojiJs[i].src}'/>`)
						n = this.chatMessage.indexOf(this.emojiJs[i].name);
					}
				}
				return val

			},

			//打开拍摄
			openPic(){
				this.chatDisable=true
				this.pictureShow=true
				this.textAreaShow=1
			},
			//打开相册
		async openAlbum(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					 success: res=> {
						this.pictureShow=false
						// tempFilePath可以作为img标签的src属性显示图片
						this.tempFilePaths = res.tempFilePaths[0]
						 const tempFilePaths=res.tempFilePaths
						 // console.log(this.tempFilePaths)
						 //网路请求
						 this.upLoadImg()

					}
				})
			},

		async upLoadImg(){
				console.log('>>>>>>>>>><><>',this.tempFilePaths)
			// console.log(this.userInfoSign)
			console.log('图片已经发送')
			// // 本地渲染
			const localOptions={
				type:"my",
				sign:this.userInfoSign,
				avatar:this.avatar,
				content:this.tempFilePaths,
				chatType:1,
				name:this.userName
			}
			// console.log('本地渲染',localOptions)
			this.chatList.push(localOptions)
			const length=this.chatList.length
			this.scrollTop=1500*length
				//upload图片
			let resImg = await api.uploadImages({
				query:{
					data: {sign: this.userInfoSign},
					filePath: this.tempFilePaths,
					key: 'img'
				}
			})
				// console.log(JSON.parse(resImg.data))
			const Status=JSON.parse(resImg.data).errcode
			const chatImg=JSON.parse(resImg.data).img
			if (Status == 200){

				// //通讯
				// //wss
				const onlineOption={
					type:"my",
					sign:this.userInfoSign,
					avatar:this.avatar,
					content: chatImg,
					chatType:1,
					name:this.userName
				}
				const timestamp = Date.parse(new Date());
				const msgData= {
					message: onlineOption,
					chatType: 1,
					name:this.userName,
					pic:this.avatar,
					timestamp:timestamp,
					sign:this.userInfoSign,
					roomId:"happycutpet",
				}
				uni.sendSocketMessage({
					data:JSON.stringify(msgData),
					success:res=>{
						// console.log('4515',res)
					},
					fail:err=>{
						// console.log('454',err)
					}
				});
			}
			},
			//打开拍摄
			openCamera(){
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: (res)=> {
					const video = res.tempFilePath;
						// console.log(video)
					this.tempVideoFilePaths= video
						// console.log(this.tempVideoFilePaths)

					this.upLoadViedo()
						this.pictureShow=false
					}
				});
			},
			//
		async upLoadViedo(){
			// // 本地渲染
			const localOptions={
				type:"my",
				sign:this.userInfoSign,
				avatar:this.avatar,
				content:this.tempVideoFilePaths,
				chatType:3,
				name:this.userName
			}
			// console.log('本地渲染',localOptions)
			this.chatList.push(localOptions)
			const length=this.chatList.length
			this.scrollTop=1500*length
				// console.log(this.tempVideoFilePaths)
				let resViedo = await api.uploadVideoFile({
					query:{
						data: {sign: this.userInfoSign},
						filePath: this.tempVideoFilePaths,
						key: 'file'
					}
				})
				// console.log(JSON.parse(resViedo.data))
				const Status=JSON.parse(resViedo.data).errcode
				const chatViedo=JSON.parse(resViedo.data).url
				if (Status == 200){
					console.log('视频已经发送')

					// //通讯
					// //wss
					const onlineOption={
						type:"my",
						sign:this.userInfoSign,
						avatar:this.avatar,
						content: chatViedo,
						chatType:3,
						name:this.userName
					}
					const timestamp = Date.parse(new Date());
					const msgData= {
						message: onlineOption,
						chatType: 3,
						name:this.userName,
						pic:this.avatar,
						timestamp:timestamp,
						sign:this.userInfoSign,
						roomId:"happycutpet",
					}
					uni.sendSocketMessage({
						data:JSON.stringify(msgData),
						success:res=>{
							// console.log('4515',res)
						},
						fail:err=>{
							// console.log('454',err)
						}
					});
				}
			},

			//视频播放出错
			videoErrorCallback(){
				console.log('视频播放出错')
			},
			picClose(){
				this.chatDisable=false
				// console.log('关闭')
				this.textAreaShow=0
			},
			emojiClose(){
				this.chatDisable=false
				this.textAreaShow=0
				// console.log('关闭')
			},


			textAreaChanged(){
				// console.log('变化了')
			}


		}
	}

/*
* {"info":"获取成功",
* "followNum":0,
* "name":"Anthony",
* "configParams":null
* ,"schoolName":"中山大学",
* "jumpPage":1,
* "addTime":"2020-07-17 09:47:06",
* "pic":"https://wx.qlogo.cn/mmopen/vi_32/rBq4kRiamvMOUxJaByRnQzV7V9WGIkogzdj2Uu3cZHSs46P4ps4ibyKLH8HlkxCIvtYSnuDxjehKoZ1jBxdks8Eg/132",
* "errcode":200,"sign":"f4a9641e5fb23fc3ffb4a3e6a4d6b45e32db677e","dynamicNum":0,"decorate":6,"isValid":false,"followerNum":0,"lastTime":1594950426000,"inAudit":true}
* */
