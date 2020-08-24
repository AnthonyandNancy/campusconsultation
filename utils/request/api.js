import uniRequest from '../request/uniRequest'
import uniUpload from '../request/uniUpload'

const base_URL = 'https://pets.neargh.com';
// 测试接口
// const requresyUrl = (params) => uniRequest(params,base_URL + '/tucaolove_wx/api/userRankingList')

//登录接口
const getLogin = (params) => uniRequest(params,base_URL + '/SchoolLian_wx/api/login');

//更新用户信息数据
const  updateUserInfo = (params) =>uniRequest(params,base_URL + '/SchoolLian_wx/api/updateUserMsg')

//获取当前的定位
const  getLocation = (params) =>uniRequest(params,base_URL + '/SchoolLian_wx/api/getLocation')

//获取学校列表
const getSchoolList = (params)=> uniRequest(params,base_URL + '/SchoolLian_wx/api/getSchoolList');

//搜索学校
const searchSchool = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/searchCampusList');

//获取动态列表
const getDynamicList = (params)=> uniRequest(params,base_URL + '/SchoolLian_wx/api/getDynamicList');

//更新用户院校
const updateUserSchool = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/updateCampus');

// 发送动态
const sendDynamic = (params)=> uniRequest(params,base_URL + '/SchoolLian_wx/api/addDynamicContent');

//获取单条动态内容
const  getOnlyDynamic = (params)=> uniRequest(params,base_URL + '/SchoolLian_wx/api/getDynamicContent');

//上传图片
const uploadImages = (params) => uniUpload(params , base_URL + '/SchoolLian_wx/api/uploadSingleImg');

//上传视频文件
const uploadVideoFile = (params)=>uniUpload(params,base_URL + '/SchoolLian_wx/api/uploadFile');

//申请新房间
const  applyNewChatRoom = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/chatRoomApply');

//获取提交审核的房间列表
const  getApplyChatRoom = (params) =>uniRequest(params,base_URL + '/SchoolLian_wx/api/getApplyChatRoomList')

//获取校园聊天房间
const getSchoolChatRoom = (params)=> uniRequest(params,base_URL + '/SchoolLian_wx/api/getCampusChatRoom');

//添加单聊好友
const addNewFriend = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/addNewFriend');

//获取好友列表
const getNewFriendList = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/getFriendList');

//加入群聊
const joinGroupChat = (params)=>uniRequest(params,base_URL+'/SchoolLian_wx/api/add2GroupChat');

//获取加入的群聊列表（即已经参加过群聊的列表）
const getGroupChatList = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/getGroupChatList');

//添加评论
const addComment = (params)=>uniRequest(params,base_URL+ '/SchoolLian_wx/api/addDynamicComment');

//获取评论列表
const getCommentList = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/getDynamicCommentList')

//点赞动态
const addSupport = (params)=>uniRequest(params,base_URL + '/SchoolLian_wx/api/dynamicLike');

//获取点赞列表
const getSupportList = (params) => uniRequest(params,base_URL+ '/SchoolLian_wx/api/getMyLikeDynamicContent');

//点击关注
const setFollow = (params) => uniRequest(params,base_URL+ '/SchoolLian_wx/api/followOther');

// 取消关注
const cancelFollow = (params) => uniRequest(params,base_URL+ '/SchoolLian_wx/api/cancelFollow');

// 检查是否关注
const checkFollow = (params) => uniRequest(params,base_URL+ '/SchoolLian_wx/api/checkFollowRelation');

// 我关注的用户列表
const getFollowList = (params) => uniRequest(params,base_URL+ '/SchoolLian_wx/api/getFollowUserList');

//关注我的用户列表
const getFollowMineList = (params) => uniRequest(params,base_URL+ '/SchoolLian_wx/api/getFollowerUserList');

//分享动态
const shareDynamic = (params) => uniRequest(params,base_URL + '/SchoolLian_wx/api/dynamicShare');

//陌生人匹配
const getRandomMatchUser = (params) => uniRequest(params,base_URL + '/SchoolLian_wx/api/getRandomMatchUser');

export default {
    // requresyUrl,
    getLogin,
    updateUserInfo,
    getLocation,
    getSchoolList,
    getDynamicList,
    searchSchool,
    updateUserSchool,
    sendDynamic,
    getOnlyDynamic,
    uploadImages,
    uploadVideoFile,
    applyNewChatRoom,
    getApplyChatRoom,
    getSchoolChatRoom,
    addNewFriend,
    getNewFriendList,
    joinGroupChat,
    getGroupChatList,
    addComment,
    getCommentList,
    addSupport,
    getSupportList,
    setFollow,
    cancelFollow,
    checkFollow,
    getFollowList,
    getFollowMineList,
    shareDynamic,
    getRandomMatchUser
}

