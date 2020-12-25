import request from '@/utils/request';
/*
* 歌单、歌曲关联表管理
* */
export default {

    /*
    分页获取歌单-歌曲信息 -- 条件歌曲信息分页查询
     */
    getListSongListPagesInfo(query,listSongsQueryVo){
        return request({
            url:`/list-song/queryListSongs/${query.pageIndex}/${query.pageSize}`,
            method:'post',
            data: listSongsQueryVo
        })
    },

    //确定保存新增歌单-歌曲信息
    saveAddSongLists(song,id) {
        return request({
            url:`/list-song/add/${id}`,
            method:'post',
            data:song
        })
    },

    //根据ID删除歌单-歌曲列表信息
    deleteSongListsByID(id,songId){
        return request({
            url:`/list-song/deleteListSong/${id}/${songId}`,
            method:'delete',
        })
    },

    //批量删除操作
    deleteMultipleSelection(params=[],id){
        return request({
            url:`/list-song/deleteBatch/${params}/${id}`,
            method:'delete',
        })
    },

    //修改歌单信息
    // updateSongLists(songList){
    //     return request({
    //         url:`/song-list/update`,
    //         method:'put',
    //         data:songList
    //     })
    // },

    //删除歌曲封面和音乐文件统一删除删除方法
    // deletePreviousCover(filePath){
    //     return request({
    //         url:`/song-list/delete-upload`,
    //         method:'post',
    //         params: {
    //             filePath
    //         }
    //     })
    // }

}
