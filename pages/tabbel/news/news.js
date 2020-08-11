import api from '../../../utils/request/api'
import navTab_loadRefresh from "../../../components/navTab_loadRefresh";
import constant from "../../../utils/constant";

export default {
    components:{
        navTab_loadRefresh,
    },
    data() {
        return {
            viewHeight:0,
            userSign:'',
            getSchoolName:'',
            tabTitle:['私聊','群聊'],
            totalPage:1,
            currPage:2,
            currentTab:0,
            chatType:'私聊',
            schoolName: '',
            privateChatList:[],
            groupChatList:[]
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
            success:(data)=>{
                this.viewHeight = data.windowHeight;
            }
        })

       // //监听群聊
       // uni.$on('getGroupChat',(res)=>{
       //     console.log(';;;;;;;;;;;;;;;;',this.groupChatList)
       //     this.groupChatList.forEach(chatGroup=>{
       //         if(res.roomSign == chatGroup.room__roomSign){
       //             chatGroup['hasNewMsg'] = true;
       //         }else{
       //             chatGroup['hasNewMsg'] = false;
       //         }
       //     })
       //
       //     uni.setStorageSync('CHAT_GROUP_LIST',this.groupChatList);
       //
       //     console.log('群聊getGroupChat============。。。。。。》》',this.groupChatList)
       // })
    },
    onShow(){
        let chatMsg = uni.getStorageSync('CHAT_GROUP_LIST');
        let obj = {};
        if(chatMsg.length != 0 ){
            chatMsg.forEach(res=>{
                if(obj[res.hasNewMsg] == undefined){
                    obj[res.hasNewMsg]  = 1
                }else{
                    obj[res.hasNewMsg]++;
                }
            })

            for(let key in obj){
                if(obj['true'] == 0 || obj['true'] == undefined){
                    uni.hideTabBarRedDot({
                        index: 1
                    })
                }
            }
        }


        this.userSign = constant.getUserSign();
        if(constant.getUserSign().length != 0){
            this.getGroupChatList();
            this.getPrivateChatList();
        }

        //监听群聊
        uni.$on('getGroupChat',(res)=>{
            // console.log(';;;;;;;;;;;;;;;;',this.groupChatList)
            this.groupChatList.forEach(chatGroup=>{
                if(res.roomSign == chatGroup.room__roomSign){
                    chatGroup['hasNewMsg'] = true;
                }
            })

            uni.setStorageSync('CHAT_GROUP_LIST',this.groupChatList);
            this.getGroupChatList();
            // console.log('群聊getGroupChat============。。。。。。》》',this.groupChatList)
        })
    },
    onReady(){
        uni.setStorageSync('IS_PREVIEW',false);

        this.userSign = constant.getUserSign();
        this.getSchoolName = constant.getUserInfo().schoolName;

        this.getPrivateChatList()
        this.getGroupChatList();

        //监听私聊
        uni.$on('getPrivateLastChat',(res)=>{
            this.privateChatList.forEach(friend=>{
                if(res.sign == friend.friend__sign){
                    friend.lastChatMsg = res.content;
                    friend.time = res.time;
                }
            })

            this.getPrivateChatList()
        })

        // uni.$on('getGroupChat',(res)=>{
        //     this.groupChatList.forEach(chatGroup=>{
        //         if(res.roomSign == chatGroup.room__roomSign){
        //             chatGroup['hasNewMsg'] = true;
        //         }
        //     })
        //
        //     uni.setStorageSync('CHAT_GROUP_LIST',this.groupChatList);
        //     this.getGroupChatList();
        // })

    },
    methods: {
        //新聊天室
        newRoom(){
            uni.navigateTo({
                url:'/pages/chatRoom/chatRoom'
            })
        },


        //改变tabbar
        changeTab(index){
            if(index == 0){
                this.chatType = '私聊'
            }else if(index == 1){
                this.chatType = '群聊'
            }
            this.currentTab = index;
        },
        loadMore(){
            // console.log('加载更多哦');
            if(this.currentTab == 0){
                this.currPage++;
                this.getPrivateChatList();
                that.$refs.hideLoading[0].loadOver()
            }else if(this.currentTab == 1){
                this.getGroupChatList();
            }
        },
        refresh(){
            if(this.currentTab == 0){
                this.privateChatList = [];
                this.getPrivateChatList();
            }else if(this.currentTab == 1){
                this.groupChatList = []
                this.getGroupChatList();
            }
            // console.log('刷新了');
        },
        //聊天
        toChat(){
            uni.navigateTo({
            	url:'/pages/chatPage/chatPage'
            })
        },
        //获取私聊好友列表
        async getPrivateChatList(){
            let json = await api.getNewFriendList({
                    query:{
                        sign:this.userSign
                    }
            })
            if(json.data.errcode == 200){
                // this.privateChatList = json.data.friendList;

                json.data.friendList.forEach(res=>{
                    let strange = uni.getStorageSync('chatList:'+res.friend__sign);
                    if(strange.length != 0){
                        res['lastChatMsg'] = strange[strange.length-1].content;
                        res['time'] = strange[strange.length-1].time;
                    }
                })
                this.privateChatList = json.data.friendList;
            }
            // setInterval(()=>{
            //     // console.log('开启')
            //     uni.getStorage({
            //         key: 'friList',
            //         success:  (res)=> {
            //             // console.log('好友列表>>>>>>',res.data)
            //             // console.log( this.privateChatList)
            //             this.privateChatList.map((e)=>{
            //                 // console.log(e)
            //                 if (e.friend__sign != res.data.friend__sign){
            //                     this.privateChatList.push(res.data)
            //                 }
            //             })
            //
            //
            //         }
            //     });
            // },1000)


        },
        // 获取已聊天过的群聊列表
        async getGroupChatList(){
            let json = await  api.getGroupChatList({
                query:{
                    sign:this.userSign
                }
            })

            if(json.data.errcode == 200){
                if(uni.getStorageSync('CHAT_GROUP_LIST').length == 0){
                    this.groupChatList = json.data.roomList;
                }else {
                    this.groupChatList = uni.getStorageSync('CHAT_GROUP_LIST');
                    if(this.groupChatList.length < json.data.roomList.length){
                        for(var i = 0;i < json.data.roomList.length; i++){
                            for(var j = 0; j < this.groupChatList.length; j++){
                                if(json.data.roomList[i].room__roomSign == this.groupChatList[j].room__roomSign){
                                    this.groupChatList.push(json.data.roomList[i]);
                                }
                            }
                        }
                    }
                }
                // console.log('群聊列表',this.groupChatList)
            }
        },
    }
}
