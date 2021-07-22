<template>
  <div class="site-editor-container">
    <div class="head-box">
      <el-button type="primary" @click="toAddStation()">添加站点</el-button>
      <div class="inp-box">
        <el-input class="inp" v-model="stationNameVal" placeholder="请输入站点名称" clearable></el-input>
        <el-button @click="searchFn()" type="primary">查找站点</el-button>
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
          prop="principal"
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
        <!-- <el-table-column
          prop="remarks3"
          label="备注3"
          width="120">
        </el-table-column>                            -->
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
  </div>
</template>

<script>
import { getAllStationInfo, deleteStationInfo } from '../../api/indexs'

export default {
  data() {
    return {
      stationNameVal: '', //搜索值
      tableData: [], //列表数组
      totalCount: 0, // 列表所有个数
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
    });
  },

  methods: {
    // 跳转添加站点
    toAddStation() {
      this.$router.push({
        path: '/station/addStation'
      })
    },

    // 搜索
    searchFn() {
      console.log(this.stationNameVal, '================this.stationNameVal');
      getAllStationInfo({
        page: 1,
        pageSize: 10,
        stationName: this.stationNameVal
      }).then(data => {
          this.tableData = data.data.dataList
          this.totalCount = data.data.total
      });
    },

    // 编辑
    toAdd(e) {
      this.$router.push({
        path: '/station/addStation',
        query: {
          params: e,
          type: 1
        }
      })
    },  

    // 删除
    toDelete(e) {
      deleteStationInfo({
        stationNo: e.stationNo
      }).then(data => {
        // 列表接口
        getAllStationInfo({
          page: 1,
          pageSize: 10,
          stationName: ''
        }).then(data => {
            this.tableData = data.data.dataList
            this.totalCount = data.data.total
        });
      });
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
        });
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
        });
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