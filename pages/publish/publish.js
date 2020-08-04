import api from '../../utils/request/api';
import constant from '../../utils/constant';
import {sensitiveWord} from '../../utils/sensitiveWorld';
import luchAudio from '../../components/luch-audio/luch-audio';


let that;
export default {
    components: {
        luchAudio
    },
    data() {
        return {
            inputText: '',
            userSign: '',
            imagesList: [],
            videoList: '',
            audioList: '',
            realImgUrlList: [],
            realVideoUrlList: '',
            realAudioUrlList: '',
            publishType: '',
            dynamicSign: '',
            audioPlay: false,
            audioIsAuthor:Boolean,
            list: [
                '随便写写',
                '以书会友',
                '百团大战',
                '约起开黑',
                '操场相见',
                '个人杂物',
                '校园爱情'
            ],
            chooseTab:null,
            tabsText:null,
            commentType:null,
            showTag:false,
            showSchoolList:false,
            showCreatSchool:false,
            roomList:[],
            chooseSchool:null,
            groupChatAvatar:'../../static/images/upload.png',
            groupChatName:'',
            groupChatDescribe:'',
            groupChatText:'邀请他人加入',
            showgroupChatText:false,
            creatSchoolGrounpName:'',
            showBtn:false,
            chooseActiveTab:false
        }
    },
    onLoad(option) {
        this.publishType = option.publishType;
        this.dynamicSign = option.dynamicSign;
        //动态修改顶部导航
        uni.setNavigationBarTitle({
            title: option.publishType == 'publishDynamic' ? '发表动态' : '发表评论'
        })


    },

    onReady() {
        that = this;
        this.userSign = constant.getUserSign();
        this.audioIsAuthor = constant.getAudioIsAuthor('AUDIO_IS_AUTHOR');

        this.$recorderManager.onStop(async (res) => {
            uni.showLoading({
                title: "音频上传中...",
                mask: true
            })
            this.audioList = res.tempFilePath;

            let json = await api.uploadVideoFile({
                query: {
                    data: {sign: that.userSign},
                    filePath: res.tempFilePath,
                    key: 'file'
                }
            })

            if (json.statusCode == 200) {
                uni.hideLoading();
                let data = JSON.parse(json.data);
                that.realAudioUrlList = data.url;
            }
        })
    },
    methods: {
        preViewImg(index, imgList) {
            uni.previewImage({
                current: index,
                urls: imgList
            });
        },

        // 上传本地图片
        uploadImage() {
            uni.authorize({
                scope: "scope.camera",
                success: () => {
                    uni.chooseImage({
                        sizeType: ['compressed'],
                        sourceType: ['album', 'camera'],
                        success: (chooseImageRes) => {
                            // uni.showLoading();
                            if (chooseImageRes.errMsg == 'chooseImage:ok') {

                                //遍历上传图片
                                chooseImageRes.tempFilePaths.forEach(async (res) => {
                                    //本地路径
                                    that.imagesList.push(res);

                                })
                            }
                        }
                    });
                },
                fail:(err)=>{

                    if(err.errMsg!="authorize:fail auth deny"){
                        uni.showModal({
                            content:'检测到您没打开获取信息功能权限，是否去设置打开？',
                            confirmText: "确认",
                            cancelText:'取消',
                            success: (res) => {
                                if(res.confirm){
                                    uni.openSetting({
                                        success: (res) => {
                                            console.log('拒绝授权->>>',res);
                                        }
                                    })
                                }else{
                                    console.log('取消');
                                }
                            }
                        })
                    }

                }
            })
        },
        //获取线上地址图片
        uploadVideo() {
            uni.authorize({
                scope: "scope.camera",
                success() {
                    let sign = constant.getUserSign();
                    uni.chooseVideo({
                        count: 1,
                        sizeType: ['compressed'],
                        sourceType: ['camera', 'album'],
                        success: async function (res) {
                            uni.showLoading({
                                title: '上传视频中...',
                                mask: true
                            })
                            if (res.errMsg == 'chooseVideo:ok') {
                                // that.videoList.push(res.tempFilePath);
                                that.videoList = res.tempFilePath;

                                let json = await api.uploadVideoFile({
                                    query: {
                                        data: {sign: that.userSign},
                                        filePath: res.tempFilePath,
                                        key: 'file'
                                    }
                                })

                                let jsonData = JSON.parse(json.data);

                                if (jsonData.errcode == 200) {
                                    uni.hideLoading();
                                    that.realVideoUrlList = jsonData.url;
                                }
                            }

                        }
                    });
                },
                fail(err) {//拒绝授权

                    if(err.errMsg != "authorize:fail auth deny"){
                        uni.showModal({
                            content:'检测到您没打开获取信息功能权限，是否去设置打开？',
                            confirmText: "确认",
                            cancelText:'取消',
                            success: (res) => {
                                if(res.confirm){
                                    uni.openSetting({
                                        success: (res) => {
                                            console.log('拒绝授权->>>',res);
                                        }
                                    })
                                }else{
                                    console.log('取消');
                                }
                            }
                        })
                    }
                }
            })
        },

        //开始录音
        startRecord() {
            uni.authorize({
                scope: "scope.record",
                success:(res)=>{
                    this.audioIsAuthor = true
                    constant.setAudioIsAuthor('AUDIO_IS_AUTHOR',this.audioIsAuthor)
                    that.$recorderManager.start();
                },
                fail:(err)=>{
                    this.audioIsAuthor = false;
                    constant.setAudioIsAuthor('AUDIO_IS_AUTHOR',this.audioIsAuthor)

                    if(err.errMsg != "authorize:fail auth deny"){
                        uni.showModal({
                            content:'检测到您没打开获取信息功能权限，是否去设置打开？',
                            confirmText: "确认",
                            cancelText:'取消',
                            success: (res) => {
                                if(res.confirm){
                                    uni.openSetting({
                                        success: (res) => {
                                            console.log('拒绝授权->>>',res);
                                        }
                                    })
                                }else{
                                    console.log('取消');
                                }
                            }
                        })
                    }

                }
            })

        },
        //长按录音
        longToTouch(e) {
            console.log('longToTouch')
        },
        //结束录音
        endRecord() {
            if(this.audioIsAuthor){
                this.$recorderManager.stop();
            }
        },
        controlAudioPlay() {
            if (!this.audioPlay) {
                this.audioPlay = true;
            } else {
                this.audioPlay = false;
            }
        },
        uploadEmoji() {

        },
        del(delType, index) {
            if (delType == 'img') {
                this.imagesList.splice(index, 1)
            } else if (delType == 'video') {
                this.videoList = '';
            }
        },

        //发表动态
        async pushDynamic() {
            console.log(this.userSign)
            let json = await api.sendDynamic({
                query: {
                    sign: this.userSign,
                    content: this.inputText,
                    type:this.commentType,
                    imgList: this.realImgUrlList || [],
                    video: this.realVideoUrlList || null,
                    audio: this.realAudioUrlList || null,
                    roomId: this.chooseRoomId
                }
            })
            if (json.data.errcode == 200) {
                uni.hideLoading();
                uni.navigateBack({
                    delta: 1
                });
            }
        },
        //发表评论
        async pushComment() {
            let json = await api.addComment({
                query: {
                    sign: this.userSign,
                    dynamicSign: this.dynamicSign,
                    comment: {
                        content: this.inputText,
                        imgList: this.realImgUrlList,
                        video: this.realVideoUrlList
                    },
                }
            })
            if (json.data.errcode == 200) {
                uni.hideLoading();
                uni.navigateBack({
                    delta: 1
                });
            }
        },
        async publish() {
            if (this.inputText == '') {
                uni.showToast({
                    title: "内容不能为空！",
                    mask: true,
                    icon: 'none'
                })
                return;
            }
            sensitiveWord.forEach((res,index) => {

                let reg = new RegExp(res,'ig');
                //判断字符串相等
                if(that.inputText == res){
                    let a = ""
                    for (var i = 0; i < res.length; i++) {
                        a += "*"
                    }
                    that.inputText = that.inputText.replace(reg, a);
                }
            })

            uni.showLoading({
                title: '上传中...',
                mask: true
            })

            if (this.imagesList.length != 0) {
                for (let i = 0; i < this.imagesList.length; i++) {
                    //线上路径
                    let json = await api.uploadImages({
                        query: {
                            filePath: this.imagesList[i],
                            data: {sign: that.userSign},
                            key: 'img'
                        }
                    })
                    let reData = JSON.parse(json.data)

                    new Promise((resolve, reject) => {
                        if (reData.errcode == 200) {
                            resolve(i);
                        }
                    }).then(async data => {
                        that.realImgUrlList.push(reData.img);
                        if (data == that.imagesList.length - 1) {

                            if (this.publishType == 'publishDynamic') {
                                that.pushDynamic()

                            } else if (this.publishType == 'commentDynamic') {
                                that.pushComment()
                            }

                        }
                    })
                }
            } else {
                if (this.publishType == 'publishDynamic') {
                    that.pushDynamic()

                } else if (this.publishType == 'commentDynamic') {
                    that.pushComment()
                }
            }
        },
        /*创建群聊*/
      async  creatQun(){
          let userInfo = constant.getUserLogin();
          //已经加入的群聊
            let res01= await api.getGroupChatList({
                query:{
                    sign:that.userSign
                }
            })
          let res02= await api.getSchoolChatRoom({
              query:{
                  sign:that.userSign,
                  schoolName:userInfo.schoolName
              }
          })
          if (res01.data.errcode ==200 || res02.data.errcode ==200){
              this.roomList=res01.data.roomList
              // this.roomList.push(res01.data.roomList)
              // this.roomList.push(res02.data.roomList)
              this.showBtn=true
              //测试
              // this.showSchoolList=true
              // this.showCreatSchool=true
              console.log(res.data)
          }

        },
        /*标签的选择*/
        chooseHuaTi(){
            this.chooseActiveTab=true
        },
        activeTab(val){
         console.log(val)
            switch(val) {
                case 0:
                    this.tabsText='随便写写'
                    this.chooseTab=0
                    this.commentType=0
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                case 1:
                 this.tabsText='以书会友'
                    this.chooseTab=1
                       this.commentType=1
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                case 2:
                  this.tabsText='百团大战'
                    this.chooseTab=2
                       this.commentType=2
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                case 3:
                   this.tabsText='约起开黑'
                    this.chooseTab=3
                       this.commentType=3
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                case 4:
                   this.tabsText='操场相见'
                    this.chooseTab=4
                       this.commentType=4
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                case 5:
                  this.tabsText='个人杂物'
                    this.chooseTab=5
                       this.commentType=5
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                case 6:
                 this.tabsText='校园爱情'
                    this.chooseTab=6
                       this.commentType=6
                    this.showTag=true
                     this.chooseActiveTab=false
                    break;
                default:
                    // 默认代码块
                   // this.switchTabs(0)
                   //  this.chooseTab=0
                    console.log('tabs栏炸了')
            }
        },
        closeTag(){
            console.log('关闭便签')
            this.commentType=null
            this.chooseTab=null
            this.showTag=false
            this.chooseActiveTab=false
        },
        /**群聊选择
         * */
        // radioGroupChange(val){
        //     console.log('radioGroupChange>>>',val)
        // },
        radioChange(val){
            console.log('radioChange>>>',val[0])
            for (let i=0;i<=this.roomList.length;i++){
                if (i==val[0]){
                    console.log(this.roomList[i])
                    this.chooseRoomId=this.roomList[i].roomSign
                    this.creatSchoolGrounpName=this.roomList[i].roomName
                    this.showgroupChatText=true
                }
            }
            // this.chooseRoomId=val
            // this.roomList.map(e=>{
            //     if (e.roomSign==val){
            //         console.log(e.roomName)
            //         this.creatSchoolGrounpName=e.roomName
            //         this.showgroupChatText=true
            //     }
            // })
            this.showSchoolList=false

        },
        /*创建群聊*/
        //取消创建
        canelCreatSchoolGrounp(){
            this.showCreatSchool=false
        },
        //选择头像
        chooseAvater(){
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success:(res)=> {
                    console.log(res.tempFilePaths[0]);
                    this.groupChatAvatar=res.tempFilePaths[0]
                }
            });
        },
        //btn创建群聊
       async creatSchoolGrounp(){
            //上传头像
            this.upLoadAvatar(this.groupChatAvatar)
            // let res= await api.
        },
        //上传头像
        async upLoadAvatar(val){
            let resImg = await api.uploadImages({
                query: {
                    data: {sign: this.userSign},
                    filePath: val,
                    key: 'img'
                }
            })
            // console.log(JSON.parse(resImg.data))
            const status = JSON.parse(resImg.data).errcode
            const avatar = JSON.parse(resImg.data).img
            if (status ==200){
                this.creatGronp(avatar)
            }else {

            }

        },
        //创建群聊
        async  creatGronp(val){
            let res=await api.applyNewChatRoom({
                query:{
                    sign:this.userSign,
                    roomName:this.groupChatName,
                    describe:this.groupChatDescribe,
                    pic:val
                }
            })
         this.creatSchoolGrounpName=this.groupChatName
            this.showgroupChatText=true
            console.log('申请群聊',res.data)
            this.showCreatSchool=false
        },
        closeGroupTag(){
            this.chooseRoomId=null
            this.showgroupChatText=false
        },
        /*选择群聊该功能*/
        btnCreatGroupChat(){
            this.showBtn=false
            this.showCreatSchool=true
        },
        btnChooseGroupChat(){
            this.showBtn=false
            this.showSchoolList=true
        },

    }
}
