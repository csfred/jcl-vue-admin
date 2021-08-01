<template>
  <div class="site-editor-container">
    <div class="head-box">
      <div class="inp-box">
        <el-input class="inp" v-model="stationNameVal" placeholder="请输入监控名称" clearable></el-input>
        <el-button @click="searchFn()" type="primary">查找配置信息</el-button>
      </div>
    </div>

    <!-- 站点列表 -->
    <div class="list-box">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="stationNo"
          label="站点序号"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="stationName"
          label="站点名称"
          >
        </el-table-column>
        <el-table-column
          prop="stationAddress"
          label="地址"
          width="200">
        </el-table-column>
        <el-table-column
          prop="processTech"
          label="处理工艺"
          width="120">
        </el-table-column>
        <el-table-column
          prop="processScale"
          label="规模"
          width="120">
        </el-table-column>
        <el-table-column
          prop="devOpsNum"
          label="人数"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name"
          label="负责人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="connectTel"
          label="联系电话"
          width="120">
        </el-table-column>
        <el-table-column
          prop="remarks1"
          label="备注1"
          width="120">
        </el-table-column>   
        <el-table-column
          prop="remarks2"
          label="备注2"
          width="120">
        </el-table-column>   
        <el-table-column
          prop="remarks3"
          label="备注3"
          width="120">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click="toLeCheng(scope.row)" type="text" size="small">乐橙云配置</el-button>
            <el-button @click="toYingShi(scope.row)" type="text" size="small">萤石云配置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
     <!-- 模态框 -->
     <div class="">
         <el-dialog
            :title="title"
            :visible.sync="centerDialogVisible"
            width="60%"
            center
         >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
               <el-form-item label="站点编号" prop="stationNo">
                  <el-input v-model="ruleForm.stationNo" :disabled="disabled"></el-input>
               </el-form-item>               
               <el-form-item label="站点名称" prop="stationName">
                  <el-input v-model="ruleForm.stationName"></el-input>
               </el-form-item>
               <el-form-item label="站点地址" prop="stationAddress">
                  <el-input v-model="ruleForm.stationAddress"></el-input>
               </el-form-item>
               <el-form-item label="处理工艺" prop="processTech">
                  <el-input v-model="ruleForm.processTech"></el-input>
               </el-form-item>                        
               <el-form-item label="处理规模" prop="processScale">
                  <el-input v-model="ruleForm.processScale"></el-input>
               </el-form-item>
               <el-form-item label="运维人数" prop="devOpsNum">
                  <el-input v-model="ruleForm.devOpsNum"></el-input>
               </el-form-item>
               <!--  prop="name" -->
               <el-form-item label="负责人">
                  <el-input v-model="ruleForm.name"></el-input>
               </el-form-item>  
               <el-form-item label="联系电话" prop="connectTel">
                  <el-input v-model="ruleForm.connectTel"></el-input>
               </el-form-item>
               <el-form-item label="备注1">
                  <el-input v-model="ruleForm.remarks1"></el-input>
               </el-form-item>
               <el-form-item label="备注2">
                  <el-input v-model="ruleForm.remarks2"></el-input>
               </el-form-item>  
               <el-form-item label="备注3">
                  <el-input v-model="ruleForm.remarks3"></el-input>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">{{buttomName}}</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
               </el-form-item>
            </el-form>
         </el-dialog>        
     </div>
  </div>
</template>

<script>
import { getAllStationInfo, deleteStationInfo } from '../../../api/indexs'
import { saveStationInfo, updateStationInfo } from '../../../api/indexs'
export default {
  data() {
    return {
      stationNameVal: '',
      tableData: [],
      totalCount: 0,
      types: 0,
      centerDialogVisible: false,
      title:'添加监控配置信息',
      buttomName:'立即添加',
      ruleForm: {
            "stationNo": "",
            "stationName": "",
            "stationLon": '',
            "stationLat": '',
            "stationAddress": "",
            "processTech": "",
            "processScale": null,
            "devOpsNum": null,
            "connectTel": "",
            "bgImgPath": "",
            "remarks1": "",
            "remarks2": "",
            "remarks3": ""
         },
         rules: {
            stationNo: [
               { required: true, message: '请输入站点编号', trigger: 'blur' },
            ],
            stationName: [
               { required: true, message: '请输入站点名称', trigger: 'blur' },
            ],
            stationAddress: [
               { required: true, message: '请输入站点地址', trigger: 'blur' },
            ],
            processTech: [
               { required: true, message: '请输入处理工艺', trigger: 'blur' },
            ],
            processScale: [
               { required: true, message: '请输入处理规模', trigger: 'blur' },
            ],
            devOpsNum: [
               { required: true, message: '请输入运维人数', trigger: 'blur' },
            ],     
            name: [
               { required: true, message: '请输入负责人', trigger: 'blur' },
            ],
            connectTel: [
               { required: true, message: '请输入联系电话', trigger: 'blur' },
            ],                       
         }    
    }
  },

  mounted() {
    // 列表接口
    getAllStationInfo({
      page: 1,
      pageSize: 10,
      stationName: ''
    }).then(data => {
      this.tableData = data.data.dataList
      this.totalCount = data.data.total
    })
  },

  methods: {
    // 跳转添加站点
    toAddSite() {
      this.types= 0
      this.title='添加监控配置信息'
      this.buttomName='立即添加',
      this.centerDialogVisible = true
    },

    // 搜索
    searchFn() {
      getAllStationInfo({
        page: 1,
        pageSize: 10,
        stationName: this.stationNameVal
      }).then(data => {
        this.tableData = data.data.dataList
        this.totalCount = data.data.total
      })
    },

    // 跳转乐橙配置
    toLeCheng(e) {
      console.log(e)
      this.$router.push({
        path: '/monitoring/leCheng',
        query: {
          params: e,
        }
      })
    },
    // 跳转萤石配置
    toYingShi(e) {
      this.$router.push({
        path: '/monitoring/yingShi',
        query: {
          params: e,
        }
      })
    },

    // 点击分页
    handleCurrentChange(val) {
      // 列表接口
      getAllStationInfo({
        page: val,
        pageSize: 10,
        stationName: ''
      }).then(data => {
        this.tableData = data.data.dataList
        this.totalCount = data.data.total
      })
    },
    // 点击提交按钮
      submitForm(formName) {
         let t = this
         this.$refs[formName].validate((valid) => {
            if (valid) {
               if(t.types == 0) {
                  saveStationInfo({
                     stationNo: this.ruleForm.stationNo,
                     stationName: this.ruleForm.stationName,
                     stationLon: this.ruleForm.stationLon,
                     stationLat: this.ruleForm.stationLat,
                     stationAddress: this.ruleForm.stationAddress,
                     processTech: this.ruleForm.processTech,
                     processScale: this.ruleForm.processScale,
                     devOpsNum: this.ruleForm.devOpsNum,
                     connectTel: this.ruleForm.connectTel,
                     bgImgPath: this.ruleForm.bgImgPath,
                     remarks1: this.ruleForm.remarks1,
                     remarks2: this.ruleForm.remarks2,
                     remarks3: this.ruleForm.remarks3
                  }).then(data => {
                     this.centerDialogVisible = false
                     this.$message({
                        message: '监控配置信息添加成功',
                        type: 'success'
                     });
                  });                    
               } else if(t.types == 1) {
                  updateStationInfo({
                     stationNo: this.ruleForm.stationNo,
                     stationName: this.ruleForm.stationName,
                     stationLon: this.ruleForm.stationLon,
                     stationLat: this.ruleForm.stationLat,
                     stationAddress: this.ruleForm.stationAddress,
                     processTech: this.ruleForm.processTech,
                     processScale: this.ruleForm.processScale,
                     devOpsNum: this.ruleForm.devOpsNum,
                     connectTel: this.ruleForm.connectTel,
                     bgImgPath: this.ruleForm.bgImgPath,
                     remarks1: this.ruleForm.remarks1,
                     remarks2: this.ruleForm.remarks2,
                     remarks3: this.ruleForm.remarks3
                  }).then(data => {
                     this.centerDialogVisible = false
                     this.$message({
                        message: '站点信息编辑成功',
                        type: 'success'
                     });                 
                  });
               }
            } else {
               console.log('error submit!!');
               return false;
            }
         });
      },
    // 重置按钮
      resetForm() {
         this.centerDialogVisible = false
         this.ruleForm.stationNo = ''
         this.ruleForm.stationName = ''
         this.ruleForm.stationLon = ''
         this.ruleForm.stationLat = ''
         this.ruleForm.stationAddress = ''
         this.ruleForm.processTech = ''
         this.ruleForm.processScale = ''
         this.ruleForm.devOpsNum = ''
         this.ruleForm.connectTel = ''
         this.ruleForm.bgImgPath = ''
         this.ruleForm.remarks1 = ''
         this.ruleForm.remarks2 = ''
         this.ruleForm.remarks3 = ''
      }
  },

  watch: {
    stationNameVal(newVal, oldVal) {
      if(newVal == '') {
        getAllStationInfo({
          page: 1,
          pageSize: 10,
          stationName: this.stationNameVal
        }).then(data => {
          this.tableData = data.data.dataList
          this.totalCount = data.data.total
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.site-editor-container {
  margin: 20px;
  .head-box {
    .inp-box {
      float: right;
      .inp {
        width: 300px;
        margin-right: 20px;
      }
    }
  }

  // 列表
  .list-box {
    margin-top: 20px;

    .page {
      float: left;
    }
  }
}
</style>