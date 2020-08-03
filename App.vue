<script>
    import constant from './utils/constant';
    import api from './utils/request/api';

    export default {
        data() {
            return {
                msgList: [],
            };
        },
        onLaunch: async function () {
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
                let {errcode, sign} = json.data;
                if(json.data.schoolName != null){
                    uni.switchTab({
                        url:'/pages/tabbel/home/home'
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
                                            let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');
                                            uni.showTabBarRedDot({
                                                index: 1,
                                            })


                                            chatGroupList.forEach(chatGroup => {
                                                if (resDataMsg.roomSign == chatGroup.room__roomSign) {
                                                    chatGroup['hasNewMsg'] = true;
                                                }
                                            })

                                            uni.setStorageSync('CHAT_GROUP_LIST', chatGroupList);

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
                        }
                    });
                    constant.setUserSign(json.data.sign);
                    constant.setUserLogin(json.data);
                    uni.onSocketClose((res) => {
                            let interval = setInterval(() => {
                                uni.connectSocket({
                                    url: 'wss://pets.neargh.com/tucaolove/ws/oneChat/' + sign,
                                    success: res => {
                                        clearInterval(interval)
                                    },
                                    fail: err => {
                                        console.log('重连接失败', err)
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
        border-radius: 20 rpx;
    }

    @font-face {
        font-family: 'iconfont';  /* project id 1495177 */
        src: url('//at.alicdn.com/t/font_1495177_mbqiyb3fyq.eot');
        src: url('//at.alicdn.com/t/font_1495177_mbqiyb3fyq.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1495177_mbqiyb3fyq.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1495177_mbqiyb3fyq.woff') format('woff'),
        url('//at.alicdn.com/t/font_1495177_mbqiyb3fyq.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1495177_mbqiyb3fyq.svg#iconfont') format('svg');
    }


    .arrow-right {
        font-size: 16px;
        color: #000;
        text-align: center;
        font-family: iconfont;
    }

    .noticeIcon {
        font-size: 28px;
        text-align: center;
        font-family: iconfont;
        background: linear-gradient(90deg, rgba(250, 252, 255, 1) 0%, rgba(23, 224, 228, 1) 35%, rgba(106, 245, 246, 0.8547794117647058) 100%);
        -webkit-background-clip: text;
        color: transparent;
    }

    .setIcon {
        font-size: 25px;
        text-align: center;
        font-family: iconfont;
        background: linear-gradient(90deg, rgba(250, 252, 255, 1) 0%, rgba(23, 224, 228, 1) 35%, rgba(106, 245, 246, 0.8547794117647058) 100%);
        -webkit-background-clip: text;
        color: transparent;
    }

    .historyIcon {
        font-size: 25px;
        text-align: center;
        font-family: iconfont;
        background: linear-gradient(90deg, rgba(250, 252, 255, 1) 0%, rgba(23, 224, 228, 1) 35%, rgba(106, 245, 246, 0.8547794117647058) 100%);
        -webkit-background-clip: text;
        color: transparent;
    }

    @import "uview-ui/index.scss";
</style>
