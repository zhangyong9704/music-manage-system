import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        HOST: 'http://localhost:8088',
        UPLOAD_SINGER_COVER: 'http://localhost:8088/singer/upload',  //歌手封面上传路径
        UPLOAD_SONGS_URL: 'http://localhost:8088/song/upload-file',  //歌曲文件上传路径
        UPLOAD_SONGS_COVER: 'http://localhost:8088/song/upload-cover',  //歌曲文件封面路径
        UPLOAD_SONG_LIST_COVER: 'http://localhost:8088/song-list/upload-cover',  //歌单文件封面路径

        url:'',  //歌曲播放地址
        id:'',  //歌曲id
        isPlay: false //是否播放歌曲
    },
    mutations: {   //设置设值方式
        setIsPlay(state,isPlay){
            this.state.isPlay = isPlay
        },
        setUrl(state, url){
            this.state.url = url
        },
        setId(state, id){
            this.state.id = id
        },
    },
    getters: {   //设置获取方式
        isPlay:(state) => state.isPlay || null,
        url:(state) =>state.url || null,
        id:(state)=>state.id||null,
    },
})

export default store;
