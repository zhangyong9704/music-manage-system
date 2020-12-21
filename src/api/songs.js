import request from '@/utils/request';
/*
* 歌曲管理
* */
export default {

    /*
    获取歌曲所有信息(不带筛选条件)
     */
    getSingerAllInfo(){
        return request({
            url: `song/querySongs`,
            method: 'get',
        })
    },

    /*
    分页获取歌曲信息
     */
    getSongsPagesInfo(query,songQueryVo){
        return request({
            url:`/song/querySongs/${query.pageIndex}/${query.pageSize}`,
            method:'post',
            data:songQueryVo
        })
    },

    //确定保存新增歌曲信息
    saveAddSongs(song) {
        return request({
            url:`/song/add`,
            method:'post',
            data:song
        })
    },

    //根据ID删除歌曲信息
    deleteSongsByID(id){
        return request({
            url:`/song/deleteSong/${id}`,
            method:'delete',
        })
    },

    //批量删除操作
    deleteMultipleSelection(params=[]){
        return request({
            url:`/song/deleteBatch/${params}`,
            method:'delete',
        })
    },

    //修改歌手信息
    updateSongs(songs){
        return request({
            url:`/song/update`,
            method:'put',
            data:songs
        })
    },

    //删除歌曲封面和音乐文件统一删除删除方法
    deleteSongsCoverAndFiles(filePath){
        return request({
            url:`/song/delete-upload`,
            method:'post',
            params: {
                filePath
            }
        })
    }

}
