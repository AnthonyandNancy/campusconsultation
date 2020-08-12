import api from '../../../utils/request/api'
import navTab_loadRefresh from "../../../components/navTab_loadRefresh";
import constant from "../../../utils/constant";


export default {
    components: {
        navTab_loadRefresh,
    },
    data() {
        return {
            viewHeight: 0,
            userSign: '',
            getSchoolName: '',
            tabTitle: ['私聊', '群聊'],
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
        uni.getSystemInfo({
            success: (data) => {
                this.viewHeight = data.windowHeight;
            }
        })
    },
    onShow() {
        let chatGroupList = uni.getStorageSync('CHAT_GROUP_LIST');
        let chatFriendList = uni.getStorageSync('CHAT_FRIEND_LIST')
        let groupObj = {};
        let friendObj = {};

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
                        }else{
                            uni.showTabBarRedDot({
                                index:3
                            })
                        }
                    }
                }
            }).then(res=>{
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
                                index:3
                            })
                        }else{
                            uni.showTabBarRedDot({
                                index:3
                            })
                        }
                    }
                }
            })

        this.userSign = constant.getUserSign();
        if (constant.getUserSign().length != 0) {
            this.getGroupChatList();
            this.getPrivateChatList();
        }


        //监听群聊
        uni.$on('getGroupChat', (res) => {
            this.groupChatList.forEach(chatGroup => {
                if (res.roomSign == chatGroup.room__roomSign) {
                    chatGroup['hasNewMsg'] = true;
                }
            })
            uni.setStorageSync('CHAT_GROUP_LIST', this.groupChatList);
        })

        //监听私聊
        uni.$on('getPrivateLastChat', (res) => {
            this.privateChatList.forEach(friend => {
                if (res.sign == friend.friend__sign) {
                    friend.lastChatMsg = res.content.indexOf('https://cdn4game.xunyi.online') == 0 ?'[图片]':res.content;
                    friend.time = res.time;
                    friend['hasPrivateNewMsg'] = res.hasPrivateNewMsg;
                }
            })
            uni.setStorageSync('CHAT_FRIEND_LIST', this.privateChatList);
        })
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
            // console.log('加载更多哦');
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
                this.getPrivateChatList();
            } else if (this.currentTab == 1) {
                this.groupChatList = []
                this.getGroupChatList();
            }
            // console.log('刷新了');
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
                // this.privateChatList = json.data.friendList;

                if (uni.getStorageSync('CHAT_FRIEND_LIST').length == 0) {
                    this.privateChatList = json.data.friendList;
                } else {

                    if (this.privateChatList.length < json.data.friendList.length) {
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
                        this.privateChatList = [...a,...b];

                    } else {
                        let chatFList = uni.getStorageSync('CHAT_FRIEND_LIST');
                        chatFList.forEach(res => {
                            let strange = uni.getStorageSync('chatList:' + res.friend__sign);
                            if (strange.length != 0) {
                                res['lastChatMsg'] = strange[strange.length - 1].content;
                                res['time'] = strange[strange.length - 1].time;
                            }
                        })

                        this.privateChatList = chatFList;
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
                } else {
                    this.groupChatList = uni.getStorageSync('CHAT_GROUP_LIST');

                }
            }
        },
    }
}
