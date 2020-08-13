<script>
    import constant from './utils/constant';
    import api from './utils/request/api';

    export default {
        data() {
            return {
                msgList: [],
            };
        },
        onHide() {

            // let sign = constant.getUserSign()
            // console.log('onHide检测链接', sign)
            // // uni.onSocketClose(() => {
            // let interval = setInterval(() => {
            //     uni.connectSocket({
            //         url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
            //         success: res => {
            //             console.log('onHide检测重连接成功', res)
            //             this.getMsgWss()
            //             clearInterval(interval)
            //         },
            //         fail: err => {
            //             console.log('onHide检测重连接失败', err)
            //         }
            //
            //     });
            // }, 1000)
            // // })
        },
        onLoad() {

        },
        async onLaunch () {


            // console.log('onLaunch')
            //断网重连
            let interval = setInterval(() => {
                let sign = constant.getUserSign()
                console.log('onLaunch检测链接', sign)
                uni.onSocketClose(() => {

                    uni.connectSocket({
                        url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                        success: res => {
                            console.log('onLaunch检测重连接成功', res)
                            this.getMsgWss()
                            // clearInterval(interval)
                        },
                        fail: err => {
                            console.log('onLaunch检测重连接失败', err)
                        }

                    });

                })


                uni.onSocketError(function (res) {
                    console.log('WebSocket连接打开失败，请检查！');
                    uni.connectSocket({
                        url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                        success: res => {
                            console.log('onLaunch检测重连接成功', res)
                            this.getMsgWss()
                            // clearInterval(interval)
                        },
                        fail: err => {
                            console.log('onLaunch检测重连接失败', err)
                        }

                    });
                });

            }, 1000)








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

            let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');
            let chatFriendList = uni.getStorageSync('CHAT_FRIEND_LIST')
            let groupObj = {};
            let friendObj = {};

            if (chatGroupList.length != 0 || chatFriendList.length != 0) {
                new Promise((resolve, reject) => {
                    if (chatGroupList.length != 0) {
                        chatGroupList.forEach(res => {
                            if (groupObj[res.hasNewMsg] == undefined) {
                                groupObj[res.hasNewMsg] = 1
                            } else {
                                groupObj[res.hasNewMsg]++;
                            }
                        })

                        for (let key in groupObj) {
                            if (groupObj['true'] == 0 || groupObj['true'] == undefined) {
                                resolve();
                            } else {
                                uni.showTabBarRedDot({
                                    index: 3
                                })
                            }
                        }
                    }
                }).then(res => {
                    if (chatFriendList.length != 0) {
                        chatFriendList.forEach(res => {
                            if (friendObj[res.hasPrivateNewMsg] == undefined) {
                                friendObj[res.hasPrivateNewMsg] = 1
                            } else {
                                friendObj[res.hasPrivateNewMsg]++;
                            }
                        })

                        for (let key in friendObj) {
                            if (friendObj['true'] == 0 || friendObj['true'] == undefined) {
                                uni.hideTabBarRedDot({
                                    index: 3
                                })
                            } else {
                                uni.showTabBarRedDot({
                                    index: 3
                                })
                            }
                        }
                    }
                })
            }


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
                            console.log('wss连接成功')
                            this.getMsgWss()

                        },
                        fail: err => {
                            console.log('wss链接失败', err)
                            console.log('链接失败', sign)
                            let interval = setInterval(() => {
                                uni.connectSocket({
                                    url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                                    success: res => {
                                        console.log('重连接成功', res)
                                        this.getMsgWss()
                                        clearInterval(interval)
                                    },
                                    fail: err => {
                                        console.log('重连接失败', err)
                                    }
                                })
                            }, 1000)
                        }
                    });
                    constant.setUserSign(json.data.sign);
                    constant.setUserLogin(json.data);
                }
            },


            getMsgWss() {
                uni.onSocketMessage((res) => {
                    const resData = JSON.parse(res.data)
                    const resDataMsg = JSON.parse(res.data).message
                    console.log(resData)
                    if (resData.roomType == 0) {

                        if (resDataMsg.type == 'system') {
                            console.log('>>>>>>>>>>>', resDataMsg)
                        } else {
                            resDataMsg.type = 'orther'
                        }
                        let sign = resData.roomId
                        let userTag = 'chatList:' + sign


                        let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');
                        uni.showTabBarRedDot({
                            index: 3,
                        })

                        if (chatGroupList.length != 0) {
                            chatGroupList.forEach(res => {
                                if (res.room__roomSign == sign) {
                                    res['hasNewMsg'] = true;
                                }
                            })
                            uni.setStorageSync('CHAT_GROUP_LIST', chatGroupList);
                        }
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
                                    data: groupChat,
                                    success: function () {
                                        console.log('群聊success');

                                    },
                                    fail: err => {
                                        console.log(err)

                                    }
                                });
                            }
                        });
                    } else if (resData.roomType == 1) {
                        resDataMsg.type = 'orther'
                        let sign = resData.sign
                        let userTag = 'chatList:' + sign

                        // 获取缓存的聊天消息
                        uni.getStorage({
                            key: userTag,
                            success: (res) => {
                                let privateChat = res.data
                                privateChat.push(resDataMsg)
                                resDataMsg['hasPrivateNewMsg'] = true;
                                uni.$emit('getPrivateLastChat', resDataMsg)


                                let PrivateLastChat = uni.getStorageSync('CHAT_FRIEND_LIST');

                                uni.showTabBarRedDot({
                                    index: 3,
                                })

                                if (PrivateLastChat.length != 0) {
                                    PrivateLastChat.forEach(res => {
                                        if (res.friend__sign == sign) {
                                            res['hasPrivateNewMsg'] = true;
                                        }
                                    })
                                    uni.setStorageSync('CHAT_FRIEND_LIST', PrivateLastChat);
                                }

                                // 缓存新的聊天历史记录
                                uni.setStorage({
                                    key: userTag,
                                    data: privateChat,
                                    success: function () {
                                        console.log('私聊success');
                                        uni.$emit('getPrivateLastChat', resDataMsg)
                                    },
                                    fail: err => {
                                        console.log(err)

                                    }
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
