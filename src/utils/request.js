import axios from 'axios';
import router from '@/router/index';
import { Message, MessageBox } from 'element-ui'

const service = axios.create({
    //process.env.NODE_ENV === 'development', // 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://localhost:8088',
    timeout: 5000,
    withCredentials : true,  //允许跨域
});

//Content-Type 响应头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
            // return Promise.resolve(response);
        } else {
            Message({
                message: response.data.message,
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(response);
        }
    },
    error => {
        console.log(error);
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        if(error.response.status) {
            switch (error.response.status) {
                case 201:       //未登录
                    router.replace({
                        path: '/',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
                case 404:   //没找到
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default service;
