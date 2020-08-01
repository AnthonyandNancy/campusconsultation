export const USER_SPECIAL_INFO = 'userSpecialInfo'
export const USER_TOKEN = 'userToken'


// 管理账号信息(缓存的数据命名)
const USER_SIGN = '';
const USER_INFO = '';
const SCHOOL_INFO = '';
const IS_AUTHOR = '';
const AUDIO_IS_AUTHOR = '';
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




/**
 * set****  增加缓存的函数
 * @type {String}
 */
const setUserSign = (res)=>{
	uni.setStorageSync('USER_SIGN', res);
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



export default {
    getUserSign,
	getUserInfo,
	getSchoolInfo,
	getIsAuthor,
	getAudioIsAuthor,

    setUserSign,
	setUserInfo,
	setSchoolInfo,
	setIsAuthor,
	setAudioIsAuthor
}
