<template>
  <div class="pageView">
    <div class="normalTop">
      <div class="search-box">
        <div class="inp-box">
          <el-input v-model="stationNameVal" placeholder="计划名称" clearable></el-input>
        </div>
        <div class="inp-box">
          <el-input
            v-model="stationNameVal"
            placeholder="巡检人员姓名"
            clearable
          ></el-input>
        </div>
        <div class="inp-box">
          <el-select v-model="member" placeholder="请选择计划类型">
            <el-option
              v-for="item in memberArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="inp-box dateRange" v-if="activeName==='first'">
          <el-date-picker
            v-model="member"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            align="right"
          >
          </el-date-picker>
        </div>
        <el-button class="searchBtn" @click="searchFn()" type="primary">查询</el-button>
      </div>
      <div class="controlBtnBox">
        <el-button type="primary">导出记录</el-button>
      </div>
    </div>
    <div class="normalMain">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="实时人员巡检记录" name="first">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="stationNo" label="计划名称"> </el-table-column>
            <el-table-column prop="stationName" label="巡检员"> </el-table-column>
            <el-table-column prop="stationName" label="巡检点位"> </el-table-column>
            <el-table-column prop="stationName" label="计划开始时间"> </el-table-column>
            <el-table-column prop="stationName" label="计划结束时间"> </el-table-column>
            <el-table-column prop="stationName" label="巡检情况"> </el-table-column>
            <el-table-column width="230" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                  >排序</el-button
                >
              <el-button type="primary">查看文件存档</el-button>
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
        </el-tab-pane>
        <el-tab-pane label="实时计划巡检汇总" name="second">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="stationNo" label="计划名称"> </el-table-column>
            <el-table-column prop="stationName" label="巡检线路"> </el-table-column>
            <el-table-column prop="stationName" label="计划开始时间"> </el-table-column>
            <el-table-column prop="stationName" label="计划结束时间"> </el-table-column>
            <el-table-column prop="stationName" label="状态"> </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" @click="showDialog(scope.row)"
                  >巡检详情</el-button
                >
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 计划模态框 -->
    <el-dialog
      class="normalDialog"
      :title="title"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <div class="normalMain">
        <el-table :data="deviceTableData" border>
          <el-table-column prop="stationName" label="巡检员"> </el-table-column>
          <el-table-column prop="stationNo" label="巡检时间"> </el-table-column>
          <el-table-column prop="stationNo" label="巡检点位"> </el-table-column>
          <el-table-column prop="stationName" label="巡检情况"></el-table-column>
            <el-table-column prop="stationName" label="状态"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary">查看文件存档</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="normalPage">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount2"
            @current-change="handleCurrentChange2"
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
      title: "",
      stationNameVal: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tableData: [{}],
      totalCount: 0,
      dialogVisible: false,
      isEdit: false,
      member: "",
      memberArr: [],
      activeName: "first",
      ruleForm: {
        stationNo: "",
        remarks3: "",
      },
      role: "",
      roleArr: [],
      deviceTableData: [{}],
      totalCount2: 0,
      ruleForm: {
        stationNo: "",
        remarks3: "",
      },
      rules: {
        stationNo: [{ required: true, message: "请输入站点编号", trigger: "blur" }],
      },
    };
  },

  mounted() {},
  methods: {
    showDialog(param) {
      //线路设置
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
    // 任务详情点击分页
    handleCurrentChange2(val) {
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
@import "./record.scss";
</style>
