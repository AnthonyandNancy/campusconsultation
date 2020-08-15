import api from '../../../utils/request/api'
import navTab_loadRefresh from "../../../components/navTab_loadRefresh";
import constant from "../../../utils/constant";
let that;

export default {
    components: {
        navTab_loadRefresh,
    },
    data() {
        return {
            viewHeight: 0,
            userSign: '',
            getSchoolName: '',
            tabTitle: [{title:'私聊'},{title:'群聊'}],
            totalPage: 1,
            currPage: 2,
            currentTab: 0,
            chatType: '私聊',
            schoolName: '',
            privateChatList: [],
            groupChatList: []
        }
    },

    onShareAppMessage() {
        return {
            title: "传播校园文化,助力高考报考",
            path: '/pages/selectSchool/selectSchool',
            imageUrl: "/static/images/poster.png"
        }
    },
    onLoad() {
        that = this;
        uni.getSystemInfo({
            success: (data) => {
                this.viewHeight = data.windowHeight;
            }
        })
    },
    onShow() {

        new Promise((resolve, reject) => {
            //获取私聊和群聊数据
            this.userSign = constant.getUserSign();
            if (constant.getUserSign().length != 0) {
                this.getGroupChatList();
                this.getPrivateChatList();
            }
            setTimeout(res=>{
                resolve()
            },1000)

        }).then(()=>{
            //界面显示时，遍历缓存中的数据，取消小红点
            let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');
            let chatFriendList = uni.getStorageSync('CHAT_FRIEND_LIST');
            let groupObj = {};
            let friendObj = {};

            if(uni.getStorageSync('GROUP_FRIEND_HASPOINT').length != 0){
                this.tabTitle = uni.getStorageSync('GROUP_FRIEND_HASPOINT');
            }

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
                            this.tabTitle[1]['hasGroupNewMsg'] = false
                            resolve();
                        }else{
                            this.tabTitle[1]['hasGroupNewMsg'] = true
                            that.$set( that.tabTitle,that.tabTitle[1].hasGroupNewMsg,true)
                            uni.showTabBarRedDot({
                                index:3
                            })
                        }
                    }
                }else{
                    resolve();
                }
            }).then(()=>{
                console.log('fasdgsdfsgdfgdfsg======')
                if (chatFriendList.length != 0) {
                    chatFriendList.forEach(res => {

                        if (friendObj[res.hasPrivateNewMsg] == undefined) {
                            friendObj[res.hasPrivateNewMsg] = 1
                        } else {
                            friendObj[res.hasPrivateNewMsg]++;
                        }
                    })

                    for (let key in friendObj) {
                        console.log('adjsfadsljgfsgjsdklfgjldf',key)
                        if (friendObj['true'] == 0 || friendObj['true'] == undefined) {

                            console.log('hideTabBarRedDothideTabBarRedDothideTabBarRedDothideTabBarRedDot=============')
                            this.tabTitle[0]['hasGroupNewMsg'] = false
                            uni.hideTabBarRedDot({
                                index:3
                            })
                        }else{
                            console.log('=====================================================================================================')
                            this.tabTitle[0]['hasGroupNewMsg'] = true

                            that.$set( that.tabTitle,that.tabTitle[0].hasGroupNewMsg,true)

                            uni.showTabBarRedDot({
                                index:3
                            })
                        }
                    }
                    console.log('===========1111111111',this.tabTitle)
                }
            })



            chatFriendList.forEach(res => {

                if (friendObj[res.hasPrivateNewMsg] == undefined) {
                    friendObj[res.hasPrivateNewMsg] = 1
                } else {
                    friendObj[res.hasPrivateNewMsg]++;
                }
            })

            for (let key in friendObj) {
                console.log('adjsfadsljgfsgjsdklfgjldf',key)
                if (friendObj['true'] == 0 || friendObj['true'] == undefined) {

                    console.log('hideTabBarRedDothideTabBarRedDothideTabBarRedDothideTabBarRedDot=============')
                    this.tabTitle[0]['hasGroupNewMsg'] = false
                    // uni.hideTabBarRedDot({
                    //     index:3
                    // })
                }else{
                    console.log('=====================================================================================================')
                    this.tabTitle[0]['hasGroupNewMsg'] = true

                    that.$set( that.tabTitle,that.tabTitle[0].hasGroupNewMsg,true)

                    uni.showTabBarRedDot({
                        index:3
                    })
                }
            }

            uni.setStorageSync('GROUP_FRIEND_HASPOINT',this.tabTitle);
        })




        //监听群聊在全局或聊天窗口界面发来的消息，并修改hasNewMsg的状态，重新缓存
        uni.$on('getGroupChat', (res) => {
            this.groupChatList.forEach(chatGroup => {
                if (res.roomSign == chatGroup.room__roomSign) {
                    chatGroup['hasNewMsg'] = true;
                    that.tabTitle[1]['hasGroupNewMsg'] = true
                    uni.showTabBarRedDot({
                        index:3
                    })
                }
            })
            uni.setStorageSync('CHAT_GROUP_LIST', this.groupChatList);
            uni.setStorageSync('GROUP_FRIEND_HASPOINT',this.tabTitle)
        })

        //监听群聊在全局或聊天窗口界面发来的消息，并修改hasPrivateNewMsg的状态
        uni.$on('getPrivateLastChat', (res) => {
            this.privateChatList.forEach(friend => {
                if (res.sign == friend.friend__sign) {
                    friend.lastChatMsg = res.content.indexOf('https://cdn4game.xunyi.online') == 0 ?'[图片]':res.content;
                    friend.time = res.time;
                    friend['hasPrivateNewMsg'] = res.hasPrivateNewMsg;
                    that.tabTitle[0]['hasGroupNewMsg'] = true;
                    uni.showTabBarRedDot({
                        index:3
                    })
                }
            })
            uni.setStorageSync('CHAT_FRIEND_LIST', this.privateChatList);
            uni.setStorageSync('GROUP_FRIEND_HASPOINT',this.tabTitle)
        })
        console.log('===============================>',this.tabTitle);
    },

    onReady() {
        uni.setStorageSync('IS_PREVIEW', false);

        this.userSign = constant.getUserSign();
        this.getSchoolName = constant.getUserInfo().schoolName;

        this.getPrivateChatList()
        this.getGroupChatList();

        //监听私聊
        uni.$on('getPrivateLastChat', (res) => {
            this.privateChatList.forEach(friend => {
                if (res.sign == friend.friend__sign) {
                    // friend.lastChatMsg = res.content;
                    friend.lastChatMsg = res.content.indexOf('https://cdn4game.xunyi.online') == 0 ?'[图片]':res.content;
                    friend.time = res.time;
                    friend['hasPrivateNewMsg'] = res.hasPrivateNewMsg;
                }
            })
            this.privateChatList = uni.getStorageSync('CHAT_FRIEND_LIST');
        })

    },
    methods: {
        //新聊天室
        newRoom() {
            uni.navigateTo({
                url: '/pages/chatRoom/chatRoom'
            })
        },

        //改变tabbar
        changeTab(index) {
            if (index == 0) {
                this.chatType = '私聊'
            } else if (index == 1) {
                this.chatType = '群聊'
            }
            this.currentTab = index;
        },

        loadMore() {
            if (this.currentTab == 0) {
                this.currPage++;
                this.getPrivateChatList();
                that.$refs.hideLoading[0].loadOver()
            } else if (this.currentTab == 1) {
                this.getGroupChatList();
            }
        },
        refresh() {
            if (this.currentTab == 0) {
                this.privateChatList = [];

                uni.$on('getPrivateLastChat', (res) => {
                    this.privateChatList.forEach(friend => {
                        if (res.sign == friend.friend__sign) {
                            friend.lastChatMsg = res.content.indexOf('https://cdn4game.xunyi.online') == 0 ?'[图片]':res.content;
                            friend.time = res.time;
                            friend['hasPrivateNewMsg'] = res.hasPrivateNewMsg;
                            that.tabTitle[0]['hasGroupNewMsg'] = true;
                            uni.showTabBarRedDot({
                                index:3
                            })
                        }
                    })
                    uni.setStorageSync('CHAT_FRIEND_LIST', this.privateChatList);
                    uni.setStorageSync('GROUP_FRIEND_HASPOINT',this.tabTitle)
                })

                this.getPrivateChatList();

            } else if (this.currentTab == 1) {
                this.groupChatList = []

                uni.$on('getGroupChat', (res) => {
                    this.groupChatList.forEach(chatGroup => {
                        if (res.roomSign == chatGroup.room__roomSign) {
                            chatGroup['hasNewMsg'] = true;
                            that.tabTitle[1]['hasGroupNewMsg'] = true
                            uni.showTabBarRedDot({
                                index:3
                            })
                        }
                    })
                    uni.setStorageSync('CHAT_GROUP_LIST', this.groupChatList)
                    uni.setStorageSync('GROUP_FRIEND_HASPOINT',this.tabTitle)
                })

                this.getGroupChatList();
            }
        },
        //聊天
        toChat() {
            uni.navigateTo({
                url: '/pages/chatPage/chatPage'
            })
        },
        //获取私聊好友列表
        async getPrivateChatList() {
            let json = await api.getNewFriendList({
                query: {
                    sign: this.userSign
                }
            })

            if (json.data.errcode == 200) {

                if (uni.getStorageSync('CHAT_FRIEND_LIST').length == 0) {
                    this.privateChatList = json.data.friendList;
                    uni.setStorageSync('CHAT_FRIEND_LIST',this.privateChatList);

                } else {

                    if (this.privateChatList.length < json.data.friendList.length) {

                        console.log('缓存的数据比线上的少========================')

                        let a = json.data.friendList;
                        let b = uni.getStorageSync('CHAT_FRIEND_LIST');

                        for (var i = 0; i < b.length; i++) {
                            for (var j = 0; j < a.length; j++) {
                                if (a[j].friend__sign == b[i].friend__sign) {
                                    a.splice(j, b.length);
                                    j = j - 1;
                                }
                            }
                        }

                        console.log('-----------------------ssssssssss',a)
                        this.privateChatList = [...a,...b];
                        uni.setStorageSync('CHAT_FRIEND_LIST',this.privateChatList);
                    }else if(this.privateChatList.length > json.data.friendList.length){
                        // let a = json.data.friendList;
                        // let b = uni.getStorageSync('CHAT_FRIEND_LIST');
                        //
                        // for (var i = 0; i < b.length; i++) {
                        //     for (var j = 0; j < a.length; j++) {
                        //         if (a[j].friend__sign == b[i].friend__sign) {
                        //             a.splice(j, b.length);
                        //             j = j - 1;
                        //         }
                        //     }
                        // }
                        console.log('好友被删除了 看缓存的数据=======>',a)
                        console.log('好友被删除了 看线上回来的数据=======>',b)
                        // this.privateChatList = [...a,...b];
                        // uni.setStorageSync('CHAT_FRIEND_LIST',this.privateChatList);
                    }else if(this.privateChatList.length == json.data.friendList.length){

                        console.log('从私聊界面返回================》》》》》')
                        let chatFList = uni.getStorageSync('CHAT_FRIEND_LIST');

                        chatFList.forEach(res => {
                            let strange = uni.getStorageSync('chatList:' + res.friend__sign);

                            if (strange.length != 0) {
                                let chatMsg = strange[strange.length - 1];
                                res['lastChatMsg'] = chatMsg.content.indexOf('https://cdn4game.xunyi.online') == 0 ?'[图片]':chatMsg.content;
                                res['time'] = strange[strange.length - 1].time;


                            }
                        })

                        this.privateChatList = chatFList;

                        uni.setStorageSync('CHAT_FRIEND_LIST',this.privateChatList);
                    }
                }

            }
        },
        // 获取已聊天过的群聊列表
        async getGroupChatList() {
            let json = await api.getGroupChatList({
                query: {
                    sign: this.userSign
                }
            })

            if (json.data.errcode == 200) {
                if (uni.getStorageSync('CHAT_GROUP_LIST').length == 0) {
                    this.groupChatList = json.data.roomList;
                    uni.setStorageSync('CHAT_GROUP_LIST',this.groupChatList);
                } else {
                    //判断是否有新的好友加入
                    if(uni.getStorageSync('CHAT_GROUP_LIST').length < json.data.roomList.length ){

                        console.log('有新的群聊加入========》')

                        let a = json.data.roomList;
                        let b = uni.getStorageSync('CHAT_GROUP_LIST');

                        for (var i = 0; i < b.length; i++) {
                            for (var j = 0; j < a.length; j++) {
                                if (a[j].room__roomSign == b[i].room__roomSign) {
                                    a.splice(j, b.length);
                                    j = j - 1;
                                }
                            }
                        }
                        this.groupChatList = [...a,...b];
                        uni.setStorageSync('CHAT_GROUP_LIST',this.groupChatList);
                    }else if(uni.getStorageSync('CHAT_GROUP_LIST').length > json.data.roomList.length){

                    }else{
                        this.groupChatList = uni.getStorageSync('CHAT_GROUP_LIST')
                    }
                }
            }
        }
    }
}
