<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> Banner列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-button type="primary" icon="el-icon-user-solid" class="handle-add mr10" @click="addAndEditCommonEntrance('add')">新增Banner</el-button>
                <el-input v-model="bannerQueryVo.title" placeholder="标题" class="handle-input mr10"></el-input>
                <el-date-picker class="mr10"
                        v-model="pickDate" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
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
                <el-table-column prop="title" label="标题" align="center"></el-table-column>
                <el-table-column label="链接地址" align="center">
                    <template slot-scope="scope">
                        <el-tag type='primary'>{{scope.row.linkUrl}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="序号" align="center" width="60">
                    <template slot-scope="scope">
                        <el-tag type='success'>{{scope.row.sort}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="封面" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" fit="contain"
                                  :src="HOST+scope.row.imageUrl"
                                  :preview-src-list="[HOST+scope.row.imageUrl]">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column  label="创建时间" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{scope.row.createTime==null?"":(scope.row.createTime).substring(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="更改时间" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{scope.row.updateTime==null?"":(scope.row.updateTime).substring(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="图片地址" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" title="图片地址"
                                    width="400" trigger="click" :content="''===scope.row.imageUrl?'暂无地址':scope.row.imageUrl">
                            <el-button class="blue" type="text" slot="reference">地址详情</el-button>
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

        <!--添加编辑Banner-->
        <el-dialog :title="title" :visible.sync="isVisible" width="40%" center :show-close="!isEditCancel">
            <el-form :model="bannerForm" ref="singerForm" label-width="80px">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="bannerForm.title" placeholder="Banner名"></el-input>
                </el-form-item>
                <el-form-item prop="linkUrl" label="链接地址" size="mini">
                    <el-input v-model="bannerForm.linkUrl" placeholder="序号"></el-input>
                </el-form-item>
                <el-form-item prop="sort" label="序号" size="mini">
                    <el-input v-model.number.trim="bannerForm.sort" placeholder="序号"></el-input>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="Banner">
                    <el-upload :action="uploadURL" :on-remove="handleRemove" ref="upload" list-type="picture"
                               :on-success="handleSuccess" :limit="1" :file-list="fileList" >
                        <el-button size="small" type="primary">上传Banner</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传png/jpg文件，且不超过2M</div>
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
    import Banner from '@/api/banner';
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
                bannerQueryVo : {},//banner查询条件
                tableData: [],  //表格数据
                pickDate: "",
                multipleSelection: [],  //多选
                isVisible: false,
                pageTotal: 0,
                title :'',   //新增编辑标题
                flags : '',  //区分新增和编辑
                isEditCancel: false, //用于编辑时存储上文件路径
                bannerForm:{},   //Banner弹框对象
                fileList: [],//上传文件列表
                id: -1,
                HOST:this.$store.state.HOST,
                uploadURL:this.$store.state.UPLOAD_BANNER_COVER,  //Banner上传路径
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            // 获取数据
            fetchData() {
                this.Loading = true ;
                if(this.pickDate.length>0){
                    this.bannerQueryVo.begin=this.pickDate[0];
                    this.bannerQueryVo.end=this.pickDate[1];
                }
                Banner.getBannerPagesInfo(this.query,this.bannerQueryVo).then(res => {
                    this.tableData = res.data.banner;
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
                this.bannerQueryVo = {};
                this.pickDate = "";
                this.fetchData();
            },
            // 删除操作
            handleDelete(index, row) {
                this.$confirm('确定要删除吗？', '提示', { // 二次确认删除
                    type: 'warning'
                }).then(() => {
                    Banner.deleteBannerByID(row.id).then(res=>{
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
                Banner.deleteMultipleSelection(str).then(res=>{
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
                    this.title = '添加Banner信息'
                    this.flags = 'add'
                    this.handleAddBanners()
                }
                if ('edit'===identification){  //调用编辑的方法
                    this.title = '编辑Banner信息'
                    this.flags = 'edit'
                    this.handleEditBanner(index, row)
                }
            },
            //新增和保存的统一路径调用入口
            saveCommonEntrance(identification,index,row){
                if ("add"===identification){ //调用添加方法
                    this.confirmAddBanner()
                }
                if ('edit'===identification){  //调用编辑的方法
                    this.saveEditBanner();
                }
            },
            // 编辑操作
            handleEditBanner(index, row) {
                this.bannerForm = {}
                this.bannerForm = row
                this.fileList = [{ name : row.title + row.imageUrl.substring(row.imageUrl.lastIndexOf(".")), url : this.getImageUrl(row.imageUrl) }] //如果多个文件需要遍历(这里限制只能上传一个)
                this.isEditCancel = false
                this.isVisible = true;
            },
            // 保存编辑
            saveEditBanner() {
                Banner.updateBanner(this.bannerForm).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.isVisible = false;
                        this.bannerForm={};
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                })
            },
            //新增Banner
            handleAddBanners(){
                this.bannerForm = {}
                this.fileList = [];
                this.isVisible = true;
            },
            //新增Banner确定保存
            confirmAddBanner(){
                Banner.saveAddBanner(this.bannerForm).then(res=>{
                    if (res && res.code===200){
                        this.$message.success(res.message);
                        this.isVisible = false;
                        this.bannerForm = {};
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

            //处理图像返回地址
            getImageUrl(url){
                return this.$store.state.HOST+url;
            },

            /*==============上传图片删除操作=======================*/
            handleRemove(file, fileList){
                Banner.deletePreviousCover(this.bannerForm.imageUrl).then(res =>{
                    if (res && res.code ===200){
                        this.$message.success(res.message);
                        this.bannerForm.imageUrl = ''
                    }
                }).catch(err=>{
                    this.$message.error(err.message);
                    this.bannerForm.imageUrl = ''
                })
            },

            handleSuccess(response, file, fileList){
                if (response && response.code===200){
                    this.$message.success(response.message);
                    this.bannerForm.imageUrl = response.data.path  //获取上传后的文件保存地址
                }else{
                    this.$message.error(response.message);
                    this.bannerForm.imageUrl = ''
                }
            },
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
