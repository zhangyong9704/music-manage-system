import request from '@/utils/request';

/*
* 主页信息查询
* */
export default {

    fetchData(){
        return request({
            url: './table.json',
            method: 'get',
            params: query
        });
    },

    /*主页歌手、歌曲、歌单数量查询*/
    indexCount() {
        return request({
            url: `index/counts`,
            method: 'get',
        })
    }
}

