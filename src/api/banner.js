import request from '@/utils/request';
/*
* banner管理
* */
export default {

    /*
    获取歌手所有信息(不带筛选条件)
     */
    getBannerAllInfo(){
        return request({
            url: `banner/queryBanner`,
            method: 'post',
        })
    },

    /*
    分页获取歌手信息
     */
    getBannerPagesInfo(query,bannerQueryVo){
        return request({
            url:`banner/queryBanner/${query.pageIndex}/${query.pageSize}`,
            method:'post',
            data: bannerQueryVo,
        })
    },

    //确定保存新增歌手信息
    saveAddBanner(Banner) {
        return request({
            url:`/Banner/add`,
            method:'post',
            data:Banner
        })
    },

    //根据ID删除歌手信息
    deleteBannerByID(id){
        return request({
            url:`/Banner/deleteBanner/${id}`,
            method:'delete',
        })
    },

    //批量删除操作
    deleteMultipleSelection(params=[]){
        return request({
            url:`/Banner/deleteBatch/${params}`,
            method:'delete',
        })
    },

    //修改歌手信息
    updateBanner(Banner){
        return request({
            url:`/Banner/update`,
            method:'put',
            data:Banner
        })
    },

    //删除上次图片
    deletePreviousCover(filePath){
        return request({
            url:`/Banner/delete-upload`,
            method:'post',
            params: {
                filePath
            }
        })
    }


}
