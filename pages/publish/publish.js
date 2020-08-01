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
            audioIsAuthor:Boolean
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
            let json = await api.sendDynamic({
                query: {
                    sign: this.userSign,
                    content: this.inputText,
                    imgList: this.realImgUrlList || [],
                    video: this.realVideoUrlList || null,
                    audio: this.realAudioUrlList || null
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
        }
    }
}
