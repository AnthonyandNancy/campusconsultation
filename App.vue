<script>
    import constant from './utils/constant';
    import api from './utils/request/api';

    export default {
        data() {
            return {
                msgList: [],
            };
        },
		onHide(){

		const sign =constant.getUserLogin()
		console.log('onHide检测链接失败',sign)
		uni.onSocketClose(()=>{
			let interval=setInterval(()=>{
				uni.connectSocket({
				    url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
				    success: res => {
						console.log('onHide检测重连接成功', res)
				        clearInterval(interval)
				    },
				    fail: err => {
				        console.log('onHide检测重连接失败', err)
				    }

				});
			},1000)
		})
		},
        onLaunch: async function () {
            if (constant.getUserLogin().length != 0) {
                if (constant.getUserLogin().schoolName != null) {
                    uni.switchTab({
                        url: '/pages/tabbel/home/home'
                    })
                }
            }

            await uni.login({
                success: res => {
                    let {errMsg, code} = res;
                    if (errMsg == "login:ok") {
                        this.getLogin(code)
                    }

                }
            })

        },
        methods: {
            async getLogin(jscode) {
                let json = await api.getLogin({
                    query: {
                        code: jscode,
                        version: '1.0'
                    }
                })
                let {errcode, sign, schoolName} = json.data;

                if (schoolName != null) {
                    uni.switchTab({
                        url: '/pages/tabbel/home/home'
                    })
                }

                if (errcode == 200) {
                    uni.connectSocket({
                        url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                        success: res => {
                            uni.onSocketMessage((res) => {
                                const resData = JSON.parse(res.data)
                                const resDataMsg = JSON.parse(res.data).message
                                if (resData.roomType == 0) {
                                    let sign = resData.roomId
                                    let userTag = 'chatList:' + sign

                                    uni.getStorage({
                                        key: userTag,
                                        success: async (res) => {
                                            let groupChat = res.data
                                            groupChat.push(resDataMsg)
                                            resDataMsg['roomSign'] = sign;
                                            uni.$emit('getGroupChat', resDataMsg)


                                            // 缓存历史
                                            uni.setStorage({
                                                key: userTag,
                                                data: groupChat
                                            });
                                        },
                                        fail: (err) => {
                                            let groupChat = []
                                            groupChat.push(resDataMsg)
                                            uni.setStorage({
                                                key: userTag,
                                                data: groupChat
                                            });
                                        }
                                    });
                                } else if (resData.roomType == 1) {
                                    let sign = resData.sign
                                    let userTag = 'chatList:' + sign

                                    // 获取缓存的聊天消息
                                    uni.getStorage({
                                        key: userTag,
                                        success: (res) => {
                                            let privateChat = res.data
                                            privateChat.push(resDataMsg)
                                            uni.$emit('getPrivateLastChat', resDataMsg)

                                            let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');
                                            uni.showTabBarRedDot({
                                                index: 3,
                                            })

                                            console.log('chatGroupList=====>', chatGroupList);

                                            chatGroupList.forEach(chatGroup => {
                                                if (resDataMsg.roomSign == chatGroup.room__roomSign) {
                                                    chatGroup['hasNewMsg'] = true;
                                                }
                                            })

                                            uni.setStorageSync('CHAT_GROUP_LIST', chatGroupList);


                                            // 缓存新的聊天历史记录
                                            uni.setStorage({
                                                key: userTag,
                                                data: privateChat
                                            });
                                        },
                                        fail: (err) => {
                                            //缓存中没有历史,直接进行缓存
                                            let privateChat = []
                                            privateChat.push(resDataMsg)
                                            uni.setStorage({
                                                key: userTag,
                                                data: privateChat
                                            });
                                        }
                                    });
                                }
                            });
                        },
                        fail: err => {
								console.log('wss链接失败', err)
									console.log('链接失败',sign)
						let interval = setInterval(()=>{
							uni.connectSocket({
								url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
								success: res => {
										console.log('重连接成功', res)
								    clearInterval(interval)
								},
								fail: err => {
								    console.log('重连接失败', err)
								}
							})
						},1000)
                        }
                    });
                    constant.setUserSign(json.data.sign);
                    constant.setUserLogin(json.data);
					// const sign=constant.getUserSign
					console.log('检测链接失败',sign)
                    uni.onSocketClose((res) => {
                            let interval = setInterval(() => {
                                uni.connectSocket({
                                    url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                                    success: res => {
										console.log('检测重连接成功', res)
                                        clearInterval(interval)
                                    },
                                    fail: err => {
                                        console.log('检测重连接失败', err)
                                    }

                                });
                            }, 1000)
                        },
                    )
                }
            }
        }
    }
</script>

<style lang="scss">
    /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
    .auto-img {
        width: 100%;
        height: 100%;
        /*border-radius: 20rpx;*/
    }

    @import "uview-ui/index.scss";
</style>
