import api from '../../utils/request/api'
import emojiJs from '../../utils/emoji'
import user from '../../utils/constant'

export default {

    data() {
        return {
            scrollTop: 0,
            old: {
                scrollTop: 0
            },
            chatList: [],
            chatMessage: '',
            sendChatMessage: '',
            emojiList: [],
            emojiShow: false,
            autoplay: false,
            pictureShow: false,
            type: 'textarea',
            border: true,
            height: -3,
            autoHeight: true,
            sys: 0,
            chatDisable: false,
            emojiJs: emojiJs,
            emojiId: 0,
            emojiName: [],
            userInfo: [],
            userInfoSign: '',
            avatar: '',
            userName: '',
            getMsg: [],
            chatImg: '',
            tempFilePaths: '',
            getSign: [],
            tempVideoFilePaths: '',
            textAreaShow: 0,
            sendPensonChatMsg: false,
            snedContent: '是否发起与xxx 的私聊',
            roomSign: ''
        }
    },
    onLoad(option) {
        this.roomSign = option.roomSign;
        console.log('onLoad房间的sign', option)
        uni.connectSocket({
            url: 'wss://pets.neargh.com/tucaolove/ws/chat/' + option.roomSign,
            success: res => {
                console.log('wss链接成功', res)

            },
            fail: err => {
                console.log('wss链接失败', err)
            }

        });
        uni.setNavigationBarTitle({
            title: option.roomName
        });

        const length = this.chatList.length
        this.scrollTop = 1000 * length
        uni.getSystemInfo({
            success: (res) => {
                const sys = res.platform
                if (sys == 'android' || sys == 'devtools') {
                    this.sys = 1
                    this.height = 30
                }

            }

        });
        //用户信息
        this.userInfo = user.getUserInfo()
        this.avatar = this.userInfo.pic
        this.userName = this.userInfo.name
        this.userInfoSign = user.getUserSign()


    },
    onUnload() {

        uni.closeSocket({
            success: res => {
                console.log(res)
            },
            fail: err => {
                console.log(err)
            }
        })
        uni.onSocketClose(
            (res) => {
                console.log('WebSocket 已关闭！');
            },
        )

    },
    onReady() {

        uni.onSocketMessage((res) => {
            const resMsg = JSON.parse(res.data).message
            this.getSign = JSON.parse(res.data).sign
            resMsg.type = 'orther'
            if (this.getSign != this.userInfoSign) {
                this.chatList.push(resMsg)

            }
            const getLength = this.chatList.length
            this.scrollTop = 1500 * getLength
            console.log('wss回来的数据1>1', resMsg)
            console.log('wss回来的本地数据2>2', this.chatList)

        });
    },

    methods: {
        upper: function (e) {
            // console.log(e)
        },
        lower: function (e) {
            // console.log(e)
        },
        scroll: function (e) {
            // console.log(e)
            this.old.scrollTop = e.detail.scrollTop
        },
        //进入私人聊天
        toPersonalChat() {
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
        showEmoji() {
            this.chatDisable = true
            this.emojiShow = true
            this.textAreaShow = 1
        },
        //选择了emoji
        //左边
        chooseEmojiLeft(e) {
            const nowEmoji = e
            this.emojiJs.map((val) => {
                if (nowEmoji == val.id) {
                    this.chatMessage = this.chatMessage + val.name
                }
            })

        },

        //发送消息
        sendMessage() {
            this.emojiRe(this.chatMessage)
            if (this.chatMessage == '') {
                return
            }
            const options = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: this.chatMessage,
                chatType: 0,
                name: this.userName
            }

            this.chatList.push(options)
            const length = this.chatList.length
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
                roomId: this.roomSign
            }
            console.log('发送备点用')
            uni.sendSocketMessage({
                data: JSON.stringify(msgData),
                success: res => {
                    // console.log('4515',res)
                },
                fail: err => {
                    // console.log('454',err)
                }
            });
            this.chatMessage = ''


        },
        emojiRe(val) {
            for (let i = 0; i < this.emojiJs.length; i++) {
                let n = val.indexOf(this.emojiJs[i].name);
                while (n >= 0) {
                    this.chatMessage = this.chatMessage.replace(this.emojiJs[i].name, `<img src='${this.emojiJs[i].src}'/>`)
                    n = this.chatMessage.indexOf(this.emojiJs[i].name);
                }
            }
            return val

        },

        //打开拍摄
        openPic() {
            this.chatDisable = true
            this.pictureShow = true
            this.textAreaShow = 1
        },
        //打开相册
        async openAlbum() {
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: res => {
                    this.pictureShow = false
                    // tempFilePath可以作为img标签的src属性显示图片
                    this.tempFilePaths = res.tempFilePaths[0]
                    const tempFilePaths = res.tempFilePaths
                    //网路请求
                    this.upLoadImg()

                }
            })
        },

        async upLoadImg() {
            // 本地渲染
            const localOptions = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: this.tempFilePaths,
                chatType: 1,
                name: this.userName
            }
            this.chatList.push(localOptions)
            const length = this.chatList.length
            this.scrollTop = 1500 * length
            //upload图片
            let resImg = await api.uploadImages({
                query: {
                    data: {sign: this.userInfoSign},
                    filePath: this.tempFilePaths,
                    key: 'img'
                }
            })
            const Status = JSON.parse(resImg.data).errcode
            const chatImg = JSON.parse(resImg.data).img
            if (Status == 200) {

                //通讯
                const onlineOption = {
                    type: "my",
                    sign: this.userInfoSign,
                    avatar: this.avatar,
                    content: chatImg,
                    chatType: 1,
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
                    roomId: "happycutpet",
                }
                uni.sendSocketMessage({
                    data: JSON.stringify(msgData),
                    success: res => {
                        // console.log('4515',res)
                    },
                    fail: err => {
                        // console.log('454',err)
                    }
                });
            }
        },
        //打开拍摄
        openCamera() {
            uni.chooseVideo({
                count: 1,
                sourceType: ['camera', 'album'],
                success: (res) => {
                    const video = res.tempFilePath;
                    this.tempVideoFilePaths = video


                    this.upLoadViedo()
                    this.pictureShow = false
                }
            });
        },

        async upLoadViedo() {
            // 本地渲染
            const localOptions = {
                type: "my",
                sign: this.userInfoSign,
                avatar: this.avatar,
                content: this.tempVideoFilePaths,
                chatType: 3,
                name: this.userName
            }

            this.chatList.push(localOptions)
            const length = this.chatList.length
            this.scrollTop = 1500 * length
            let resViedo = await api.uploadVideoFile({
                query: {
                    data: {sign: this.userInfoSign},
                    filePath: this.tempVideoFilePaths,
                    key: 'file'
                }
            })
            const Status = JSON.parse(resViedo.data).errcode
            const chatViedo = JSON.parse(resViedo.data).url
            if (Status == 200) {
                console.log('视频已经发送')
                // //通讯
                const onlineOption = {
                    type: "my",
                    sign: this.userInfoSign,
                    avatar: this.avatar,
                    content: chatViedo,
                    chatType: 3,
                    name: this.userName
                }
                const timestamp = Date.parse(new Date());
                const msgData = {
                    message: onlineOption,
                    chatType: 3,
                    name: this.userName,
                    pic: this.avatar,
                    timestamp: timestamp,
                    sign: this.userInfoSign,
                    roomId: "happycutpet",
                }
                uni.sendSocketMessage({
                    data: JSON.stringify(msgData),
                    success: res => {
                        // console.log('4515',res)
                    },
                    fail: err => {
                        // console.log('454',err)
                    }
                });
            }
        },

        //视频播放出错
        videoErrorCallback() {
            console.log('视频播放出错')
        },
        picClose() {
            this.chatDisable = false
            this.textAreaShow = 0
        },
        emojiClose() {
            this.chatDisable = false
            this.textAreaShow = 0
        },


        textAreaChanged() {
        }


    }
}
