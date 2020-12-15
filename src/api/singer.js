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
    getSingerPagesInfo(query,singerQueryVo){
        return request({
            url:`/singer/querySingers/${query.pageIndex}/${query.pageSize}`,
            method:'post',
            data: singerQueryVo,
        })
    },

    //确定保存新增歌手信息
    saveAddSinger(singer) {
        return request({
            url:`/singer/add`,
            method:'post',
            data:singer
        })
    },

    //根据ID删除歌手信息
    deleteSingerByID(id){
        return request({
            url:`/singer/deleteSinger/${id}`,
            method:'delete',
        })

    }


}
