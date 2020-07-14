import util from '../util'
// import api from '../request/api'

const uniRequest =async (params ={},url) =>{
    let data = params.query || {};
    data.time = util.getCurrentTime();

    return  new Promise((resolve, reject)=>{
        uni.request({
            url: url,
            data: data,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: async (res) => {
                return resolve(res);

                if (res.errcode == 401) {
                    uni.showToast({
                        title: "登录过期",
                        icon: "none",
                        mask: true,
                    })
                }
            },
            fail: async (err) => {
                return resolve(err)
            }
        })
    })
}
export default uniRequest
