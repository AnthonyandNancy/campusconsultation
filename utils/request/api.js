import uniRequest from '../request/uniRequest'

const base_URL = 'https://pets.neargh.com';
const requresyUrl = (params) => uniRequest(params,base_URL + '/tucaolove_wx/api/userRankingList')


export default {
    requresyUrl

}

