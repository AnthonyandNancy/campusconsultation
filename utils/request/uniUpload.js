import util from '../util'

let API_SECRET_KEY = 'www.mall.cycle.com'
let TIMESTAMP = util.getCurrentTime()

const uniRequest = async (params = {}, url) => {
	let data = params.query || {}
	data.time = util.getCurrentTime()
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: url, //仅为示例，非真实的接口地址
			name: data.key,
			formData: {
				'sign': data.data.sign
			},
			filePath: data.filePath,
			success: (uploadFileRes) => {
				console.log("上传成功" + JSON.stringify(uploadFileRes) );
				return resolve(uploadFileRes)
			},
			fail: (err) => {
				console.log(err)
				return resolve(err)
			}
		});
	})
}

export default uniRequest

