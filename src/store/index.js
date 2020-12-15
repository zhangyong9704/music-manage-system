import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        HOST: 'http://localhost:8088',
        UPLOADURL:'http://localhost:8088/singer/upload',
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})

export default store;
