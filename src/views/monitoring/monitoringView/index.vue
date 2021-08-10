<template>
  <div>
    <div style="margin-left: 20px">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="font-size: 18px; margin-top: 10px; margin-bottom: 10px"
      >
        <el-breadcrumb-item
          ><i class="el-icon-menu"></i><b> 监控画面展示</b></el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <el-container>
      <!--显示左边树-->
      <div width="20%" style="min-height: 500px; padding-top: 20px">
        <el-aside>
          <el-tree
            :data="data"
            ref="defaultProps"
            v-if="data"
            node-key="data"
            :default-expanded-keys="expandedkeys"
            :expand-on-click-node="false"
            @node-expand="nodeExpand"
            @node-collapse="nodeCollapse"
            @node-click="handleNodeClick"
            style="font-size: 16px"
          >
          </el-tree>
        </el-aside>
      </div>

      <!--显示组织相关的信息-->
      <el-main style="border-left: #e2e2e2 1px solid; padding-top: 10px">
        <ys-monitor
          :deviceId="deviceId"
          :channelId="channelId"
          :remarks1="remarks1"
          :url="url"
          :key="channelId"
          v-if="showjiankong == '01'"
        ></ys-monitor>
        <monitor
          :deviceId="deviceId"
          :channelId="channelId"
          :key="channelId"
          v-if="showjiankong == '02'"
        ></monitor>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { monitoringViewTree } from "../../../api/indexs";
import Monitor from "../Monitor";
import YsMonitor from "../YsMonitor";
export default {
  name: "monitoringView",
  components: {
    Monitor, //查看页面
    YsMonitor, //查看页面
  },
  data() {
    return {
      orgId: "", //父节点ID
      parentOrgName: "", //父节点名称
      showBtn: {}, //控制鼠标悬浮节点，显示操作按钮就信息
      showOrgType: "",
      data: [], //组织机构树数据
      expandedkeys: [], //操控展开节点数据
      openTree: true, //树的显示标识
      titleName: "", //表头
      orgType: "",
      showjiankong: "",
      deviceId: "",
      channelId: "",
      url: "",
      remarks1: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    //查询设备列表
    listOrganization(orgId, data) {
      // 列表接口
      monitoringViewTree().then((data) => {
        this.data = data.data;
      });
    },
    //节点展开事件
    nodeExpand(data, node, value) {
      this.expandedkeys.push(data.stationName);
    },
    //节点闭合事件
    nodeCollapse(data, node, value) {
      this.expandedkeys = this.expandedkeys.filter(function (item) {
        return item != data.stationName;
      });
    },
    handleNodeClick(data) {
      if (data != "" || data != null) {
        this.deviceId = data.deviceId;
        this.channelId = data.channelId;
        this.url = data.url;
        this.showjiankong = data.type;
        this.remarks1 = data.remarks1;
      }
    },
  },
  mounted() {
    this.listOrganization();
  },
};
</script>

<style scoped>
.el-button--mini,
.el-button--mini.is-round {
  padding: 5px 5px;
}
</style>
