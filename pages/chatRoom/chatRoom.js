import api from '../../utils/request/api'
import emojiJs from '../../utils/emoji'
import contrastEmoji from "../../utils/contrastEmoji";
import user from '../../utils/constant'
import {sensitiveWord} from '../../utils/sensitiveWorld'


export default {
    data() {
        return {
            //文字消息
            textMsg: '',
            //消息列表
            isHistoryLoading: false,
            scrollAnimation: false,
            scrollTop: 1000,
            scrollToView: '',
            msgList: [],
            msgImgList: [],
            myuid: 0,

            //录音相关参数
            // #ifndef H5
            //H5不能录音
            RECORDER: uni.getRecorderManager(),
            // #endif
            isVoice: false,
            voiceTis: '按住 说话',
            recordTis: "手指上滑 取消发送",
            recording: false,
            willStop: false,
            initPoint: {identifier: 0, Y: 0},
            recordTimer: null,
            recordLength: 0,
            voiceID: 0,


            //播放语音相关参数
            AUDIO: uni.createInnerAudioContext(),
            playMsgid: null,
            VoiceTimer: null,
            // 抽屉参数
            popupLayerClass: '',
            // more参数
            hideMore: true,
            //表情定义
            hideEmoji: true,
            emojiList: emojiJs,
            contrastEmoji: contrastEmoji,
            //表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要

            //红包相关参数
            windowsState: '',
            redenvelopeData: {
                rid: null,	//红包ID
                from: null,
                face: null,
                blessing: null,
                money: null
            },
            roomName: '',


            //用户信息
            userInfoSign: '',
            avatar: '',
            userName: '',
            roomSign: '',
            getSign: "",
            tempFilePaths: '',
            tempVideoFilePaths: "",
            roomId: '',
            roomType: 0,
            priName: '',
            loadingShow: false,
            sensitiveWorld: sensitiveWord,
            //路径识别
            pathType: 0,
            shareType: 1
        };
    },
    onLoad(option) {


        //判断是否来自分享
        if (option.pathType != undefined || option.pathType == 'share') {

            setTimeout(() => {
                try {
                    const value = uni.getStorageSync('USER_SIGN');
                    if (value) {
                        console.log('异步拿到USER_SIGN》', value);
                        this.userInfoSign = value
                    }
                } catch (e) {
                    // error
                }
            }, 1500)
            this.pathType = 1;
            if (user.getIsAuthor()) {
                this.pathType = 0;
            }
            uni.$on('getGroupChat', (chatMsg) => {
                let res = chatMsg
                // let resMsg=chatMsg.message
                if (res.sign != this.userInfoSign) {
                    this.msgList.push(res)
                }
                if (res.chatType == 1 && res.type != 'my') {
                    this.msgImgList.push(res)
                }
            })

        }


        this.roomName = option.roomName;


        //用户信息
        this.userInfo = user.getUserLogin()
        this.avatar = this.userInfo.pic
        this.userName = this.userInfo.name
        this.userInfoSign = user.getUserSign()
        this.schoolName = this.userInfo.schoolName
        console.log('用户信息', this.userInfo)


        //option的chatType = 1是群聊
        //roomType	number  0（或者不传） 群聊；1 单聊
        console.log('option', option)
        // chatType: "1"
        // roomName: "高考助力"
        // roomSign: "1c40e1da4b4fc766870f613240797e50"
        // userName: "Anthony"
        let sign = option.roomSign
        let userTag = 'chatList:' + sign
        let name = option.roomName
        const chatType = option.chatType
        console.log('当前的聊天的', chatType)

        if (chatType == 1) {
            //分享的状态
            this.shareType = 1
            console.log('群聊的聊天的', chatType)
            this.roomSign = option.roomSign;
            console.log('onLoad', option)
            this.getMsgList(this.roomSign);

            uni.setNavigationBarTitle({
                title: option.roomName
            });
            console.log('群聊的option.chatType', option.chatType)
            this.roomType = 0
            this.roomId = option.roomSign
            //欢迎进入聊天
            this.systemSendMessage(this.userName)
            uni.onSocketMessage(async (res) => {

                // this.getMsg.push(JSON.parse(res.data))
                const resData = JSON.parse(res.data)
                const resMsg = JSON.parse(res.data).message
                this.getSign = JSON.parse(res.data).sign
                const resMsgRoomId = JSON.parse(res.data).roomId
                const resRoomType = JSON.parse(res.data).roomType


                if (resRoomType == 0) {
                    if (resMsg.type == 'system') {
                        console.log('>>>>>>>>>>>', resMsg.type)
                    } else {
                        resMsg.type = 'orther'
                    }


                    if (this.roomId == resMsgRoomId) {
                        // if ( resMsg.type == 'system'){
                        //     console.log('>>>>>>>>>>>',resMsg.type)
                        // } else {
                        //     resMsg.type = 'orther'
                        // }
                        if (this.getSign != this.userInfoSign) {
                            console.log('当前聊天群聊', this.roomSign)
                            this.msgList.push(resMsg)
                            const getLength = this.msgList.length
                            this.scrollTop = 1500 * getLength
                            console.log('wss-群聊回来的数据1>1', JSON.parse(res.data))
                            console.log('wss-群聊回来的本地数据2>2', this.msgList)
                            uni.showTabBarRedDot({
                                index: 3,
                            })
                            let json = await api.getGroupChatList({
                                query: {
                                    sign: user.getUserSign()
                                }
                            })

                            json.data.roomList.forEach(chatGroup => {
                                if (resMsgRoomId == chatGroup.room__roomSign) {
                                    chatGroup['hasNewMsg'] = true;
                                }
                            })


                            uni.setStorageSync('CHAT_GROUP_LIST', json.data.roomList);

                            uni.$emit('getGroupChat', {roomSign: resMsgRoomId, ...resMsg})
                            //缓存历史
                            const userTag = 'chatList:' + this.roomSign
                            uni.setStorage({
                                key: userTag,
                                data: this.msgList,
                                success: function () {
                                    console.log('群聊缓存success');
                                }
                            });
                        } else {
                            console.log('这是自己的消息', resMsg)
                        }

                    } else {
                        console.log('在一个群聊中收到来自别的群聊消息')
                        uni.showTabBarRedDot({
                            index: 3,
                        })
                        // if ( resMsg.type == 'system'){
                        //     console.log('>>>>>>>>>>>',resMsg.type)
                        // } else {
                        //     resMsg.type = 'orther'
                        // }
                        const userTag = 'chatList:' + resMsgRoomId
                        uni.getStorage({
                            key: userTag,
                            success: async (res) => {
                                //在个人界面收到群聊信息
                                console.log('//在一个群聊中收到来自别的群聊消息检查内存', res.data);
                                var jshouMsg = res.data
                                jshouMsg.push(resMsg)
                                console.log(jshouMsg)

                                let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');

                                chatGroupList.forEach(chatGroup => {
                                    if (resMsgRoomId == chatGroup.room__roomSign) {
                                        chatGroup['hasNewMsg'] = true;
                                    }
                                })


                                uni.setStorageSync('CHAT_GROUP_LIST', chatGroupList);

                                uni.$emit('getGroupChat', {roomSign: resMsgRoomId, ...resMsg})

                                uni.setStorage({
                                    key: userTag,
                                    data: jshouMsg,
                                    success: function () {
                                        console.log('在一个群聊中收到来自别的群聊消息success');

                                    },
                                    fail: err => {
                                        console.log(err)

                                    }
                                });
                            },
                            fail: err => {
                                let jshouMsg = []
                                jshouMsg.push(resMsg)
                                uni.setStorage({
                                    key: userTag,
                                    data: jshouMsg,
                                    success: function () {
                                        console.log('在一个群聊中收到来自别的群聊消息检查存储success');
                                    }
                                });
                            }
                        });


                    }
                    if (resMsg.chatType == 1 && resMsg != 'my') {
                        this.msgImgList.push(resMsg.content)
                    }

                } else if (resRoomType == 1) {
                    console.log('//在群聊界面收到私聊信息');
                    resMsg.type = 'orther'
                    const userTag = 'chatList:' + resData.sign
                    console.log(userTag)
                    uni.getStorage({
                        key: userTag,
                        success: (res) => {
                            //在群聊界面收到私聊信息
                            console.log('//在群聊界面收到私聊信息', res.data);
                            var jshouMsg = res.data
                            jshouMsg.push(resMsg)
                            console.log(jshouMsg)
                            uni.setStorage({
                                key: userTag,
                                data: jshouMsg,
                                success: function () {
                                    console.log('裙聊中存私聊缓存success');
                                }
                            });
                        },
                        fail: err => {
                            console.log(err)
                            let jshouMsg = []
                            jshouMsg.push(resMsg)
                            uni.setStorage({
                                key: userTag,
                                data: jshouMsg,
                                success: function () {
                                    console.log('裙聊中存私聊缓存success');
                                }
                            });
                        }
                    });
                }


                // console.log('>>>>>',JSON.parse(res.data).roomType)
                //
                //     if (JSON.parse(res.data).roomType ==1){
                //         const friend__pic=resMsg.avatar
                //         const friend__name=resMsg.name
                //         const friend__sign=resMsg.sign
                //         // console.log(friend__sign,friend__name)
                //         const fri={
                //             friend__pic:friend__pic,
                //             friend__name:friend__name,
                //             friend__sign:friend__sign
                //         }
                //         uni.setStorage({
                //             key: 'friList',
                //             data:fri,
                //             success: function () {
                //                 console.log('存好友成功');
                //             }
                //         });
                //
                //     }

                // console.log(this.getSign.length)

            });


        } else {
            this.shareType = 0
            console.log('私聊的option.chatType', option.chatType)
            this.roomType = 1
            //路人随机匹配
            if (option.matching != undefined || option.matching != null) {
                console.log('路人随机匹配')
            }
            this.roomId = option.roomSign
            this.roomSign = option.roomSign
            uni.setNavigationBarTitle({
                title: option.roomName
            });
            // uni.getStorage({
            //     key: 'privateChatSign',
            //     success: (res) => {
            //         this.roomId = res.data
            //         this.roomSign = res.data
            //         console.log('监听到事件来自 privateChatSign', res.data);
            //         this.getMsgList(res.data);
            //     },
            //     fail: (res) => {
            //         this.roomId = option.roomSign
            //         this.roomSign = option.roomSign
            //     }
            // });
            // uni.getStorage({
            //     key: 'privateChatName',
            //     success: (res) => {
            //         this.priName = res.data
            //         uni.setNavigationBarTitle({
            //             title: this.priName
            //         });
            //     },
            //     fail: (res) => {
            //         uni.setNavigationBarTitle({
            //             title: option.roomName
            //         });
            //     }
            // });


            uni.onSocketMessage((res) => {
                // this.getMsg.push(JSON.parse(res.data))
                // console.log(JSON.parse(res.data))
                const resData = JSON.parse(res.data)
                console.log(resData)
                const resMsg = JSON.parse(res.data).message
                const getroomId = JSON.parse(res.data).sign
                const resRoomType = JSON.parse(res.data).roomType
                let length = this.msgList.length

                resMsg.type = 'orther'

                if (resRoomType == 1) {
                    uni.showTabBarRedDot({
                        index: 3
                    })

                    console.log('私聊')
                    if (sign == getroomId) {
                        this.msgList.push(resMsg)
                        const userTag = 'chatList:' + getroomId
                        console.log('wss-私聊回来的本地数据2', userTag)
                        uni.setStorage({
                            key: userTag,
                            data: this.msgList,
                            success: function () {
                                console.log('私聊缓存success');
                            }
                        });
                    } else {
                        //缓存历史,收到其他人
                        const userTag = 'chatList:' + getroomId
                        console.log('wss-私聊回来的本地数据2', userTag)
                        uni.getStorage({
                            key: userTag,
                            success: (res) => {
                                //在个人界面收到群聊信息
                                console.log('//在个人界面收到群聊信息', res.data);
                                var jshouMsg = res.data
                                jshouMsg.push(resMsg)
                                console.log(jshouMsg)
                                uni.setStorage({
                                    key: userTag,
                                    data: jshouMsg,
                                    success: function () {
                                        console.log('私聊中其他人私聊缓存success');
                                    },
                                    fail: err => {
                                        console.log(err)

                                    }
                                });
                            },
                            fail: err => {
                                let list = []
                                list.push(resMsg)
                                uni.setStorage({
                                    key: userTag,
                                    data: list,
                                    success: function () {
                                        console.log('私聊缓存success');
                                    }
                                });
                            }
                        });


                    }

                    if (resMsg.chatType == 1 && resMsg != 'my' && sign == getroomId) {
                        this.msgImgList.push(resMsg.content)
                    }
                    const getLength = this.msgList.length
                    this.scrollTop = 1500 * getLength
                    console.log('wss-私聊回来的数据1>1', res.data)
                    console.log('wss-私聊回来的本地数据2>2', this.msgList)


                } else if (resRoomType == 0) {
                    console.log('//在个人界面收到群聊信息');
                    if (resMsg.type == 'system') {
                        console.log('>>>>>>>>>>>', resMsg.type)
                    } else {
                        resMsg.type = 'orther'
                    }
                    const roomId = resData.roomId
                    const userTag = 'chatList:' + roomId
                    console.log(userTag)
                    uni.getStorage({
                        key: userTag,
                        success: (res) => {
                            //在个人界面收到群聊信息
                            console.log('//在个人界面收到群聊信息', res.data);
                            var jshouMsg = res.data
                            jshouMsg.push(resMsg)
                            console.log(jshouMsg)
                            uni.setStorage({
                                key: userTag,
                                data: jshouMsg,
                                success: function () {
                                    console.log('私聊中存群聊缓存success');
                                },
                                fail: err => {
                                    console.log(err)

                                }
                            });
                        },
                        fail: err => {
                            let jshouMsg = []
                            jshouMsg.push(resMsg)
                            uni.setStorage({
                                key: userTag,
                                data: jshouMsg,
                                success: function () {
                                    console.log('私聊中存群聊缓存success');
                                }
                            });
                        }
                    });

                }


                // console.log(this.getSign.length)

            });


        }

        //好友拿信息


        // 语音自然播放结束
        this.AUDIO.onEnded((res) => {
            this.playMsgid = null;
        });
        // #ifndef H5
        // 录音开始事件
        this.RECORDER.onStart((e) => {
            this.recordBegin(e);
        })
        // 录音结束事件
        this.RECORDER.onStop((e) => {
            this.recordEnd(e);
        })
        // #endif
    },
    onReady() {
        uni.setStorageSync('IS_PREVIEW', false);
    },
    onUnload() {
        // console.log('页面卸载； ')
        const userTag = 'chatList:' + this.roomSign
        console.log('页面卸载', userTag)
        uni.setStorage({
            key: userTag,
            data: this.msgList,
            success: function () {
                console.log('页面卸载success');
            }
        });
        uni.hideTabBarRedDot({
            index: 3,
        })


    },
    onShareAppMessage() {
        if (this.shareType == 1) {
            return {
                title: "传播校园文化,助力高考报考",
                path: '/pages/chatRoom/chatRoom?roomSign=' + this.roomSign + '&roomName=' + this.roomName + '&chatType=' + 1 + '&userName=' + this.userName + '&pathType=' + 'share' + '&schoolName=' + this.schoolName,
                imageUrl: "/static/images/poster.png"
            }
        } else if (this.shareType == 0) {
            return {
                title: "传播校园文化,助力高考报考",
                path: '/pages/tabbel/home/home',
                imageUrl: "/static/images/poster.png"
            }
        }
    },
    methods: {
        //时间处理
        replaceTime(time) {
            if (time < 10) {
                time = "" + "0" + time;
            }
            return time;
        },
        //欢迎进入的聊天发送
        systemSendMessage(val) {
            const time = new Date()
            let sendMsgTime = this.replaceTime(time.getHours()) + ':' + this.replaceTime(time.getMinutes()) + ':' + this.replaceTime(time.getSeconds())
            let content = "欢迎-" + this.userName + "-进入聊天室"
            console.log(content)
            const options = {
                type: "system",
                content: content,
                chatType: 0
            }
            console.log('私聊的id', this.roomId)
            this.msgList.push(options)
            // console.log('本地缓存',this.msgList)
            const length = this.msgList.length
            this.scrollTop = 1500 * length
            //通讯
            const timestamp = Date.parse(new Date());
            const msgData = {
                message: options,
                chatType: 0,
                name: this.userName,
                pic: this.avatar,
                timestamp: timestamp,
                sign: this.userInfoSign,
                roomId: this.roomId,
                roomType: this.roomType
            }
            console.log('发送文字消息')
            uni.sendSocketMessage({
                data: JSON.stringify(msgData),
                success: res => {
                    console.log('wss发送成功', res)
                    this.loadingShow = false
                },
                fail: err => {
                    this.$refs.uploadFail.show({
                        title: '发送消息失败,请检查网络',
                        type: 'error'
                    })
                    for (let i = 0; i < this.msgList.length; i++) {
                        const n = this.msgList[i].content
                        if (n == this.textMsg) {
                            this.msgList.splice(i, 1)
                        }
                    }
                    console.log('wss发送失败', err)
                    // console.log('454',err)
                }
            });

        },

        //toAuthor分享页面用户授权
        toAuthor(res) {
            uni.getUserInfo({
                provider: 'weixin',
                success: async (infoRes) => {
                    user.setIsAuthor(true)
                    this.pathType = 0;
                    if (infoRes.errMsg == "getUserInfo:ok") {
                        let {nickName, avatarUrl, gender, country, province, city} = infoRes.userInfo;
                        this.avatar = avatarUrl
                        this.userName = nickName
                        let json = await api.updateUserInfo({
                            query: {
                                sign: this.userInfoSign,
                                name: nickName,
                                pic: avatarUrl,
                                gender: gender,
                                country: country,
                                province: province,
                                city: city
                            }
                        })
                        if (json.data.errcode == 200) {
                            uni.showToast({
                                title: '授权成功',
                                mask: true,
                                icon: 'none'
                            });
                        }
                    }
                },
                fail(res) {
                    constant.setIsAuthor(false)
                    user.isAuthor = false;
                }
            });
        },

        //群聊转单聊sign处理
        async toPrivateChat(sign, name, avatar) {
            console.log(sign, name)
            this.roomId = sign
            this.priName = name

            //中间页\
            const chatType = 0
            uni.redirectTo({
                url: '/pages/otherMinePage/otherMinePage?roomSign=' + sign + '&roomName=' + name + '&chatType=' + chatType + '&avatar=' + avatar
            })


            // uni.redirectTo({
            //     url: '/pages/chatRoom/chatRoom'
            // });
            uni.setStorage({
                key: 'privateChatSign',
                data: this.roomId,
                success: function () {
                    console.log('success');
                }
            });
            uni.setStorage({
                key: 'privateChatName',
                data: name,
                success: function () {
                    console.log('success');
                }
            });


            const res = await api.addNewFriend({
                query: {

                    sign: this.userInfoSign,
                    friendSign: sign

                }
            })
            const resFri = await api.addNewFriend({
                query: {
                    sign: sign,
                    friendSign: this.userInfoSign

                }
            })
            console.log('添加好友', this.userInfoSign, sign, res)

        },
        // 接受消息(筛选处理)
        screenMsg(msg) {
            //从长连接处转发给这个方法，进行筛选处理
            console.log(msg)
        },

        //触发滑动到顶部(加载历史信息记录)
        loadHistory(e) {
            // console.log('触发滑动到顶部',e)
            if (this.isHistoryLoading) {
                return;
            }
            this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
            this.scrollAnimation = false;//关闭滑动动画
            // let Viewid = this.msgList[0];//记住第一个信息ID
            //本地模拟请求历史记录效果
            setTimeout(() => {
                // 消息列表
                //这段代码很重要，不然每次加载历史数据都会跳到顶部
                this.$nextTick(function () {
                    this.scrollToView = 'msg';//跳转上次的第一行信息位置
                    this.$nextTick(function () {
                        this.scrollAnimation = true;//恢复滚动动画
                    });

                });
                this.isHistoryLoading = false;

            }, 1000)
        },
        // 加载初始页面消息
        getMsgList(val) {
            // 消息历史列表
            console.log('执行', val)
            const userTag = 'chatList:' + val
            uni.getStorage({
                key: userTag,
                success: (res) => {
                    let list = res.data
                    console.log('缓存的聊天信息', list)
                    this.msgList = list;
                    console.log('缓存的聊天信息this.msgList', this.msgList)
                    list.map((e) => {
                        // console.log(e)
                        if (e.chatType == 1) {
                            this.msgImgList.push(e.content)
                        }
                    })
                    // 滚动到底部
                    this.$nextTick(function () {
                        //进入页面滚动到底部
                        const getLength = this.msgList.length
                        this.scrollTop = 1500 * getLength
                        console.log('进入页面滚动到底部', this.scrollTop)
                        this.$nextTick(function () {
                            this.scrollAnimation = true;
                        });

                    });
                }
            });


        },

        //更多功能(点击+弹出)
        showMore() {
            this.isVoice = false;
            this.hideEmoji = true;
            if (this.hideMore) {
                this.hideMore = false;
                this.openDrawer();
            } else {
                this.hideDrawer();
            }
        },
        // 打开抽屉
        openDrawer() {
            this.popupLayerClass = 'showLayer';
        },
        // 隐藏抽屉
        hideDrawer() {
            this.popupLayerClass = '';
            setTimeout(() => {
                this.hideMore = true;
                this.hideEmoji = true;
            }, 150);
        },
        // 图片照片
        chooseImage() {
            // this.getImage('album');
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: res => {
                    // tempFilePath可以作为img标签的src属性显示图片
                    this.tempFilePaths = res.tempFilePaths[0]
                    const tempFilePaths = res.tempFilePaths[0]
                    this.msgImgList.push(tempFilePaths)
                    // console.log(this.tempFilePaths)
                    //网路请求
                    this.upLoadImg()

                }
            })
        },
        async upLoadImg() {
            // console.log('>>>>>>>>>><><>',this.tempFilePaths)
            // console.log(this.userInfoSign)
            const time = new Date()

            let sendMsgTime = this.replaceTime(time.getHours()) + ':' + this.replaceTime(time.getMinutes()) + ':' + this.replaceTime(time.getSeconds())
            this.loadingShow = true
            // console.log('图片已经发送')
            // // 本地渲染
            const localOptions = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: this.tempFilePaths,
                chatType: 1,
                time: sendMsgTime,
                name: this.userName
            }
            // console.log('本地渲染',localOptions)
            this.msgList.push(localOptions)
            const length = this.msgList.length
            this.scrollTop = 1500 * length
            //upload图片
            let resImg = await api.uploadImages({
                query: {
                    data: {sign: this.userInfoSign},
                    filePath: this.tempFilePaths,
                    key: 'img'
                }
            })


            // console.log(JSON.parse(resImg.data))
            const Status = JSON.parse(resImg.data).errcode
            const chatImg = JSON.parse(resImg.data).img
            if (Status == 200) {
                this.loadingShow = false
                // //通讯
                // //wss
                const onlineOption = {
                    type: "my",
                    sign: this.userInfoSign,
                    avatar: this.avatar,
                    content: chatImg,
                    chatType: 1,
                    time: sendMsgTime,
                    name: this.userName
                }
                const timestamp = Date.parse(new Date());
                const msgData = {
                    message: onlineOption,
                    chatType: 1,
                    name: this.userName,
                    pic: this.avatar,
                    timestamp: timestamp,
                    sign: this.userInfoSign,
                    roomId: this.roomId,
                    roomType: this.roomType

                }
                uni.sendSocketMessage({
                    data: JSON.stringify(msgData),
                    success: res => {
                        console.log('wss发送成功', res)

                    },
                    fail: err => {
                        console.log('wss发送失败', err)
                        // console.log('454',err)
                    }
                });
            } else {
                this.$refs.uploadFail.show({
                    title: '上传失败，请重新发送',
                    type: 'error'
                })
                for (let i = 0; i < this.msgList.length; i++) {
                    const n = this.msgList[i].content
                    if (n == this.tempFilePaths) {
                        this.msgList.splice(i, 1)
                    }
                }
            }
        },
        //拍摄发送
        camera() {
            // this.getImage('camera');

            uni.chooseVideo({
                count: 1,
                sourceType: ['camera', 'album'],
                success: (res) => {
                    const video = res.tempFilePath;
                    // console.log(video)
                    this.tempVideoFilePaths = video
                    // console.log(this.tempVideoFilePaths)

                    this.upLoadViedo()

                }
            });
        },
        async upLoadViedo() {
            this.loadingShow = true
            const time = new Date()
            let sendMsgTime = this.replaceTime(time.getHours()) + ':' + this.replaceTime(time.getMinutes()) + ':' + this.replaceTime(time.getSeconds())
            // // 本地渲染
            const localOptions = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: this.tempVideoFilePaths,
                chatType: 3,
                time: sendMsgTime,
                name: this.userName
            }
            // console.log('本地渲染',localOptions)
            this.msgList.push(localOptions)
            const length = this.msgList.length
            this.scrollTop = 1500 * length
            // console.log(this.tempVideoFilePaths)
            let resViedo = await api.uploadVideoFile({
                query: {
                    data: {sign: this.userInfoSign},
                    filePath: this.tempVideoFilePaths,
                    key: 'file'
                }
            })
            // console.log(JSON.parse(resViedo.data))
            const Status = JSON.parse(resViedo.data).errcode
            const chatViedo = JSON.parse(resViedo.data).url

            if (Status == 200) {
                console.log('视频已经发送')
                this.loadingShow = false
                // //通讯
                // //wss
                const onlineOption = {
                    type: "my",
                    sign: this.userInfoSign,
                    avatar: this.avatar,
                    content: chatViedo,
                    chatType: 3,
                    name: this.userName,
                    time: sendMsgTime,
                }
                const timestamp = Date.parse(new Date());
                const msgData = {
                    message: onlineOption,
                    chatType: 3,
                    name: this.userName,
                    pic: this.avatar,
                    timestamp: timestamp,
                    sign: this.userInfoSign,
                    roomId: this.roomId,
                    roomType: this.roomType
                }
                uni.sendSocketMessage({
                    data: JSON.stringify(msgData),
                    success: res => {
                        console.log('wss发送成功', res)
                    },
                    fail: err => {
                        console.log('wss发送失败', err)
                    }
                });
            } else {

                this.$refs.uploadFail.show({
                    title: '上传失败，请重新发送',
                    type: 'error'
                })
                for (let i = 0; i < this.msgList.length; i++) {
                    const n = this.msgList[i].content
                    if (n == this.tempVideoFilePaths) {
                        this.msgList.splice(i, 1)
                    }
                }
            }
        },


        // 选择表情
        chooseEmoji() {
            this.hideMore = true;
            if (this.hideEmoji) {
                this.hideEmoji = false;
                this.openDrawer();
            } else {
                this.hideDrawer();
            }
        },
        //添加表情
        addEmoji(em) {
            // console.log(em)
            // this.textMsg+=em.alt;
            const nowEmoji = em
            this.contrastEmoji.map((val) => {
                // console.log(val)
                if (nowEmoji == val.id) {
                    // console.log(val.name)
                    this.textMsg = this.textMsg + val.name
                }
            })
        },
        //替换表情符号为图片
        replaceEmoji(str) {

            for (let i = 0; i < this.contrastEmoji.length; i++) {
                let n = str.indexOf(this.contrastEmoji[i].name);
                // console.log('>>',n)
                while (n >= 0) {
                    this.textMsg = this.textMsg.replace(this.contrastEmoji[i].name, `<img src='${this.contrastEmoji[i].src}'/>`)
                    n = this.textMsg.indexOf(this.contrastEmoji[i].name);
                }
            }
            // console.log('>>',this.textMsg)
            return str
        },
        //替换敏感词
        replaceSensitiveWorld(str) {

            sensitiveWord.forEach(res => {
                let reg = new RegExp(res);
                //匹配不到会返回-1
                if (this.textMsg == res) {
                    let a = ""
                    for (var i = 0; i < res.length; i++) {
                        a += "*"
                    }
                    this.textMsg = this.textMsg.replace(reg, a);
                }
            })

        },


        //获取焦点，如果不是选表情ing,则关闭抽屉
        textareaFocus() {
            if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
                this.hideDrawer();
            }
        },

        // 发送文字消息
        sendText() {
            this.loadingShow = true
            this.hideDrawer();//隐藏抽屉
            if (!this.textMsg) {
                return;
            } //替换敏感词
            this.replaceSensitiveWorld(this.textMsg)
            //替换表情
            let content = this.replaceEmoji(this.textMsg);
            let time = new Date()
            let sendMsgTime = this.replaceTime(time.getHours()) + ':' + this.replaceTime(time.getMinutes()) + ':' + this.replaceTime(time.getSeconds())
            console.log('sendMsgTime>>>>', sendMsgTime)
            // //自己的代码
            const options = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: this.textMsg,
                chatType: 0,
                time: sendMsgTime,
                name: this.userName
            }
            console.log('私聊的id', this.roomId)
            this.msgList.push(options)
            // console.log('本地缓存',this.msgList)
            const length = this.msgList.length
            this.scrollTop = 1500 * length
            //通讯
            const timestamp = Date.parse(new Date());

            const msgData = {
                message: options,
                chatType: 0,
                name: this.userName,
                pic: this.avatar,
                timestamp: timestamp,
                sign: this.userInfoSign,
                roomId: this.roomId,
                roomType: this.roomType
            }
            console.log('发送文字消息')
            uni.sendSocketMessage({
                data: JSON.stringify(msgData),
                success: res => {
                    console.log('wss发送成功', res)
                    this.loadingShow = false
                },
                fail: err => {
                    this.$refs.uploadFail.show({
                        title: '发送消息失败,请检查网络',
                        type: 'error'
                    })
                    for (let i = 0; i < this.msgList.length; i++) {
                        const n = this.msgList[i].content
                        if (n == this.textMsg) {
                            this.msgList.splice(i, 1)
                        }
                    }
                    console.log('wss发送失败', err)
                    // console.log('454',err)
                }
            });
            this.textMsg = '';//清空输入框


        },


        // 预览图片
        showPic(msg) {
            console.log('总的index', msg)
            const msgListLenght = this.msgList.length
            const msgImgListLenght = this.msgImgList.length
            for (let i = 0; i <= msgImgListLenght; i++) {
                if (this.msgList[msg].content == this.msgImgList[i]) {
                    console.log('>>>>>', i)
                    console.log('>>>>', this.msgList[msg].content)
                    console.log('>>>>', this.msgImgList[i])
                    uni.previewImage({
                        current: i,
                        urls: this.msgImgList
                    })
                }
            }

        },
        // 播放语音
        playVoice(url, id) {
            console.log('播放语音', url, id)
            this.playMsgid = id;
            this.AUDIO.src = url;
            this.$nextTick(function () {
                this.AUDIO.play();
            });
        },
        // 录音开始
        voiceBegin(e) {
            // if (e.touches.length > 1) {
            //     return;
            // }
            // this.initPoint.Y = e.touches[0].clientY;
            // this.initPoint.identifier = e.touches[0].identifier;
            // this.RECORDER.start({format: "mp3"});//录音开始,
            uni.authorize({
                scope: "scope.record",
                success: (res) => {
                    this.audioIsAuthor = true
                    user.setAudioIsAuthor('AUDIO_IS_AUTHOR', this.audioIsAuthor)
                    console.log('scope.record==  ==>', res)
                    // that.$recorderManager.start();
                    if (e.touches.length > 1) {
                        return;
                    }
                    this.initPoint.Y = e.touches[0].clientY;
                    this.initPoint.identifier = e.touches[0].identifier;
                    this.RECORDER.start({format: "mp3"});//录音开始,
                },
                fail: () => {
                    this.audioIsAuthor = false
                    user.setAudioIsAuthor('AUDIO_IS_AUTHOR', this.audioIsAuthor)
                    uni.showModal({
                        content: '检测到您没打开获取信息功能权限，是否去设置打开？',
                        confirmText: "确认",
                        cancelText: '取消',
                        success: (res) => {
                            if (res.confirm) {
                                uni.openSetting({
                                    success: (res) => {
                                        console.log('拒绝授权->>>', res);
                                    }
                                })
                            } else {
                                console.log('取消');
                            }
                        }
                    })
                }
            })


        },
        //录音开始UI效果
        recordBegin(e) {
            this.recording = true;
            this.voiceTis = '松开 结束';
            this.recordLength = 0;
            this.recordTimer = setInterval(() => {
                this.recordLength++;
            }, 1000)
        },
        // 录音被打断
        voiceCancel() {
            this.recording = false;
            this.voiceTis = '按住 说话';
            this.recordTis = '手指上滑 取消发送'
            this.willStop = true;//不发送录音
            this.RECORDER.stop();//录音结束
        },
        // 录音中(判断是否触发上滑取消发送)
        voiceIng(e) {
            if (!this.recording) {
                return;
            }
            let touche = e.touches[0];
            //上滑一个导航栏的高度触发上滑取消发送
            if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
                this.willStop = true;
                this.recordTis = '松开手指 取消发送'
            } else {
                this.willStop = false;
                this.recordTis = '手指上滑 取消发送'
            }
        },
        // 结束录音
        voiceEnd(e) {
            if (!this.recording) {
                return;
            }
            this.recording = false;
            this.voiceTis = '按住 说话';
            this.recordTis = '手指上滑 取消发送'
            this.RECORDER.stop();//录音结束
        },
        //录音结束(回调文件)
        recordEnd(e) {
            clearInterval(this.recordTimer);
            if (!this.willStop) {
                console.log("e: " + JSON.stringify(e));
                const voice = e.tempFilePath
                let min = parseInt(this.recordLength / 60);
                let sec = this.recordLength % 60;
                min = min < 10 ? '0' + min : min;
                sec = sec < 10 ? '0' + sec : sec;
                const voiceLenght = min + ':' + sec;
                let msg = {
                    voiceLenght: voiceLenght,
                    voice: voice
                }

                this.sendVoice(msg)
                // this.sendMsg(msg,'voice');
            } else {
                console.log('取消发送录音');
            }
            this.willStop = false;


        },
        //发送语音
        async sendVoice(val) {
            console.log('发生余韵', val)
            const voice = val.voice
            const voiceLenght = val.voiceLenght
            let playMsgid = this.msgList.length + 1
            this.loadingShow = true
            const time = new Date()

            let sendMsgTime = this.replaceTime(time.getHours()) + ':' + this.replaceTime(time.getMinutes()) + ':' + this.replaceTime(time.getSeconds())
            console.log('sendMsgTime>>>>', sendMsgTime)
            // // 本地渲染
            const localOptions = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: voice,
                chatType: 2,
                time: sendMsgTime,
                name: this.userName,
                voiceLenght: voiceLenght,
                playMsgid: playMsgid
            }
            // console.log('本地渲染',localOptions)
            this.msgList.push(localOptions)
            const length = this.msgList.length
            this.scrollTop = 1500 * length
            // console.log(this.tempVideoFilePaths)
            let resVoice = await api.uploadVideoFile({
                query: {
                    data: {sign: this.userInfoSign},
                    filePath: voice,
                    key: 'file'
                }
            })
            // console.log(JSON.parse(resViedo.data))
            const Status = JSON.parse(resVoice.data).errcode
            const chatVoice = JSON.parse(resVoice.data).url

            if (Status == 200) {
                console.log('音频已经发送')
                this.loadingShow = false
                // //通讯
                // //wss
                const onlineOption = {
                    type: "my",
                    sign: this.userInfoSign,
                    avatar: this.avatar,
                    content: chatVoice,
                    voiceLenght: voiceLenght,
                    chatType: 2,
                    name: this.userName,
                    time: sendMsgTime,
                    playMsgid: playMsgid
                }
                const timestamp = Date.parse(new Date());
                const msgData = {
                    message: onlineOption,
                    chatType: 2,
                    name: this.userName,
                    pic: this.avatar,
                    timestamp: timestamp,
                    sign: this.userInfoSign,
                    roomId: this.roomId,
                    roomType: this.roomType
                }
                uni.sendSocketMessage({
                    data: JSON.stringify(msgData),
                    success: res => {
                        console.log('wss发送成功', res)
                    },
                    fail: err => {
                        console.log('wss发送失败', err)
                    }
                });
            } else {

                this.$refs.uploadFail.show({
                    title: '上传失败，请重新发送',
                    type: 'error'
                })
            }
        },

        // 切换语音/文字输入
        switchVoice() {
            this.hideDrawer();
            this.isVoice = this.isVoice ? false : true;
        },
        discard() {
            return;
        }
    }
}
