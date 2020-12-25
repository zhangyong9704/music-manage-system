<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 歌单-歌曲列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-button type="warning" icon="el-icon-user-solid" class="handle-add mr10" @click="addAndEditCommonEntrance('add')">新增歌曲</el-button>
                <el-input v-model="listSongsQueryVo.name" placeholder="歌名" class="handle-input mr10"></el-input>
                <el-input v-model="listSongsQueryVo.introduction" placeholder="专辑" clearable class="handle-input mr10"></el-input>
                <el-input v-model="listSongsQueryVo.lyric" placeholder="歌词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" class="mr10" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-magic-stick" @click="handleReset">重置</el-button>
            </div>
            <el-table
                    v-loading="Loading"  element-loading-text="数据加载中..."
                    :data="tableData" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="播放" align="center" width="85">
                    <template slot-scope="scope">
                        <div class="song-img">
                            <img :src="getImageUrl(scope.row.pic)" style="width:100%" alt=""/>
                        </div>
                        <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
                            <div v-if="toggle === scope.row.name">
                                <svg class="icon">
                                    <use xlink:href="#icon-zanting"></use>
                                </svg>
                            </div>
                            <div v-if="toggle !== scope.row.name">
                                <svg class="icon">
                                    <use xlink:href="#icon-bofanganniu"></use>
                                </svg>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="歌单图片" align="center" width="90">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" fit="contain" style="border-radius: 5px;"
                                  :src="HOST+scope.row.pic"
                                  :preview-src-list="[HOST+scope.row.pic]">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="歌手-歌名" align="center"></el-table-column>
                <el-table-column prop="introduction" label="专辑" align="center"></el-table-column>
                <el-table-column  label="创建日期" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{(scope.row.createTime).substring(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="歌词" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" :title="'歌词:'+scope.row.name"
                                    width="400"  trigger="click">
                            <el-input type="textarea" style="overflow: auto;text-align: center" :rows="20" :disabled=true
                                    v-model="''===scope.row.lyric?'暂无介绍':scope.row.lyric">
                            </el-input>
<!--                            <ul style="height:100px;overflow:scroll;">-->
<!--                                <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">-->
<!--                                    {{item}}-->
<!--                                </li>-->
<!--                            </ul>-->
                            <el-button class="blue" type="text" slot="reference">歌词详情</el-button>
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="primary" plain round
                                icon="el-icon-edit"
                                size="mini"
                                @click="addAndEditCommonEntrance('edit',scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="danger" plain round
                                icon="el-icon-delete"
                                class="red"
                                size="mini"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="jumper, prev, pager, next ,total "
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
            <SongsAudio />
        </div>

        <!--添加编辑歌手-->
        <el-dialog :title="title" :visible.sync="isVisible" width="40%" center :show-close="!isEditCancel">
            <el-form :model="songsForm" ref="songsForm" label-width="80px">
                <el-form-item prop="name" label="歌手-歌名" size="mini">
                    <el-input v-model="songsForm.name" placeholder="歌手 - 歌名"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="专辑" size="mini">
                    <el-input v-model="songsForm.introduction" autosize
                              placeholder="简介" type="text"
                              maxlength="125" show-word-limit>
                    </el-input>
                </el-form-item>
                <el-form-item prop="lyric" label="歌词" size="mini">
                    <el-input v-model="songsForm.lyric" :rows="7"
                              placeholder="歌词" type="textarea"
                              maxlength="1500" show-word-limit>
                    </el-input>
                </el-form-item>
                <el-divider></el-divider>
                <!-- 歌曲头像 -->
                <el-form-item label="歌曲头像">
                    <!-- 文件上传按钮 -->
                    <el-button type="primary" plain icon="el-icon-upload" style="margin-right:20%"
                               @click="imageCropperShow=true">更换头像</el-button>
                    <!-- 头衔缩略图 -->
                    <pan-thumb :image="tempSrc"/>
                    <image-cropper v-show="imageCropperShow" :width="300" :height="300" :key="imageCropperKey"
                                   :url="uploadCover" field="file" @close="close"  @crop-upload-success="cropSuccess"/>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="选择歌曲">
                    <el-upload :action="uploadFiles" :on-remove="handleRemove" ref="upload"
                            :on-success="handleSuccess" :limit="1" :file-list="fileList" >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传mp3文件，且不超过5M</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button  @click="cancel" :disabled="isEditCancel">取消</el-button>
                <el-button  type="primary" @click="saveCommonEntrance(flags)">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import Songs from '@/api/songs';
    import ListSongs from '@/api/listSongs';   //引入歌单-歌曲列表
    import SongsAudio from '@/components/common/SongsAudio';   //引入音乐播放组件
    import { mapGetters } from 'vuex'
    import ImageCropper from '@/components/ImageCropper'  //图像上传组件
    import PanThumb from '@/components/PanThumb'  //

    export default {
        name: 'sheet-songs',
        components: {
            ImageCropper,PanThumb,SongsAudio
        },
        created() {
            this.listSongsQueryVo.id= this.$route.params.id; //获取歌单id
            this.fetchData();
        },
        data() {
            return {
                Loading: true, // 是否显示loading信息
                query: {   //分页信息
                    pageIndex: 1,  //当前页
                    pageSize: 8,  //页面数量
                },
                pageTotal: 0,   //总页数
                songListId: this.$route.params.id, //歌单id
                listSongsQueryVo : {},//歌单-歌手查询条件
                tableData: [],  //表格数据
                multipleSelection: [],  //多选
                isVisible: false,   //新增、编辑弹框是否显示
                title :'',   //新增编辑标题
                flags : '',  //区分新增和编辑
                isEditCancel: false, //用于编辑时存储上文件路径
                songsForm:{},   //歌手新增弹框对象
                fileList: [],//上传文件列表
                id: -1,
                HOST:this.$store.state.HOST,  //默认地址
                uploadCover : this.$store.state.UPLOAD_SONGS_COVER,  //歌曲图片封面上传
                uploadFiles : this.$store.state.UPLOAD_SONGS_URL,   //歌曲文件上传路径
                defaultSrc: "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",  //默认背景
                tempSrc:'',                 //临时图像地址
                imageCropperShow : false,  //上传时弹框组件是否显示
                imageCropperKey : 0 ,     //图像上传标识key
                toggle: false,           //播放器的图标状态
            };
        },
        //监听器
        watch : {
            //watch中监听路由的变化，当路由变化时，重新调用created中的内容
            $route(to, from) {  //监听路由是否有变化
                this.listSongsQueryVo.id= this.$route.params.id; //获取歌单id
                this.fetchData();
            }
        },
        computed :{
            ...mapGetters({
                isPlay:'isPlay',
            }),
        },
        methods: {
            // 获取数据
            fetchData() {
                this.Loading = true ;
                ListSongs.getListSongListPagesInfo(this.query,this.listSongsQueryVo).then(res => {
                    this.tableData = res.data.listSongs;
                    this.pageTotal = res.data.total || 10;
                });
                this.Loading = false ;
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.fetchData();
            },
            //触发重置搜索按钮
            handleReset(){
                this.listSongsQueryVo = {};
                this.listSongsQueryVo.id= this.$route.params.id; //获取歌单id
                this.fetchData();
            },
            // 删除操作 todo
            handleDelete(index, row) {
                this.$confirm('确定要删除吗？', '提示', { // 二次确认删除
                    type: 'warning'
                }).then(() => {  //该删除只删除关联表中的数据，并不删除歌曲
                    ListSongs.deleteSongListsByID(this.songListId,row.id).then(res=>{
                        if (res && res.code===200){
                            this.$message.success(res.message);
                            this.fetchData();
                        }
                    }).catch(()=>{})
                }).catch(() => {
                        this.$message.info("已取消删除操作");
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //批量删除 todo
            delAllSelection() {
                let str = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    str.push(this.multipleSelection[i].id);
                }
                ListSongs.deleteMultipleSelection(str,this.songListId).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.multipleSelection = [];
                        this.fetchData();
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                })
            },

            //新增和编辑统一公共统一调用入口
            addAndEditCommonEntrance(identification,index,row){
                if ("add"===identification){ //调用添加方法
                    this.title = '新增歌曲'
                    this.flags = 'add'
                    this.handleAddSongLists()
                }
                if ('edit'===identification){  //调用编辑的方法
                    this.title = '编辑歌曲'
                    this.flags = 'edit'
                    this.handleEditSongLists(index, row)
                }
            },
            //新增和保存的统一路径调用入口
            saveCommonEntrance(identification,index,row){
                if ("add"===identification){ //调用添加方法
                    this.saveAddSongLists()
                }
                if ('edit'===identification){  //调用编辑的方法
                    this.saveEditSongLists();
                }
            },
            //新增歌曲
            handleAddSongLists(){
                this.tempSrc='';
                this.songsForm = {}
                this.fileList = []   //清空文件列表
                this.tempSrc = this.defaultSrc;
                this.isVisible = true;
                //todo 二次添加时会出现上一次文件缓存名称
            },
            //新增歌曲确定保存
            saveAddSongLists(){
                ListSongs.saveAddSongLists(this.songsForm,this.songListId).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.isVisible = false;
                        this.fetchData();
                    }
                }).catch(err=>{
                    this.$message.success(err.message);
                })
            },
            // 编辑操作
            handleEditSongLists(index, row) {
                this.songsForm = {}   //清空，避免出现缓存
                this.fileList = []   //清空文件列表
                this.songsForm = row  //当前整行数据
                this.fileList = [{ name : row.name + row.url.substring(row.url.lastIndexOf(".")), url : row.url }] //如果多个文件需要遍历(这里限制只能上传一个)
                this.tempSrc = this.getImageUrl(row.pic); //处理图像路径问题
                this.isEditCancel = false
                this.isVisible = true;
            },

            // 保存编辑
            saveEditSongLists() {
                Songs.updateSongs(this.songsForm).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.isVisible = false;
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                })
            },

            //取消按钮
            cancel(){
                this.isVisible = false
                this.isEditCancel = false
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.fetchData();
            },

            //图片上传成功
            cropSuccess(data){ //上传保存成功后调用  data 直接进行了封装，==》response.data
                if (data.path){
                    if ('edit'===this.flags){   //编辑功能删除先前图片
                        //todo 删除对应图片,上次保存图片的位置
                        Songs.deleteSongsCoverAndFiles(this.songsForm.pic).then((res)=>{
                            if (res && res.code ===200){
                                this.$message.success(res.message);
                            }
                        }).catch(err=>{
                            this.$message.error(err.message);
                        })
                    }
                    this.imageCropperShow = false; //先关闭弹窗
                    this.songsForm.pic = data.path;  //提交上传图片地址
                    this.tempSrc = this.getImageUrl(data.path);  //图片回显
                    // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
                    this.imageCropperKey = this.imageCropperKey + 1 ;
                    this.isEditCancel = true
                }
            },
            //上传图片关闭组件显示
            close(){
                this.imageCropperShow = false;
                this.imageCropperKey = this.imageCropperKey + 1 ;  //保证当前组件不会进行复用，显示已经上传成功
            },
            //处理图像返回地址
            getImageUrl(url){
                return this.$store.state.HOST+url;
            },
            //解析歌词
            parseLyric(text){
                let lines = text.split("\n");
                let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})]/g;
                let result = [];
                for(let item of lines){
                    let value = item.replace(pattern,'');
                    result.push(value);
                }
                return result;
            },
            //===================歌曲上传===============================
            handleSuccess(response, file, fileList){
                if (response && response.code===200){
                    this.songsForm.url = response.data.path  //获取上传后的文件保存地址
                }else{
                    this.$message.error(response.message);
                    this.songsForm.url = ''
                }
            },

            handleRemove(file, fileList){
                Songs.deleteSongsCoverAndFiles(this.songsForm.url).then(res =>{
                    if (res && res.code ===200){
                        this.$message.success(res.message);
                        this.songsForm.url = ''
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                    this.songsForm.url = ''
                })
            },

        //    ==================歌曲播放部分===============================
            //切换播放歌曲
            setSongUrl(url,name) {
                this.toggle = name;  //设置当前值为歌名
                this.$store.commit('setUrl',this.HOST + url);  //拼接歌曲访问地址
                if(this.isPlay){
                    this.$store.commit('setIsPlay',false);
                    this.toggle = false
                }else{
                    this.$store.commit('setIsPlay',true);
                }
            }
        },
        //切换页面停止播放
        destroyed() {
            this.$store.commit('setIsPlay',false);
        },
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-input {
        width: 210px;
        display: inline-block;
    }
    .handle-add {
        margin-left: 1px;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .blue {
        color: #409EFF;
    }
    .mr10 {
        margin-right: 12px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    /*上传组件的样式*/
    /deep/ .el-upload{
        width: 80px;
        height: 35px;
        line-height: 35px;
    }
    /deep/ .el-upload__tip{
        margin-top: -16px;
    }
    /deep/ .el-upload--text{
        border:none !important;
    }
/*    播放样式*/
    .play {
        position: absolute;
        z-index: 100;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        top: 6px;
        left: 17px;
    }
    .icon {
        width: 2em;
        height: 2em;
        color: #00d1b2a8;
        fill: currentColor;
        overflow: hidden;
    }
    .song-img{
        width: 65%;
        height: 40px;
        border-radius: 20px;
        margin-left: 10px;
        overflow: hidden;
    }
</style>
