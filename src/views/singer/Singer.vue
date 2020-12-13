<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 歌手列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-button type="warning" icon="el-icon-user-solid" class="handle-add mr10" @click="addSinger">新增歌手</el-button>
                <el-input v-model="singerQueryVo.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-select v-model="singerQueryVo.sex" placeholder="类别" class="handle-select mr10">
                    <el-option key="0" label="女" value="0"></el-option>
                    <el-option key="1" label="男" value="1"></el-option>
                    <el-option key="2" label="组合" value="2"></el-option>
                    <el-option key="3" label="未知" value="3"></el-option>
                </el-select>
                <el-input v-model="singerQueryVo.location" placeholder="地区" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" class="mr10" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-magic-stick" @click="handleReset">重置</el-button>
            </div>
            <el-table
                v-loading="Loading"  element-loading-text="数据加载中..."
                :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="歌手" align="center"></el-table-column>
                <el-table-column label="类别" width="55" align="center">
                    <template slot-scope="scope">
                        <el-tag type='primary'>{{getSexType(scope.row.sex)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                       <el-image class="table-td-thumb" fit="contain"
                            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                            :preview-src-list="srcList">
                           <div slot="error" class="image-slot">
                               <i class="el-icon-picture-outline"></i>
                           </div>
                       </el-image>
                    </template>
                </el-table-column>
                <el-table-column  label="出生日期" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{(scope.row.birth).substring(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="地区" align="center"></el-table-column>
                <el-table-column prop="" label="歌手简介" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" title="歌手简介"
                                width="400" trigger="click" :content="scope.row.introduction">
                            <el-button class="blue" type="text" slot="reference">简介详情</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary" plain round
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="danger" plain round
                            icon="el-icon-delete"
                            class="red"
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!--添加歌手-->
        <el-dialog title="添加歌手信息" :visible.sync="addVisible" width="40%" center>
            <el-form :model="addSingerForm" ref="addSingerForm" label-width="80px">
                <el-form-item prop="name" label="歌手名称" size="mini">
                    <el-input v-model="addSingerForm.name" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item label="性别" size="mini">
                    <el-radio-group v-model="addSingerForm.sex">
                        <el-radio :label="0">女</el-radio>
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">组合</el-radio>
                        <el-radio :label="3">不明</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="birth" label="生日" size="mini">
                    <el-date-picker type="date" placeholder="出生日期" v-model="addSingerForm.birth" style="width:100%"></el-date-picker>
                </el-form-item>
                <el-form-item prop="location" label="地区" size="mini">
                    <el-input v-model="addSingerForm.location" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="addSingerForm.introduction"
                              placeholder="简介" type="textarea"
                              maxlength="120" show-word-limit>
                    </el-input>
                </el-form-item>
                <!-- 讲师头像 -->
                <el-form-item label="歌手头像">
                    <!-- 头衔缩略图 -->
                    <pan-thumb :image="defaultSrc"/>
                    <!-- 文件上传按钮 -->
                    <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
                    </el-button>
                    <!--
                    v-show：是否显示上传组件
                    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                    :url：后台上传的url地址
                    @close：关闭上传组件
                    @crop-upload-success：上传成功后的回调 -->
                    <image-cropper v-show="imagecropperShow" :width="300" :height="300" :key="imagecropperKey"
                                   :url="BASE_API+'/service-oss/oss-upload/upload'" field="file" @close="close" @crop-upload-success="cropSuccess"/>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button  @click="addVisible = false">取消</el-button>
                <el-button  type="primary" @click="">确定</el-button>
            </span>
        </el-dialog>




    </div>
</template>

<script>
import Singer from '@/api/singer';
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { getSexType,convertBase64UrlToBlob } from '@/api/common/commonUtils';
export default {
    name: 'singer',
    components: {
        ImageCropper, PanThumb
    },
    data() {
        return {
            getSexType:getSexType,
            Loading: true, // 是否显示loading信息
            query: {
                pageIndex: 1,
                pageSize: 8,
            },
            BASE_API : "",
            singerQueryVo :{},//歌手查询条件
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            addSingerForm:{},   //新增歌手对象
            idx: -1,
            id: -1,
            defaultSrc: "https://guili-ptcture.oss-cn-beijing.aliyuncs.com/picture/c851d1cb-f053-4ae4-94ce-205b5321304a.png",
            imagecropperShow : false,  //上传时弹框组件是否显示
            imagecropperKey : 0 ,
            srcList: [
                'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ]
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        // 获取数据
        fetchData() {
            this.Loading = true ;
            Singer.getSingerPagesInfo(this.query,this.singerQueryVo).then(res => {
                this.tableData = res.data.singer;
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
            this.singerQueryVo = {};
            this.fetchData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },

        //新增歌手
        addSinger(){
            this.addSingerForm = {}
            this.cropImg = this.defaultSrc;
            this.addVisible = true;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.fetchData();
        },
        //图片上传成功
        cropSuccess(data){ //上传保存成功后调用  data 直接进行了封装，==》response.data
            this.imagecropperShow = false; //先关闭弹窗
            this.addSingerForm.pic = data.url;
            // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
            this.imagecropperKey = this.imagecropperKey + 1 ;
        },
        close(){  //关闭组件显示
            this.imagecropperShow = false;
            this.imagecropperKey = this.imagecropperKey + 1 ;  //保证当前组件不会进行复用，显示已经上传成功
        },
    }
};
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
