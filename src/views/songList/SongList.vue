<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 歌单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-button type="warning" icon="el-icon-user-solid" class="handle-add mr10" @click="addAndEditCommonEntrance('add')">新增歌单</el-button>
                <el-input v-model="songListQueryVo.title" placeholder="歌单名称" class="handle-input mr10"></el-input>
                <el-input v-model="songListQueryVo.style" placeholder="风格/类型" class="handle-input mr10"></el-input>
                <el-input v-model="songListQueryVo.introduction" placeholder="歌单介绍" class="handle-input mr10"></el-input>
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
                <el-table-column prop="title" label="歌单" align="center" width="300"></el-table-column>
                <el-table-column label="头像" align="center">
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
                <el-table-column  label="歌单日期" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{scope.row.createTime==null?"":(scope.row.createTime).substring(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">
                        <el-tag type='primary'>{{scope.row.style}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="歌单简介" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" title="歌单简介"
                                width="400" trigger="click" :content="''===scope.row.introduction?'暂无介绍':scope.row.introduction">
                            <el-button class="blue" type="text" slot="reference">简介详情</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="歌曲管理" align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/sheet-songs/'+scope.row.id">
                            <el-button type="success" plain round icon="el-icon-position" size="mini">歌曲管理</el-button>
                        </router-link>
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
            <el-form :model="songListForm" ref="songListForm" label-width="80px">
                <el-form-item prop="title" label="歌单名称" size="mini">
                    <el-input v-model="songListForm.title" placeholder="歌单名称" maxlength="50" ></el-input>
                </el-form-item>
                <el-form-item prop="style" label="风格" size="mini">
                    <el-input v-model="songListForm.style" placeholder="风格/类型"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="歌单简介" size="mini">
                    <el-input v-model="songListForm.introduction"
                              placeholder="简介" type="textarea"
                              maxlength="255" show-word-limit>
                    </el-input>
                </el-form-item>
                <!-- 歌单头像 -->
                <el-form-item label="歌单封面">
                    <!-- 头衔缩略图 -->
                    <pan-thumb :image="tempSrc"/>
                    <!-- 文件上传按钮 -->
                    <el-button type="primary" icon="el-icon-upload" @click="imageCropperShow=true">更换封面
                    </el-button>
                    <!--
                    v-show：是否显示上传组件
                    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                    :url：后台上传的url地址
                    @close：关闭上传组件
                    @crop-upload-success：上传成功后的回调 -->
                    <image-cropper v-show="imageCropperShow" :width="300" :height="300" :key="imageCropperKey"
                                   :url="uploadURL" field="file" @close="close" @crop-upload-success="cropSuccess"/>
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
import songLists from '@/api/songLists';
import { getSexType } from '@/api/common/commonUtils';
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
    name: 'singer',
    components: {
        ImageCropper, PanThumb
    },
    data() {
        return {
            getSexType:getSexType, //返回性别类型
            Loading: true, // 是否显示loading信息
            query: {   //分页信息
                pageIndex: 1,
                pageSize: 8,
            },
            songListQueryVo : {},//歌单查询条件
            tableData: [],  //表格数据
            multipleSelection: [],  //多选
            isVisible: false,
            pageTotal: 0,
            title :'',   //新增编辑标题
            flags : '',  //区分新增和编辑
            isEditCancel: false, //用于编辑时存储上文件路径
            songListForm:{},   //歌单弹框对象
            id: -1,
            HOST:this.$store.state.HOST,
            uploadURL:this.$store.state.UPLOAD_SONG_LIST_COVER,  //歌单上传路径
            defaultSrc: "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",  //默认背景
            tempSrc:'',
            imageCropperShow : false,  //上传时弹框组件是否显示
            imageCropperKey : 0 ,  //

        };
    },
    created() {
        this.fetchData();  //拉取数据
    },
    methods: {
        // 获取数据
        fetchData() {
            this.Loading = true ;
            songLists.getSongListsPagesInfo(this.query,this.songListQueryVo).then(res => {
                this.tableData = res.data.songList;
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
            this.songListQueryVo = {};
            this.fetchData();
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', { // 二次确认删除
                type: 'warning'
            }).then(() => {
                 songLists.deleteSongListsByID(row.id).then(res=>{
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
            songLists.deleteMultipleSelection(str).then(res=>{
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
                this.title = '添加歌单信息'
                this.flags = 'add'
                this.addSongLists()
            }
            if ('edit'===identification){  //调用编辑的方法
                this.title = '编辑歌单信息'
                this.flags = 'edit'
                this.handleEdit(index, row)
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
        // 编辑操作
        handleEdit(index, row) {
            this.songListForm = {}
            this.songListForm = row
            this.tempSrc = this.getImageUrl(row.pic); //处理图像路径问题
            this.isEditCancel = false
            this.isVisible = true;
        },
        // 保存编辑
        saveEditSongLists() {
            songLists.updateSongLists(this.songListForm).then(res=>{
                if (res && res.code===200){
                    this.$message.success(res.message);
                    this.isVisible = false;
                    this.singerForm={};
                }
            }).catch(err=>{
                this.$message.error(err.message);
            })
        },
        //新增歌单
        addSongLists(){
            this.tempSrc='';
            this.songListForm = {}
            this.tempSrc = this.defaultSrc;
            this.isVisible = true;
        },
        //新增歌单确定保存
        saveAddSongLists(){
            songLists.saveAddSongLists(this.songListForm).then(res=>{
                if (res && res.code===200){
                    this.$message.success(res.message);
                    this.isVisible = false;
                    this.songListForm = {};
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
                    songLists.deletePreviousCover(this.songListForm.pic).then((res)=>{
                        if (res && res.code ===200){
                            this.$message.success(res.message);
                        }
                    }).catch(err=>{
                        this.$message.success(err.message);
                    })
                }
                this.imageCropperShow = false; //先关闭弹窗
                this.songListForm.pic = data.path;
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
    }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
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
.crop-demo{
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn{
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.pre-img{
    width: 150px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
