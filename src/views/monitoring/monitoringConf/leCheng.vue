<template>
  <div class="site-editor-container">
    <div class="head-box">
      <el-button type="primary" @click="toAddSite()">添加监控配置</el-button>
      <!-- <div class="inp-box">
        <el-input class="inp" v-model="monitoringNameVal" placeholder="请输入监控名称" clearable></el-input>
        <el-button @click="searchFn()" type="primary">查找配置信息</el-button>
      </div> -->
      <el-button v-on:click="backHistory">返回</el-button>
    </div>

    <!-- 站点列表 -->
    <div class="list-box">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="monitoringNo"
          label="监控序号"
          align="center"
          width="240">
        </el-table-column>
        <el-table-column
          prop="monitoringName"
          label="监控名称"
          >
        </el-table-column>
        <el-table-column
          prop="deviceId"
          label="设备序列号"
          width="200">
        </el-table-column>
        <el-table-column
          prop="channelId"
          label="设备通道号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="remarks1"
          label="播放类型"
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
          width="100">
          <template slot-scope="scope">
            <el-button @click="toAdd(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="toDelete(scope.row)" type="text" size="small">删除</el-button>
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
               <el-form-item label="监控序号" prop="monitoringNo">
                  <el-input v-model="ruleForm.monitoringNo"></el-input>
               </el-form-item>               
               <el-form-item label="监控名称" prop="monitoringName">
                  <el-input v-model="ruleForm.monitoringName"></el-input>
               </el-form-item>
               <el-form-item label="设备序列号" prop="deviceId">
                  <el-input v-model="ruleForm.deviceId"></el-input>
               </el-form-item>
               <el-form-item label="设备通道号" prop="channelId">
                  <el-input v-model="ruleForm.channelId"></el-input>
               </el-form-item>                        
               <el-form-item label="播放类型">
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
import { getAllMonitorInfo, deleteMonitorInfo } from '../../../api/indexs'
import { saveMonitorInfo, updateMonitorInfo } from '../../../api/indexs'

export default {
  data() {
    return {
      monitoringNameVal: '',
      tableData: [],
      totalCount: 0,
      types: 0,
      centerDialogVisible: false,
      title:'添加监控配置信息',
      buttomName:'立即添加',
      ruleForm: {
            "stationNo": "",
            "stationName": "",
            "monitoringNo": "",
            "monitoringName": "",
            "deviceId": '',
            "channelId": '',
            "url": "",
            "remarks1": "",
            "remarks2": "",
            "remarks3": ""
         },
         rules: {
            monitoringNo: [
               { required: true, message: '请输入监控编号', trigger: 'blur' },
            ],
            monitoringName: [
               { required: true, message: '请输入监控名称', trigger: 'blur' },
            ],
            deviceId: [
               { required: true, message: '请输入设备序列号', trigger: 'blur' },
            ],
            channelId: [
               { required: true, message: '请输入设备通道号', trigger: 'blur' },
            ],      
         }    
    }
  },
  created() {
        let params = this.$route.query.params
        this.ruleForm.stationNo = params.stationNo
        this.ruleForm.stationName = params.stationName
   },
  mounted() {
    // 列表接口
    getAllMonitorInfo({
      stationNo: this.ruleForm.stationNo,
      type:"02"
    }).then(data => {
      this.tableData = data.data
      this.totalCount = data.data.length
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
      getAllMonitorInfo({
        stationNo: this.ruleForm.stationNo,
        type:"02"
      }).then(data => {
        this.tableData = data.data
        this.totalCount = data.data.length
      })
    },

    // 编辑
    toAdd(e) {
      this.ruleForm.stationNo = e.stationNo
      this.ruleForm.monitoringNo = e.monitoringNo
      this.ruleForm.monitoringName = e.monitoringName
      this.ruleForm.deviceId = e.deviceId
      this.ruleForm.channelId = e.channelId
      this.ruleForm.remarks1 = e.remarks1
      this.ruleForm.remarks2 = e.remarks2
      this.ruleForm.remarks3 = e.remarks3
      this.types= 1
      this.title='修改监控配置信息'
      this.buttomName='立即修改',
      this.centerDialogVisible = true
    },
    // 删除
    toDelete(e) {
      deleteMonitorInfo({
        monitoringNo: e.monitoringNo,
        type:"02"
      }).then(data => {
        // 列表接口
        getAllMonitorInfo({
          stationNo: this.ruleForm.stationNo,
          type:"02"
        }).then(data => {
          this.tableData = data.data
          this.totalCount = data.data.length
        })
      })
    },

    // 点击分页
    handleCurrentChange(val) {
      // 列表接口
      getAllMonitorInfo({
        stationNo: this.ruleForm.stationNo,
        type:"02"
      }).then(data => {
          this.tableData = data.data
          this.totalCount = data.data.length
      })
    },
    // 点击提交按钮
      submitForm(formName) {
         let t = this
         this.$refs[formName].validate((valid) => {
            if (valid) {
              let paramData = {
                  "channelId":this.ruleForm.channelId,
                  "deviceId":this.ruleForm.deviceId,
                  "monitoringName":this.ruleForm.monitoringName,
                  "monitoringNo":this.ruleForm.monitoringNo,
                  "remarks1":this.ruleForm.remarks1,
                  "remarks2":this.ruleForm.remarks2,
                  "remarks3":this.ruleForm.remarks3,
                  "url":this.ruleForm.url,
                  "stationNo":this.ruleForm.stationNo,
                  "type":"02"
              };
               if(t.types == 0) {
                  saveMonitorInfo(paramData).then(data => {
                     this.centerDialogVisible = false
                     this.searchFn()
                     this.resetForm() 
                     this.$message({
                        message: '监控配置信息添加成功',
                        type: 'success'
                     });
                  });                    
               } else if(t.types == 1) {
                  updateMonitorInfo(paramData).then(data => {
                     this.centerDialogVisible = false
                     this.searchFn()
                     this.resetForm() 
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
         this.ruleForm.monitoringNo = ''
         this.ruleForm.monitoringName = ''
         this.ruleForm.deviceId = ''
         this.ruleForm.channelId = ''
         this.ruleForm.remarks1 = ''
         this.ruleForm.remarks2 = ''
         this.ruleForm.remarks3 = ''
      },
      backHistory(){
        this.$router.go(-1);//返回上一层
      }
  },

  watch: {
    monitoringNameVal(newVal, oldVal) {
      if(newVal == '') {
        getAllMonitorInfo({
          stationNo: this.ruleForm.stationNo,
          type:"02"
        }).then(data => {
          this.tableData = data.data
          this.totalCount = data.data.length
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