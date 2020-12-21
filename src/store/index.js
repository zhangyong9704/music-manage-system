import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        HOST: 'http://localhost:8088',
        UPLOADSINGERCOVER:'http://localhost:8088/singer/upload',  //歌手封面上传路径
        UPLOADSONGSURL:'http://localhost:8088/song/upload-file',  //歌曲文件上传路径
        UPLOADSONGSCOVER:'http://localhost:8088/song/upload-cover'  //歌曲文件封面路径

    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})

export default store;
