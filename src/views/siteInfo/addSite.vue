<template>
  <div class="add-site-container">
     <!-- 百度地图 -->
     <div id="map"></div>

     <!-- 模态框 -->
     <div class="">
         <el-dialog
            title="添加站点"
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
               <el-form-item label="负责人" prop="principal">
                  <el-input v-model="ruleForm.principal"></el-input>
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
               <!-- <el-form-item label="备注3">
                  <el-input v-model="ruleForm.remarks3"></el-input>
               </el-form-item> -->
               <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                  <!--<el-button @click="testPost()">testPost</el-button>-->
               </el-form-item>
            </el-form>
         </el-dialog>        
     </div>
  </div>
</template>

<script>
import { saveStationInfo, updateStationInfo, testPost } from '../../api/indexs'

export default {
   data() {
      return {
         // 判断是否是编辑页跳转过来的
         types: 0,

         // 站点编号是否可编辑
         disabled: false,

         isShowModal: false,
         centerDialogVisible: false,
 
         ruleForm: {
            "stationNo": "",
            "stationName": "",
            "stationLon": '',
            "stationLat": '',
            "stationAddress": "",
            "processTech": "",
            "processScale": null,
            "devOpsNum": null,
            "principal": "",
            "connectTel": "",
            "bgDevImgPath": "",
            "bgWaterImgPath": "",
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

   created() {
        this.types = this.$route.query.type
         let params = this.$route.query.params
         if(this.types == 1) {
            this.centerDialogVisible = true
            this.disabled = true
            this.ruleForm.stationNo = params.stationNo
            this.ruleForm.stationName = params.stationName
            this.ruleForm.stationLon = params.stationLon
            this.ruleForm.stationLat = params.stationLat
            this.ruleForm.stationAddress = params.stationAddress
            this.ruleForm.processTech = params.processTech
            this.ruleForm.processScale = params.processScale
            this.ruleForm.devOpsNum = params.devOpsNum
            this.ruleForm.principal = params.principal
            this.ruleForm.connectTel = params.connectTel
            this.ruleForm.bgDevImgPath = params.bgDevImgPath
            this.ruleForm.bgWaterImgPath = params.bgWaterImgPath
            this.ruleForm.remarks1 = params.remarks1
            this.ruleForm.remarks2 = params.remarks2
         } else {
            this.types = 0
         }
   },

   mounted() {
      // 地图
      this.mapFn()
   },

   methods: {
      mapFn() {
         let t = this
         // 百度地图API功能
         var map = new BMap.Map("map", {enableMapClick:false});    // 创建Map实例
         map.centerAndZoom(new BMap.Point(110.299121,25.274215), 11);  // 初始化地图,设置中心点坐标和地图级别
         //添加地图类型控件
         map.addControl(new BMap.MapTypeControl({
            mapTypes:[
               BMAP_NORMAL_MAP,
               BMAP_HYBRID_MAP
            ]}));
         map.addEventListener('click', function(e) {
            // alert('click!')
            t.isShowModal = true
            t.centerDialogVisible = true
            t.ruleForm.stationLat = e.point.lat
            t.ruleForm.stationLon = e.point.lng
         });         
         map.setCurrentCity("西安");          // 设置地图显示的城市 此项是必须设置的
         map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
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
                     principal: this.ruleForm.principal,
                     connectTel: this.ruleForm.connectTel,
                     bgDevImgPath: this.ruleForm.bgDevImgPath,
                     bgWaterImgPath: this.ruleForm.bgWaterImgPath,
                     remarks1: this.ruleForm.remarks1,
                     remarks2: this.ruleForm.remarks2,
                     remarks3: ''
                  }).then(data => {
                     console.log(data);
                     this.centerDialogVisible = false
                     this.$message({
                        message: '站点信息添加成功',
                        type: 'success'
                     });
                     this.$router.push({
                        path: '/site/index'
                     })
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
                     principal: this.ruleForm.principal,
                     connectTel: this.ruleForm.connectTel,
                     bgDevImgPath: this.ruleForm.bgDevImgPath,
                     bgWaterImgPath: this.ruleForm.bgWaterImgPath,
                     remarks1: this.ruleForm.remarks1,
                     remarks2: this.ruleForm.remarks2,
                     remarks3: this.ruleForm.remarks3
                  }).then(data => {
                     this.disabled = false
                     this.centerDialogVisible = false
                     this.$message({
                        message: '站点信息编辑成功',
                        type: 'success'
                     });
                     this.$router.push({
                        path: '/site/index'
                     })                     
                  });
               }
            } else {
               console.log('error submit!!');
               return false;
            }
         });
      },

      //testPost
      testPost(){
         let paramData = {
            "channelId":"214124",
            "deviceId":"124124124",
            "monitoringName":"测试",
            "monitoringNo":"100001",
            "remarks1":"",
            "remarks2":"",
            "remarks3":"",
            "url":"http://aaa.com",
            "stationNo":"OG581LL0720072800318"
         };
         testPost(paramData)
            .then(data => {
            this.disabled = false
            this.centerDialogVisible = false
            this.$message({
               message: '测试POST成功',
               type: 'success'
            });
            this.$router.push({
               path: '/site/index'
            })                     
         }).catch(err => {
            console.log(err) // 这里catch到错误timeout
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
         this.ruleForm.principal = ''
         this.ruleForm.connectTel = ''
         this.ruleForm.bgDevImgPath = ''
         this.ruleForm.bgWaterImgPath = ''
         this.ruleForm.remarks1 = ''
         this.ruleForm.remarks2 = ''
      }
   }   
}
</script>

<style lang="scss" scoped>
.add-site-container {
   position: relative;
   #map {
      width: 100vw;
      height: 100vh;
      // position: absolute;
      // top: 0;
      // right: 0;
      // bottom: 0;
      // left: 0;
   }
}
</style>