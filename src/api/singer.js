import request from '@/utils/request';
/*
* 歌手管理
* */
export default {

    /*
    获取歌手所有信息(不带筛选条件)
     */
    getSingerAllInfo(){
        return request({
            url: `singer/querySingers`,
            method: 'get',
        })
    },

    /*
    分页获取歌手信息
     */
    getSingerPagesInfo(query){
        return request({
            url:`/singer/querySingers/${query.pageIndex}/${query.pageSize}`,
            method:'post',
        })
    },


}
