<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 歌曲列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-button type="warning" icon="el-icon-user-solid" class="handle-add mr10" @click="addAndEditCommonEntrance('add')">新增歌曲</el-button>
                <el-input v-model="songQueryVo.name" placeholder="歌名" class="handle-input mr10"></el-input>
                <el-input v-model="songQueryVo.introduction" placeholder="专辑" clearable class="handle-input mr10"></el-input>
                <el-input v-model="songQueryVo.lyric" placeholder="歌词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" class="mr10" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-magic-stick" @click="handleReset">重置</el-button>
            </div>
            <el-table
                    v-loading="Loading"  element-loading-text="数据加载中..."
                    :data="tableData" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="170" align="center"></el-table-column>
                <el-table-column prop="name" label="歌手-歌名" align="center"></el-table-column>
                <el-table-column label="歌单图片" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" fit="contain"
                                  :src="HOST+scope.row.pic"
                                  :preview-src-list="[HOST+scope.row.pic]">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
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
                              maxlength="500" show-word-limit>
                    </el-input>
                </el-form-item>
                <el-divider></el-divider>
                <!-- 讲师头像 -->
                <el-form-item label="歌曲头像">
                    <!-- 文件上传按钮 -->
                    <el-button type="primary" plain icon="el-icon-upload" style="margin-right:20%"
                               @click="imageCropperShow=true">更换头像</el-button>
                    <!-- 头衔缩略图 -->
                    <pan-thumb :image="tempSrc"/>
                    <image-cropper v-show="imageCropperShow" :width="300" :height="300" :key="imageCropperKey"
                                   :url="uploadURL" field="file" @close="close" @crop-upload-success="cropSuccess"/>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="选择歌曲">
                    <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
    import Singer from '@/api/singer';
    import Songs from '@/api/songs';
    import ImageCropper from '@/components/ImageCropper'
    import PanThumb from '@/components/PanThumb'
    export default {
        name: 'singer',
        components: {
            ImageCropper, PanThumb
        },
        data() {
            return {
                Loading: true, // 是否显示loading信息
                query: {   //分页信息
                    pageIndex: 1,
                    pageSize: 8,
                },
                singerID: this.$route.params.id,
                songQueryVo : {},//歌手查询条件
                songsQueryVo :{},  //歌曲查询条件
                tableData: [],  //表格数据
                multipleSelection: [],  //多选
                isVisible: false,
                pageTotal: 0,
                title :'',   //新增编辑标题
                flags : '',  //区分新增和编辑
                isEditCancel: false, //用于编辑时存储上文件路径
                songsForm:{},   //歌手弹框对象
                id: -1,
                HOST:this.$store.state.HOST,
                uploadURL:this.$store.state.UPLOADURL,  //歌手上传路径
                defaultSrc: "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",  //默认背景
                tempSrc:'',
                imageCropperShow : false,  //上传时弹框组件是否显示
                imageCropperKey : 0 ,  //
                srcList: [
                    'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
                ]
            };
        },
        //监听器
        watch : {
            //watch中监听路由的变化，当路由变化时，重新调用created中的内容
            $route(to, from) {  //监听路由是否有变化
                console.log('watch $route')
                this.songsQueryVo.singerId = this.$route.params.id;
                this.fetchData();
            }
        },
        created() {
            this.songsQueryVo.singerId= this.$route.params.id;
            this.fetchData();
        },
        methods: {
            // 获取数据
            fetchData() {
                this.Loading = true ;
                Songs.getSongsPagesInfo(this.query,this.songsQueryVo).then(res => {
                    this.tableData = res.data.songs;
                    this.pageTotal = res.data.total || 20;
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
                this.songQueryVo = {};
                this.fetchData();
            },
            // 删除操作
            handleDelete(index, row) {
                this.$confirm('确定要删除吗？', '提示', { // 二次确认删除
                    type: 'warning'
                }).then(() => {
                    Singer.deleteSingerByID(row.id).then(res=>{
                        if (res && res.code===200){
                            this.$message.success(res.message);
                            this.fetchData();
                        }
                    }).catch(()=>{})
                })
                    .catch(() => {
                        this.$message.info("已取消删除操作");
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //批量删除
            delAllSelection() {
                let str = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    str.push(this.multipleSelection[i].id);
                }
                Singer.deleteMultipleSelection(str).then(res=>{
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
                    this.title = '添加歌手信息'
                    this.flags = 'add'
                    this.addSinger()
                }
                if ('edit'===identification){  //调用编辑的方法
                    this.title = '编辑歌手信息'
                    this.flags = 'edit'
                    this.handleEdit(index, row)
                }
            },

            //新增和保存的统一路径调用入口
            saveCommonEntrance(identification,index,row){
                if ("add"===identification){ //调用添加方法
                    debugger
                    this.confirmAddSinger()
                }
                if ('edit'===identification){  //调用编辑的方法
                    this.saveEdit();
                }
            },
            // 编辑操作
            handleEdit(index, row) {
                this.songsForm = {}
                this.songsForm = row
                this.tempSrc = this.getImageUrl(row.pic); //处理图像路径问题
                this.isEditCancel = false
                this.isVisible = true;
            },
            // 保存编辑
            saveEdit() {
                Singer.updateSinger(this.songsForm).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.isVisible = false;
                        this.songsForm={};
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //新增歌手
            addSinger(){
                this.tempSrc='';
                this.songsForm = {}
                this.tempSrc = this.defaultSrc;
                this.isVisible = true;
            },
            //新增歌手确定保存
            confirmAddSinger(){
                Singer.saveAddSinger(this.songsForm).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.isVisible = false;
                        this.songsForm = {};
                        this.fetchData();
                    }
                }).catch(err=>{
                    this.$message.success(err.message);
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
                        Singer.deletePreviousCover(this.songsForm.pic).then((res)=>{
                            if (res && res.code ===200){
                                this.$message.success(res.message);
                            }
                        }).catch(err=>{
                            this.$message.success(err.message);
                        })
                    }
                    this.imageCropperShow = false; //先关闭弹窗
                    this.songsForm.pic = data.path;
                    this.tempSrc = this.getImageUrl(data.path);
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


            submitUpload() {
                this.fileUploadBtnText = '正在上传',
                    this.importBtnDisabled = true,
                    this.loading = true,
                    this.$refs.upload.submit();
            },

            //上传成功
            fileUploadSuccess(response) {
                if (response.success === true) {
                    this.fileUploadBtnText = '上传成功'
                    this.loading = false
                    this.$message({
                        type: 'success',
                        message: '上传成功',
                    })
                }
            },

            //上传失败
            fileUploadError(response) {
                this.fileUploadBtnText = '导入失败'
                this.loading = false
                this.$message({
                    type: 'error',
                    message: '导入失败'
                })

            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .handle-input {
        width: 250px;
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
</style>
