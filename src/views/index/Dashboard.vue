<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>2019-11-01</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>东莞</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>Vue
                    <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
                    <el-progress :percentage="13.7"></el-progress>HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{singerCount}}</div>
                                    <div>歌手总数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-hot grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{songCount}}</div>
                                    <div>歌曲总数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-crown grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{songListCount}}</div>
                                    <div>歌单总数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="dealtWith">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div
                                    class="todo-item"
                                    :class="{'todo-item-del': scope.row.status}"
                                >{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <h3 class="mgb40">歌手国籍分布</h3>
                    <ve-histogram :data="singer_region" :data-zoom="dataZoom"
                                  :settings="singerChartSettings"
                                  :after-config="afterConfig" :toolbox="toolbox" :loading="true"
                    ></ve-histogram>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <h3 class="mgb40">歌手组合类型</h3>
                    <ve-pie :data="singer_type" :settings="singerTypeChartSettings"></ve-pie>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <h3 class="mgb40">歌单高分榜</h3>
                    <ve-line :data="song_list_score"
                             :settings="songListScoreChartSettings"
                             :extend="songListScoreChartExtend"
                             :toolbox="toolbox" :loading="true"
                    ></ve-line>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <h3 class="mgb40">歌单风格分布</h3>
                    <ve-histogram :data="song_list_type" :data-zoom="dataZoom"
                                  :settings="songListChartSettings"
                                  :after-config="afterConfig"
                                  :toolbox="toolbox" :loading="true"
                    ></ve-histogram>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <h3 class="mgb40">用户性别比例</h3>
                    <ve-ring :data="user_gender" :settings="userGenderChartSettings"></ve-ring>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <h3 class="mgb40">用户地区分布</h3>
                    <ve-scatter :data="user_region" :data-zoom="dataZoom"
                                :settings="userChartSettings"
                                :after-config="afterConfig"
                                :loading="true"
                    ></ve-scatter>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Index from '@/api/index';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            songCount: -1,
            singerCount: -1,
            songListCount: -1,
            singer_region:[], //歌手不同国籍分布
            dataZoom: [  //滚动条
                {
                    type: 'slider',
                    start: 0,
                    end: 70
                }
            ],
            singerChartSettings : {  //歌手国籍分布别名设置
                labelMap: {'count': '数量',},
                legendName: {'数量': '歌手国籍分布数量'},
            },
            singer_type:[],  //歌手类型分布
            singerTypeChartSettings : {  //歌手类型标签自定义设置
                label:{
                    normal:{
                        formatter:params =>{
                            return `组合类型: ${params.data.name}  数量: ${params.data.value}`
                        }
                    }
                }
            },
            user_gender: [],  //用户性别分布
            userGenderChartSettings : {  //用户性别标签自定义设置
                label:{
                    normal:{
                        formatter:params =>{
                            return `性别: ${params.data.name}  人数: ${params.data.value}`
                        }
                    }
                }
            },
            user_region : [],  //用户地区分布
            userChartSettings : {  //用户地区分布别名设置
                labelMap: { 'count': '数量', },
                legendName: { '数量': '用户地区分布数量' }
            },
            song_list_type :[], //歌单风格分布
            songListChartSettings : {  //歌单类型分布别名设置
                labelMap: { 'count': '歌单数量', },
                legendName: { '歌单数量': '歌单分布数量' },
            },
            song_list_score :[],  //歌单高分榜分布
            songListScoreChartSettings : {  //歌单高分分布别名设置
                labelMap: {'score': '歌单评分',},
            },
            songListScoreChartExtend: {  //X轴数值过长截取设置
                xAxis: { // x轴字体斜显示
                    axisLabel: {
                        margin: 15,
                        interval: 0,
                        rotate: 30,
                        formatter: name => {
                            return name.length<=5?name:name.substring(0,4)+"...";
                        }
                    },
                    triggerEvent: true
                }
            },
            toolbox : {   //工具箱
                feature: {
                    magicType: { type: ['line', 'bar'] },
                    saveAsImage: {}
                }
            },
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: true
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
        };
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    created() {
        this.init();
    },
    methods: {
        /*获得主页歌手、歌曲、歌单数量*/
        getIndexCounts() {
            Index.indexCount().then(res=>{
                this.singerCount = res.data.count.singerCount;
                this.songCount = res.data.count.songCount;
                this.songListCount = res.data.count.songListCount;
            })
        },

        /*初始化图标总请求路线*/
        init(){
            this.getIndexCounts();
            this.getRegionalDistributionOfSingers();  //歌手国籍分布
            this.getCombinationTypeOfSingers();   //歌手类型分布
            this.getHighScoreSongList();  //歌单高分榜(前十)
            this.getRegionalDistributionOfSongList();   //歌单风格
            this.getGenderDistributionOfUsers();    //用户性别分布
            this.getRegionalDistributionOfUsers();  //用户地区分布
        },

        /*获取歌手国际地区分布*/
        getRegionalDistributionOfSingers(){
            Index.singerRegion().then(res=>{
                this.singer_region = res.data.singer_region;
            })
        },

        /*获取歌手类型分布*/
        getCombinationTypeOfSingers(){
            Index.singersCombinationType().then(res=>{
                this.singer_type = res.data.singer_type;
            })
        },

        /*歌单类型分布*/
        getRegionalDistributionOfSongList(){
            Index.songListRegionalDistribution().then(res=>{
                this.song_list_type = res.data.song_list_type;
            })
        },

        /*歌单高分榜 前十*/
        getHighScoreSongList(){
            Index.songListHighScore().then(res=>{
                this.song_list_score = res.data.song_list_score;
            })
        },

        /*用户性别比例分布*/
        getGenderDistributionOfUsers(){
            Index.usersGenderDistribution().then(res=>{
                this.user_gender = res.data.user_gender;
            })
        },

        /*用户地区分布*/
        getRegionalDistributionOfUsers(){
          Index.usersRegionalDistribution().then(res=>{
              this.user_region = res.data.user_region;
          })
        },

        afterConfig(options){
            options.xAxis[0].axisLabel = {rotate:-45};
            return options;
        },

        // 待办消息跳转事件
        dealtWith(){
            this.$router.push('/dealt-with');
        },

        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}
.mgb40{
    margin-left: 40%;
    margin-bottom: 10px
}
</style>
