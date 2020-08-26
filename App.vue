<script>
    import constant from './utils/constant';
    import api from './utils/request/api';

    let that;
    export default {
        data() {
            return {
                msgList: [],
                wssType: {},
                newWssType: false,
                roomId: '',
                sendAPPType: false,
                userSign: '',
                isJoinWhitShare:false
            };
        },
        onShow(scene) {
            console.log('----------onShow-----------------------------------------',scene)
            //页面展示时，判断是否断开连接，如果断开就重新连接
            let interval = setInterval(() => {
                if ([2, 3].includes(this.wssType.readyState)) {
                    let sign = constant.getUserSign()
                    console.log('进入了[2, 3].includes(this.wssType.readyState)的判断')
                    uni.onNetworkStatusChange((res) => {
                        console.log('是否重连联网1>1', res);
                        console.log('是否重连联网2>2', res.networkType);
                        if (res.isConnected == true) {
                            console.log('是否重连联网1>1>1', res.isConnected);
                            console.log('是否重连联网2>2>2', res.networkType);
                            uni.connectSocket({
                                url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                                success: res => {
                                    console.log('{remoteUrl:constant.getUserLogin().remoteUrl}',{remoteUrl:constant.getUserLogin().remoteUrl})

                                    console.log('重连成功', res)
                                    this.newWssType = true
                                    this.getMsgWss()
                                },
                                fail: err => {
                                    console.log('重连成功失败', err)
                                }
                            });
                        }

                    });
                }
            }, 1000)
        },
        async onLaunch(sceneNum) {
            if(sceneNum.scene == 1007){
                this.isJoinWhitShare = true;
            }
            //聊天室已经加载过的信息
            uni.$on('sendAPPType', (res) => {
                if (res.sendAPPType == true) {
                    this.sendAPPType = true
                }
            })
            //断网重连
            uni.$on('closeAPPVueNewWssType', () => {
                this.newWssType = false
                console.log('关闭了  //closeAPPVueNewWssType')
            })
        if(sceneNum.scene != 1007){
            if (constant.getUserLogin().length != 0) {
                if (constant.getUserLogin().schoolName != null) {
                    uni.switchTab({
                        url: '/pages/tabbel/home/home'
                    })
                }
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
            this.checkIsShowRedPoint();
        },


        methods: {
            // 检测是否显示消息的小红点
            checkIsShowRedPoint(){
                //针对不在消息界面的情况下，检测是否有小圆点，进行取消
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
                        } else {
                            resolve();
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

            async getLogin(jscode) {
                let json = await api.getLogin({
                    query: {
                        code: jscode,
                        version: '1.0'
                    }
                })
                let {errcode, sign, schoolName} = json.data;

                this.userSign = sign;

                uni.$emit('userLogin',json.data)

                constant.setUserSign(json.data.sign);
                constant.setUserLogin(json.data);

                //当用户也存在学校时，跳过选择学校的界面 直接转到首页
                if(!this.isJoinWhitShare){
                    if (schoolName != null) {
                        uni.switchTab({
                            url: '/pages/tabbel/home/home'
                        })
                    }
                }


                if (errcode == 200) {

                    if (uni.getStorageSync('CHAT_FRIEND_LIST').length == 0 || uni.getStorageSync('CHAT_GROUP_LIST').length == 0) {
                        this.getGroupChatList(sign);
                        this.getPrivateChatList(sign);
                    }

                    this.wssType = uni.connectSocket({
                        url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                        success: res => {
                            uni.onSocketOpen(function (res) {
                                uni.sendSocketMessage({
                                    data: JSON.stringify({remoteUrl:constant.getUserLogin().remoteUrl}),
                                    success: res => {
                                        console.log('remoteUrl 已经发送到后台了。。。', res)
                                    },
                                    fail: err => {
                                        console.log('remoteUrl =====已经发送到后失败。。。', err)
                                    }
                                });
                            });

                            console.log('wss连接成功')
                            this.getMsgWss()
                        },
                        fail: err => {
                            console.log('wss链接失败', err)
                            console.log('链接失败', sign)
                            uni.onSocketError((res) => {
                                console.log('WebSocket连接打开失败，请检查！');
                                let wss = uni.connectSocket({
                                    url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                                    success: res => {

                                        uni.onSocketOpen(function (res) {
                                            uni.sendSocketMessage({
                                                data: JSON.stringify({remoteUrl:constant.getUserLogin().remoteUrl}),
                                                success: res => {
                                                    console.log('remoteUrl 已经发送到后台了。。。', res)
                                                },
                                                fail: err => {
                                                    console.log('remoteUrl =====已经发送到后失败。。。', err)
                                                }
                                            });
                                        });

                                        console.log('onLaunch检测重连接成功', res)
                                        this.getMsgWss()
                                        // clearInterval(interval)
                                    },
                                    fail: err => {
                                        console.log('onLaunch检测重连接失败', err)
                                    }

                                });
                                console.log(this.wssType, '<><><><><><><>', this.wssType.readyState)
                            });
                        }
                    });
                    let interval=setInterval(()=>{
                        uni.onSocketError((res) => {
                            console.log('WebSocket连接打开失败，请检查！');
                            let wss = uni.connectSocket({
                                url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                                success: res => {

                                    uni.onSocketOpen(function (res) {
                                        uni.sendSocketMessage({
                                            data: JSON.stringify({remoteUrl:constant.getUserLogin().remoteUrl}),
                                            success: res => {
                                                console.log('remoteUrl 已经发送到后台了。。。', res)
                                            },
                                            fail: err => {
                                                console.log('remoteUrl =====已经发送到后失败。。。', err)
                                            }
                                        });
                                    });

                                    console.log('onLaunch检测重连接成功', res)
                                    this.getMsgWss()
                                    clearInterval(interval)
                                },
                                fail: err => {
                                    console.log('onLaunch检测重连接失败', err)
                                }

                            });
                            console.log(wss, 'onLaunch检测重连接失败', wss)
                        });
                    },1000)





                }
            },
            getMsgWss() {
                uni.onSocketMessage(async (res) => {
                    //总消息处理
                    const resData = JSON.parse(res.data)
                    const resDataMsg = JSON.parse(res.data).message

                    //私聊
                    if (resData.roomType == 1) {

                        //获取私聊好友列表
                        let json = await api.getNewFriendList({
                            query: {
                                sign: this.userSign
                            }
                        })

                        if (json.data.errcode == 200) {

                            if (json.data.friendList.length > uni.getStorageSync('CHAT_FRIEND_LIST').length) {
                                json.data.friendList.forEach(res => {
                                    if (res.friend__sign == resData.sign) {
                                        res['lastChatMsg'] = resData.message.content.indexOf('https://cdn4game.xunyi.online') == 0 ? '[图片]' : resData.message.content;
                                        res['time'] = resData.message.time;
                                        res['hasPrivateNewMsg'] = true;
                                    }
                                })

                                uni.setStorageSync('CHAT_FRIEND_LIST', json.data.friendList);
                            } else {
                                if (uni.getStorageSync('CHAT_FRIEND_LIST').length != 0) {
                                    let friend = uni.getStorageSync('CHAT_FRIEND_LIST');
                                    friend.forEach(res => {
                                        if (res.friend__sign == resData.sign) {
                                            res['lastChatMsg'] = resData.message.content.indexOf('https://cdn4game.xunyi.online') == 0 ? '[图片]' : resData.message.content;
                                            res['time'] = resData.message.time;
                                            res['hasPrivateNewMsg'] = true;
                                        }
                                    })
                                    uni.setStorageSync('CHAT_FRIEND_LIST', friend);
                                }
                            }

                        }
                    }

                    if (this.newWssType == true) {
                        console.log('走了(this.newWssType == true)')

                        uni.$emit('pri')

                        if (resData.roomType == 0) {
                            //群聊
                            console.log('resData.roomType == 0>>>群聊')

                            uni.$emit('getGroupChat', {roomSign: this.roomId, ...resDataMsg})
                            this.roomId = resData.roomId
                            if (resDataMsg.type == 'system') {
                                console.log('APP.Vue>>>>>>>>>>>', resDataMsg.type)
                            } else {
                                resDataMsg.type = 'orther'
                            }
                        } else {
                            if (resDataMsg.type == 'system') {
                                console.log('>>>>>>>>>>>', resDataMsg.type)
                            } else {
                                resDataMsg.type = 'orther'
                            }
                            uni.$emit('getPrivateLastChat', resDataMsg)
                            console.log('resData.roomType == 0>>>私聊')
                            this.roomId = resDataMsg.sign
                        }
                        //重连后的消息判别
                        let option = {
                            roomSign: this.roomId,
                            roomName: resData.name,
                            roomType: resData.roomType,
                            newMSg: resData
                        }

                        //下次dom刷新才能用
                        if (this.sendAPPType == true) {
                            console.log('this.sendAPPType == true')
                            uni.$emit('getMsgWss', option)
                        } else {
                            console.log('此时并没有进聊天')

                            uni.showTabBarRedDot({
                                index: 3
                            })


                            const userTag = 'chatList:' + this.roomId
                            console.log('走了false',userTag)
                            uni.getStorage({
                                key: userTag,
                                success: async (res) => {
                                    ///appVue上《》此时聊天室页面还没有加载
                                    console.log('//appVue上《》此时聊天室页面还没有加载,拿到缓存的信息', res.data);
                                    var jshouMsg = res.data
                                    jshouMsg.push(resDataMsg)
                                    console.log(userTag)

                                    let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');

                                    chatGroupList.forEach(chatGroup => {
                                        if (this.roomId == chatGroup.room__roomSign) {
                                            chatGroup['hasNewMsg'] = true;
                                        }
                                    })


                                    uni.setStorageSync('CHAT_GROUP_LIST', chatGroupList);

                                    //进入页面时，消息界面的红点需要页面中的连接来触发
                                    uni.$emit('getGroupChat', {roomSign: this.roomId, ...resDataMsg})

                                    uni.setStorage({
                                        key: userTag,
                                        data: jshouMsg,
                                        success: function () {
                                            console.log('appVue上《》此时聊天室页面还没有加载success');

                                        },
                                        fail: err => {
                                            console.log(err)
                                        }
                                    });
                                },
                                fail: err => {
                                    let jshouMsg = []
                                    jshouMsg.push(resDataMsg)
                                    uni.setStorage({
                                        key: userTag,
                                        data: jshouMsg,
                                        success: function () {
                                            console.log('appVue上《》此时聊天室页面还没有加载success');
                                        }
                                    });
                                }
                            });
                        }


                    } else {
                        console.log('走了(this.newWssType == falees)')
                        uni.$emit('getPrivateLastChat', resDataMsg)

                        // uni.showTabBarRedDot({
                        //     index: 3,
                        // })

                        // 群聊
                        if (resData.roomType == 0) {

                            if (resDataMsg.type == 'system') {
                                console.log('>>>>>>>>>>>', resDataMsg)
                            } else {
                                resDataMsg.type = 'orther'
                            }
                            let sign = resData.roomId
                            let userTag = 'chatList:' + sign
                            let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');


                            if(chatGroupList.length != 0){
                                chatGroupList.forEach(resGroup=>{
                                    if(resGroup.room__roomSign == sign){
                                        uni.showTabBarRedDot({
                                            index: 3,
                                        })
                                    }
                                })
                            }




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
                                            uni.$emit('getGroupChat', resDataMsg)
                                        },
                                        fail: err => {
                                            console.log(err)

                                        }
                                    });
                                }
                            });

                            //私聊
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

                                    console.log('在对方没有群聊列表的时候就触发了消息tabbar的小红点')

                                    let PrivateLastChat = uni.getStorageSync('CHAT_FRIEND_LIST');

                                    if(PrivateLastChat.length != 0){
                                        uni.showTabBarRedDot({
                                            index: 3,
                                        })
                                    }

                                    let option = {
                                        roomSign: resData.sign,
                                        roomName: resData.name,
                                        chatType: 0
                                    }

                                    uni.$emit('getMsgWss', option)

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
                    }
                });
            },

            //群聊列表
            async getGroupChatList(userSign) {
                let json = await api.getGroupChatList({
                    query: {
                        sign: userSign
                    }
                })
                if (json.data.errcode == 200) {
                    uni.setStorageSync('CHAT_GROUP_LIST', json.data.roomList);
                }
                console.log('群聊列表', json);
            },

            //私聊列表
            async getPrivateChatList(userSign) {
                let json = await api.getNewFriendList({
                    query: {
                        sign: userSign
                    }
                })

                if (json.data.errcode == 200) {
                    uni.setStorageSync('CHAT_FRIEND_LIST', json.data.friendList);
                }
                console.log('私聊列表', json);
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
    scroll-view ::-webkit-scrollbar {
        width: 0;
        height: 0;
        background-color: transparent;
    }

    @import "uview-ui/index.scss";
</style>
