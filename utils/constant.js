export const USER_SPECIAL_INFO = 'userSpecialInfo'
export const USER_TOKEN = 'userToken'


// 管理账号信息(缓存的数据命名)
const USER_SIGN = '';
const USER_LOGIN = '';
const USER_INFO = '';
const SCHOOL_INFO = '';
const IS_AUTHOR = '';
const AUDIO_IS_AUTHOR = '';
const IS_PUBLISH = '';
const SELECT_TYPE = '';
const SWITCH_TYPE = '';
const STARS_STYLES = '';
const IS_UPDATE_SAVE_DATA = '';
const IS_COMMENT = '';
const IS_PREVIEW = '';


/**
 * get****  获取缓存的函数
 * @type {String}
 */


const getUserSign = ()=>{
	let ret = '';
	ret = uni.getStorageSync('USER_SIGN');
	if (!ret) {
		ret = '';
	}
	return ret;
}

const getUserLogin = ()=>{
	let ret = '';
	ret = uni.getStorageSync('USER_LOGIN');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getUserInfo = ()=>{
	let ret = '';
	ret = uni.getStorageSync('USER_INFO');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getSchoolInfo = ()=>{
	let ret = '';
	ret = uni.getStorageSync('SCHOOL_INFO');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getIsAuthor = ()=>{
	let ret = '';
	ret = uni.getStorageSync('IS_AUTHOR');
	if (!ret) {
		ret = '';
	}
	return ret;
}

const getAudioIsAuthor = ()=>{
	let ret = '';
		ret = uni.getStorageSync('AUDIO_IS_AUTHOR');
	if (!ret) {
		ret = '';
	}
	return ret;
}

const getSelectType = ()=>{
	let ret = '';
	ret = uni.getStorageSync('SELECT_TYPE');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getIsPublish = ()=>{
	let ret = '';
	ret = uni.getStorageSync('IS_PUBLISH');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getSwitchType = ()=>{
	let ret = '';
	ret = uni.getStorageSync('SWITCH_TYPE');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getStarStyle = ()=>{
	let ret = '';
	ret = uni.getStorageSync('STARS_STYLES');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getIsUpdateData = ()=>{
	let ret = '';
	ret = uni.getStorageSync('IS_UPDATE_SAVE_DATA');
	if (!ret) {
		ret = '';
	}
	return ret;
}

const getIsComment = ()=>{
	let ret = '';
	ret = uni.getStorageSync('IS_COMMENT');
	if (!ret) {
		ret = '';
	}
	return ret;
}
const getIsPreview = ()=>{
	let ret = '';
	ret = uni.getStorageSync('IS_PREVIEW');
	if (!ret) {
		ret = '';
	}
	return ret;
}


/**
 * set****  增加缓存的函数
 * @type {String}
 */
const setUserSign = (res)=>{
	uni.setStorageSync('USER_SIGN', res);
}
const setUserLogin = (res)=>{
	uni.setStorageSync('USER_LOGIN', res);
}
const setUserInfo = (res)=>{
	uni.setStorageSync('USER_INFO', res);
}
const setSchoolInfo = (res)=>{
	uni.setStorageSync('SCHOOL_INFO', res);
}

const setIsAuthor= (res)=>{
	uni.setStorageSync('IS_AUTHOR', res);
}

const setAudioIsAuthor= (res)=>{
	uni.setStorageSync('AUDIO_IS_AUTHOR', res);
}

const setSelectType= (res)=>{
	uni.setStorageSync('SELECT_TYPE', res);
}

const setIsPublish = (res)=>{
	uni.setStorageSync('IS_PUBLISH', res);
}

const setSwitchType = (res)=>{
	uni.setStorageSync('SWITCH_TYPE', res);
}

const setStarStyle = (res)=>{
	uni.setStorageSync('STARS_STYLES', res);
}

const setIsUpdateData= (res)=>{
	uni.setStorageSync('IS_UPDATE_SAVE_DATA', res);
}

const setIsComment= (res)=>{
	uni.setStorageSync('IS_COMMENT', res);
}

const setIsPreview= (res)=>{
	uni.setStorageSync('IS_PREVIEW', res);
}



export default {
    getUserSign,
	getUserLogin,
	getUserInfo,
	getSchoolInfo,
	getIsAuthor,
	getAudioIsAuthor,
	getSelectType,
	getIsPublish,
	getSwitchType,
	getStarStyle,
	getIsUpdateData,
	getIsComment,
	getIsPreview,


    setUserSign,
	setUserLogin,
	setUserInfo,
	setSchoolInfo,
	setIsAuthor,
	setAudioIsAuthor,
	setSelectType,
	setIsPublish,
	setSwitchType,
	setStarStyle,
	setIsUpdateData,
	setIsComment,
	setIsPreview

}
