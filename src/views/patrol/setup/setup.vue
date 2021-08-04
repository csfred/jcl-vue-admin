<template>
  <div class="pageView">
    <div class="normalTop">
      <div class="search-box">
        <div class="inp-box">
          <el-input
            v-model="stationNameVal"
            placeholder="请输入线路名称"
            clearable
          ></el-input>
        </div>
        <el-button class="searchBtn" @click="searchFn()" type="primary">查询</el-button>
      </div>
      <div class="controlBtnBox">
        <el-button @click="showDialog('add')" type="primary">新增线路</el-button>
      </div>
    </div>
    <!-- 站点列表 -->
    <div class="normalMain">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="stationNo" label="ID"> </el-table-column>
        <el-table-column prop="stationName" label="站点设备"> </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="showDialog('edit', scope.row)"
              >线路编辑</el-button
            >
            <el-button type="primary" @click="pointSetUp(scope.row)">点位设置</el-button>
            <el-button type="danger">删除线路</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="normalPage">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 线路模态框 -->
    <el-dialog
      class="normalDialog"
      :title="isEdit ? '编辑线路' : '新增线路'"
      :visible.sync="dialogVisible"
      width="35%"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="线路名称" prop="stationNo">
          <el-input v-model="ruleForm.stationNo"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="stationName">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入备注"
            v-model="ruleForm.stationName"
          >
          </el-input>
        </el-form-item>
        <div class="btnBox">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 点位模态框 -->
    <el-dialog
      class="normalDialog"
      title="点位设置"
      :visible.sync="pointDialogVisible"
      width="1000px"
    >
      <div class="normalTop">
        <div class="search-box">
          <div class="inp-box">
            <el-select v-model="station" placeholder="请选择站点">
              <el-option
                v-for="item in stationArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="inp-box">
            <el-select v-model="device" placeholder="请选择设备类型">
              <el-option
                v-for="item in deviceArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-button class="searchBtn" @click="searchFn()" type="primary">查询</el-button>
        </div>
      </div>
      <div class="normalMain">
        <el-table :data="deviceTableData" border>
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="stationNo" label="设备名"> </el-table-column>
          <el-table-column prop="stationName" label="位置">
            <template slot-scope="scope">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入位置说明"
                v-model="scope.row.abc"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="stationName" label="操作规范"
            ><template slot-scope="scope">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入操作规范"
                v-model="scope.row.abc"
              >
              </el-input> </template
          ></el-table-column>
        </el-table>
        <div class="normalPage">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
        <div class="btnBox">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveStationInfo, updateStationInfo } from "../../../api/indexs";
export default {
  data() {
    return {
      stationNameVal: "",
      tableData: [{}],
      deviceTableData: [{}],
      totalCount: 0,
      dialogVisible: false,
      pointDialogVisible: false,
      isEdit: false,
      ruleForm: {
        stationNo: "",
        remarks3: "",
      },
      rules: {
        stationNo: [{ required: true, message: "请输入站点编号", trigger: "blur" }],
      },
      station: "",
      stationArr: [],
      device: "",
      deviceArr: [],
    };
  },

  mounted() {},
  methods: {
    showDialog(type) {
      //线路设置
      this.isEdit = type === "edit";
      this.dialogVisible = true;
    },
    pointSetUp(param) {
      //点位设置
      this.pointDialogVisible = true;
    },
    // 搜索
    searchFn() {
      getAllStationInfo({
        page: 1,
        pageSize: 10,
        stationName: this.stationNameVal,
      }).then((data) => {
        this.tableData = data.data.dataList;
        this.totalCount = data.data.total;
      });
    },
    // 点击分页
    handleCurrentChange(val) {
      // 列表接口
      getAllStationInfo({
        page: val,
        pageSize: 10,
        stationName: "",
      }).then((data) => {
        this.tableData = data.data.dataList;
        this.totalCount = data.data.total;
      });
    },
    // 点击提交按钮
    submitForm(formName) {
      let t = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (t.types == 0) {
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
              remarks3: this.ruleForm.remarks3,
            }).then((data) => {
              this.dialogVisible = false;
              this.$message({
                message: "监控配置信息添加成功",
                type: "success",
              });
            });
          } else if (t.types == 1) {
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
              remarks3: this.ruleForm.remarks3,
            }).then((data) => {
              this.dialogVisible = false;
              this.$message({
                message: "站点信息编辑成功",
                type: "success",
              });
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置按钮
    resetForm() {
      this.dialogVisible = false;
      this.ruleForm.stationNo = "";
      this.ruleForm.stationName = "";
      this.ruleForm.stationLon = "";
      this.ruleForm.stationLat = "";
      this.ruleForm.stationAddress = "";
      this.ruleForm.processTech = "";
      this.ruleForm.processScale = "";
      this.ruleForm.devOpsNum = "";
      this.ruleForm.connectTel = "";
      this.ruleForm.bgImgPath = "";
      this.ruleForm.remarks1 = "";
      this.ruleForm.remarks2 = "";
      this.ruleForm.remarks3 = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./setup.scss";
</style>
