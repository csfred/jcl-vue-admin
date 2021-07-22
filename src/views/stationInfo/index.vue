<template>
  <div class="exhibition-container">
     <!-- 百度地图 -->
     <div v-if="showMap">
      <baidu-map
        id="container"
        class="map"
        :zoom="zoom"
        :center="autoLocationPoint"
        :mapClick="false"
        @ready="handler"
        @click="getLocation"
        :scroll-wheel-zoom="true"
      >
      </baidu-map>
     </div>


      <!-- 站点侧边信息 -->
      <div class="silder-container">
        <el-drawer
          title="我是标题"
          :visible.sync="drawer"
          :with-header="false"
          >
            <div class="site-info">
              <el-button class="btn" @click="toMachine()">进入站点详情</el-button>
              <div class="info-box">
                <div class="item site-name">
                  <div class="label">站点编号</div>
                  <div class="name">{{ currentSiseData.stationNo }}</div>
                </div>
                <div class="item">
                  <span class="label">站点名称:</span>
                  <span>{{ currentSiseData.stationName }}</span>
                </div>
                <div class="item">
                  <span class="label">站点地址:</span>
                  <span>{{ currentSiseData.stationAddress }}</span>
                </div>
                <div class="item">
                  <span class="label">处理工艺:</span>
                  <span>{{ currentSiseData.processTech }}</span>
                </div>
                <div class="item">
                  <span class="label">处理规模:</span>
                  <span>{{ currentSiseData.processScale }}</span>
                </div>
                <div class="item">
                  <span class="label">运维人数:</span>
                  <span>{{ currentSiseData.devOpsNum }}</span>
                </div>
                <div class="item" v-if="false">
                  <span class="label">负责人:</span>
                  <span>{{ currentSiseData.name }}</span>
                </div>
                <div class="item">
                  <span class="label">联系电话:</span>
                  <span>{{ currentSiseData.connectTel }}</span>
                </div>
                <div class="item">
                  <span class="label">备注1:</span>
                  <span>{{ currentSiseData.remarks1 }}</span>
                </div>
                <div class="item">
                  <span class="label">备注2:</span>
                  <span>{{ currentSiseData.remarks2 }}</span>
                </div>
                <div class="item">
                  <span class="label">备注3:</span>
                  <span>{{ currentSiseData.remarks3 }}</span>
                </div>                 
              </div>
            </div>
        </el-drawer>       
      </div>


  </div>
</template>

<script>
import { getAllStationInfo } from '../../api/indexs'

export default {
  data() {
    return {
      zoom: 15,
      autoLocationPoint: { lng: 110.299121, lat:25.274215 },
      initLocation: false,

      mapListData: [], // 站点列表数组
      showMap: false, // 显示地图

      // 侧边站点信息
      drawer: false,
      direction: 'rtl',
      drawerTitle: '', // 侧边站点名称
      currentSiseData: {}, // 单个站点信息
    }
  },

  created() {  
    // 获取所有站点
    getAllStationInfo({
      page: 1,
      pageSize: 100,
      stationName: ''
    }).then(data => {
      this.mapListData = data.data.dataList
      this.showMap = true
    });
  },  

  methods: {
    // 百度地图
    handler({ BMap, map }) {
      let t = this;

      // 遍历地图数据
      t.mapListData.forEach((_t, i) => {

        // 获取坐标值
        var point = new BMap.Point(_t.stationLon, _t.stationLat);
        // 以坐某项数据的标值为中心
        map.centerAndZoom(new BMap.Point(this.mapListData[0].stationLon, this.mapListData[0].stationLat), 15);
        // 将标注添加到地图
        var marke = new BMap.Marker(new BMap.Point(_t.stationLon, _t.stationLat));

        var opts = {
          position: new BMap.Point(_t.stationLon, _t.stationLat), // 指定文本标注所在的地理位置
          offset: new BMap.Size(0, 20) // 设置文本偏移量
        };
        // 创建文本标注对象
        var label = new BMap.Label(_t.stationName, opts);

        // 自定义文本标注样式
        label.setStyle({
            color: '#555',
            borderRadius: '50px',
            border: 'none',
            padding: '0 15px',
            fontSize: '14px',
            height: '36px',
            lineHeight: '36px',
            boxShadow: '0 2px 4px rgba(0,0,0,.3)',
            transform: 'translateX(-50%)',
            maxWidth: '400px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        });

        // 点击锚点
        marke.addEventListener("click", function () {
            // 以坐某项数据的标值为中心
            map.centerAndZoom(point, 15);
            // 显示侧边站点信息
            t.drawer = true
            // 获取站点名
            t.drawerTitle = _t.stationName
            t.currentSiseData = _t
            console.log(t.currentSiseData, '=============t.currentSiseData');
        });

        // 将标注添加到地图
        map.addOverlay(marke);
        // 添加文本描述
        map.addOverlay(label);
      });
    },

    // 点击位置获取经纬度
    getLocation(e) {
      this.autoLocationPoint.lng = e.point.lng
      this.autoLocationPoint.lat = e.point.lat
    },

    /* 侧边站点信息内容 */

    // 点击关闭按钮
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    toMachine() {
      this.$router.push({
        path: '/machine/index'
      })
    }    
  }
}
</script>

<style lang="scss">
.exhibition-container {
   position: relative;
   .map {
      width: 100vw;
      height: 100vh;
      // position: absolute;
      // top: 0;
      // right: 0;
      // bottom: 0;
      // left: 0;
   }

  //  侧边站点信息
  .silder-container {
    .site-info {
      margin: 20px;
      // background: red;
      .btn {
        background: #1096FF;
        color: #fff;
        border: none;
      }
      .info-box {
        .item {
          height: 40px;
          .label {
            display: inline-block;
            width: 90px;
            color: #999;
          }
        }
        .site-name {
          margin: 20px 0;
          .name {
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>