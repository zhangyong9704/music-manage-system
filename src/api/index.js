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
    },


    /*获得歌手国际地区分布*/
    singerRegion() {
        return request({
            url: `index/singer_region`,
            method: 'get',
        })
    },

    /*获得歌手类型组合*/
    singersCombinationType() {
        return request({
            url: `index/singer_type`,
            method: 'get',
        })
    },


    /*获得歌单风格比例*/
    songListRegionalDistribution() {
        return request({
            url: `index/song_list_type`,
            method: 'get',
        })
    },

    /*获得歌单高分榜*/
    songListHighScore() {
        return request({
            url: `index/song_list_score`,
            method: 'get',
        })
    },

    /*获得用户性别分布*/
    usersGenderDistribution() {
        return request({
            url: `index/user_gender`,
            method: 'get',
        })
    },

    /*获得用户地区分布*/
    usersRegionalDistribution() {
        return request({
            url: `index/user_region`,
            method: 'get',
        })
    },


}

