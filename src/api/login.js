import request from '@/utils/request';
/*
* 登录实现
* */
export default {

     loginInfo(params) {
         return request({
             url: `admin/login/status`,
             params: params,
             method: 'post',
         })
     }
}
