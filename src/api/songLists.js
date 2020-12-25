import request from '@/utils/request';
/*
* 歌单管理
* */
export default {

    /*
    获取歌曲所有信息(不带筛选条件)
     */
    getSongListsAllInfo(){
        return request({
            url: `/song-list/querySongList`,
            method: 'get',
        })
    },

    /*
    分页获取歌单信息
     */
    getSongListsPagesInfo(query,songListQueryVo){
        return request({
            url:`/song-list/querySongList/${query.pageIndex}/${query.pageSize}`,
            method:'post',
            data:songListQueryVo
        })
    },

    //确定保存新增歌单信息
    saveAddSongLists(songList) {
        return request({
            url:`/song-list/add`,
            method:'post',
            data:songList
        })
    },

    //根据ID删除歌单信息
    deleteSongListsByID(id){
        return request({
            url:`/song-list/deleteSongList/${id}`,
            method:'delete',
        })
    },

    //批量删除操作
    deleteMultipleSelection(params=[]){
        return request({
            url:`/song-list/deleteBatch/${params}`,
            method:'delete',
        })
    },

    //修改歌单信息
    updateSongLists(songList){
        return request({
            url:`/song-list/update`,
            method:'put',
            data:songList
        })
    },

    //删除歌曲封面和音乐文件统一删除删除方法
    deletePreviousCover(filePath){
        return request({
            url:`/song-list/delete-upload`,
            method:'post',
            params: {
                filePath
            }
        })
    }

}
