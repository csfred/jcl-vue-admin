<template>
  <div class="add-machine-container clearfix">
    <el-row :gutter="24" class="gutter">
      <el-col :span="4" class="fh colLeft">
        <!-- 左侧拖拽区域 -->
        <div class="left-box">
          <div class="title">双击添加</div>
          <div class="list-box">
            <div
              class="item-box"
              v-for="(item, index) in listData"
              :key="index"
              @dblclick="addDevice(item, index)"
            >
              <div class="item" :title="item.devTypeName">
                <img :src="item.imgSrc" alt="" v-if="item.id != 20 && item.id != 21" />
                <span v-else class="circle" :class="{ linePlay: item.id === 21 }"></span>
                {{ item.devTypeName }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="20" class="fh">
        <!-- 右侧显示区域 -->
        <div class="right-box">
          <div class="header-box">
            <el-select
              v-model="station"
              clearable
              placeholder="请选择站点"
              @change="selectStation"
            >
              <el-option
                v-for="item in stationArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-select
              v-model="sitePage"
              class="add-page-select"
              placeholder="选择页面"
              @change="handlePageChange"
            >
              <el-option
                v-for="item in sitePageArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
              <el-option label="" value="">
                <el-button
                  type="primary"
                  style="
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    border: none;
                    border-radius: 0;
                  "
                  @click="addPage()"
                >
                  添加新页面
                </el-button>
              </el-option>
            </el-select>
            <!-- 载入当前背景 -->
            <bg-upload ref="bgUpload" :onUpload="handleUpload"> </bg-upload>
            <el-button size="small" type="primary" @click="handleBg"
              >{{ currentBg ? "替换" : "上传" }}背景图</el-button
            >
            <!-- <el-button size="small" type="primary" @click="delBg" v-if="currentBg"
              >删除背景图</el-button
            > -->
            <!-- <el-button type="primary" @click="updateStationInfo">保存页面</el-button> -->
            <el-button type="primary" v-if="sitePage" @click="delPage"
              >删除页面</el-button
            >
          </div>
          <div class="resizable-box">
            <div
              class="dragBox"
              :style="{ width: sitePageW + 'px', height: sitePageH + 'px' }"
            >
              <template v-for="item in deviceDataArr">
                <!-- 设备 -->
                <vue-drag-resize-rotate
                  :key="item.key"
                  :parent-limitation="true"
                  :w="item.w"
                  :h="item.h"
                  :x="item.x"
                  :y="item.y"
                  :deg="item.deg"
                  :minw="10"
                  :minh="10"
                  isRotatable
                  @resizing="
                    (val) => {
                      onResize(val, item);
                    }
                  "
                  @dragging="
                    (val) => {
                      onDrag(val, item);
                    }
                  "
                  @rotating="
                    (deg) => {
                      rotate(deg, item);
                    }
                  "
                  @activated="onActivated(item)"
                  @deactivated="onDeactivated(item)"
                  @dragstop="handleOver(item)"
                  @rotatestop="handleOver(item)"
                  @resizestop="handleOver(item)"
                >
                  <i
                    v-show="item.isActivated"
                    @click.stop.prevent="handleDel(item)"
                    class="el-icon-circle-close closeIcon"
                  ></i>
                  <!-- 标题 -->
                  <input
                    v-if="item.id === 0"
                    type="text"
                    readonly
                    :value="item.title"
                    @dblclick.stop.prevent="handleDeviceInfo(item)"
                    :style="{ color: item.color, fontSize: item.fontSize + 'px' }"
                    placeholder="双击输入标题"
                  />
                  <!-- 显示屏 -->
                  <div
                    class="areaBox"
                    :style="{
                      color: item.color,
                      fontSize: item.fontSize + 'px',
                      lineHeight: `${item.h}px`,
                    }"
                    v-else-if="item.id === 19"
                    @dblclick.stop.prevent="handleDeviceInfo(item)"
                  >
                    {{ item.showLabel ? item.showLabel + "" : "双击绑定变量" }}
                  </div>
                  <!-- 指示灯 -->
                  <div
                    class="circle"
                    :style="{ backgroundColor: item.zeroColor }"
                    v-else-if="item.id === 20"
                    @dblclick.stop.prevent="handleDeviceInfo(item)"
                  ></div>
                  <!-- 流动跑马灯 -->
                  <div
                    class="linePlay linePlayBox"
                    v-else-if="item.id === 21"
                    :style="{
                      'background-image': `linear-gradient(45deg,${item.lineColor} 25%,transparent 25%,transparent 50%,${item.lineColor} 50%,${item.lineColor} 75%,transparent 75%,transparent  )`,
                    }"
                    @dblclick.stop.prevent="handleDeviceInfo(item)"
                  ></div>
                  <img
                    v-else
                    class="rotateImg"
                    :src="item.img1"
                    @dblclick.stop.prevent="handleDeviceInfo(item)"
                    alt=""
                  />
                </vue-drag-resize-rotate>
              </template>
              <!-- 当前页面底图 -->
              <img :src="currentBg" v-if="currentBg" alt="" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加页面模态框 -->
    <el-dialog class="modal-box" title="添加页面" :visible.sync="dialogFormVisible">
      <div class="ipt-box">
        <span class="label">页面名称</span>
        <el-input v-model="pageName"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPageNameFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加设备要素模态框 -->
    <el-dialog class="deviceInfo" title="设备信息" :visible.sync="dialogVisible">
      <el-form ref="form" :model="deviceInfo" label-width="110px">
        <el-form-item class="must" label="设备工艺名称" v-if="permission('deviceName')">
          <el-input v-model="deviceInfo.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" v-if="permission('showLabel')">
          <el-input v-model="deviceInfo.showLabel"></el-input>
        </el-form-item>
        <el-form-item label="设备位号" v-if="permission('bitNum')">
          <el-input v-model="deviceInfo.bitNum"></el-input>
        </el-form-item>
        <el-form-item label="设备功率" v-if="permission('power')">
          <el-input v-model="deviceInfo.power"></el-input>
        </el-form-item>
        <el-form-item label="阀门类型" v-if="permission('type')">
          <el-input v-model="deviceInfo.type"></el-input>
        </el-form-item>
        <el-form-item label="额定气压" v-if="permission('ratedPressure')">
          <el-input v-model="deviceInfo.ratedPressure"></el-input>
        </el-form-item>
        <el-form-item label="阀门输出扭矩" v-if="permission('torque')">
          <el-input v-model="deviceInfo.torque"></el-input>
        </el-form-item>
        <el-form-item label="开关阀时间" v-if="permission('time')">
          <el-input v-model="deviceInfo.time"></el-input>
        </el-form-item>

        <el-form-item label="显示值" v-if="permission('showValue')">
          <el-input v-model="deviceInfo.showValue"></el-input>
        </el-form-item>
        <el-form-item label="上限报警值" v-if="permission('HIAL')">
          <el-input v-model="deviceInfo.HIAL"></el-input>
        </el-form-item>
        <el-form-item label="下限报警值" v-if="permission('LIAL')">
          <el-input v-model="deviceInfo.LIAL"></el-input>
        </el-form-item>
        <el-form-item label="仪表量程" v-if="permission('instrumentRange')">
          <el-input v-model="deviceInfo.instrumentRange"></el-input>
        </el-form-item>

        <el-form-item label="电动机额定转速" v-if="permission('RSOM')">
          <el-input v-model="deviceInfo.RSOM"></el-input>
        </el-form-item>

        <el-form-item label="输出轴转速" v-if="permission('OSS')">
          <el-input v-model="deviceInfo.OSS"></el-input>
        </el-form-item>
        <el-form-item label="搅拌叶片数量" v-if="permission('VaneQuantity')">
          <el-input v-model="deviceInfo.VaneQuantity"></el-input>
        </el-form-item>
        <el-form-item label="搅拌叶片直径" v-if="permission('DOAB')">
          <el-input v-model="deviceInfo.DOAB"></el-input>
        </el-form-item>
        <el-form-item label="筛网提升速度" v-if="permission('SLS')">
          <el-input v-model="deviceInfo.SLS"></el-input>
        </el-form-item>
        <el-form-item label="栅格有效宽度" v-if="permission('EWG')">
          <el-input v-model="deviceInfo.EWG"></el-input>
        </el-form-item>
        <el-form-item label="额定风量" v-if="permission('RAF')">
          <el-input v-model="deviceInfo.RAF"></el-input>
        </el-form-item>
        <el-form-item label="额定压力" v-if="permission('MPA')">
          <el-input v-model="deviceInfo.MPA"></el-input>
        </el-form-item>
        <el-form-item label="额定流量" v-if="permission('ratedFlow')">
          <el-input v-model="deviceInfo.ratedFlow"></el-input>
        </el-form-item>
        <el-form-item label="额定杨程" v-if="permission('RatedHm')">
          <el-input v-model="deviceInfo.RatedHm"></el-input>
        </el-form-item>

        <el-form-item label="设备品牌" v-if="permission('brand')">
          <el-input v-model="deviceInfo.brand"></el-input>
        </el-form-item>
        <el-form-item label="信号类型" v-if="permission('SignalTypes')">
          <el-input v-model="deviceInfo.SignalTypes"></el-input>
        </el-form-item>
        <el-form-item label="阀门口径" v-if="permission('caliber')">
          <el-input v-model="deviceInfo.caliber"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" v-if="permission('model')">
          <el-input v-model="deviceInfo.model"></el-input>
        </el-form-item>
        <el-form-item label="备注1" v-if="permission('remark1')">
          <el-input v-model="deviceInfo.remark1"></el-input>
        </el-form-item>
        <el-form-item label="备注2" v-if="permission('remark2')">
          <el-input v-model="deviceInfo.remark2"></el-input>
        </el-form-item>
        <el-form-item label="备注3" v-if="permission('remark3')">
          <el-input v-model="deviceInfo.remark3"></el-input>
        </el-form-item>
        <div class="bottom" :class="{ noImg: currentDevice.id === 0 }">
          <el-form-item label="标题名称" v-if="permission('title')">
            <el-input v-model="deviceInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="字体颜色" v-if="permission('color')">
            <el-input v-model="deviceInfo.color"></el-input>
          </el-form-item>
          <el-form-item label="字体大小" v-if="permission('fontSize')">
            <el-input v-model="deviceInfo.fontSize"></el-input>
          </el-form-item>
          <el-form-item label="值0指示灯颜色" v-if="permission('zeroColor')">
            <el-input v-model="deviceInfo.zeroColor"></el-input>
          </el-form-item>
          <el-form-item label="非0指示灯颜色" v-if="permission('notZeroColor')">
            <el-input v-model="deviceInfo.notZeroColor"></el-input>
          </el-form-item>
          <el-form-item label="流水背景色" v-if="permission('lineColor')">
            <el-input v-model="deviceInfo.lineColor"></el-input>
          </el-form-item>
          <el-form-item label="流动速度" v-if="permission('playSpeed')">
            <el-input-number
              v-model="deviceInfo.playSpeed"
              :min="0"
              :max="100"
              label="0-100,数值越大流动越快"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="关联变量" v-if="permission('relatedName')">
            <el-input type="relatedName" v-model="deviceInfo.relatedName"></el-input>
          </el-form-item>
          <el-form-item label="阀门开度反馈" v-if="permission('MVRB')">
            <el-input v-model="deviceInfo.MVRB"></el-input>
          </el-form-item>
          <el-form-item label="阀门开度控制" v-if="permission('MVC')">
            <el-input v-model="deviceInfo.MVC"></el-input>
          </el-form-item>
          <el-form-item label="程控位置" v-if="permission('SPCLocation')">
            <el-input v-model="deviceInfo.SPCLocation"></el-input>
          </el-form-item>
          <el-form-item label="运行信号" v-if="permission('signal')">
            <el-input v-model="deviceInfo.signal"></el-input>
          </el-form-item>
          <el-form-item label="开到位信号" v-if="permission('signalOpen')">
            <el-input v-model="deviceInfo.signalOpen"></el-input>
          </el-form-item>
          <el-form-item label="关到位信号" v-if="permission('signalClose')">
            <el-input v-model="deviceInfo.signalClose"></el-input>
          </el-form-item>
          <el-form-item label="故障信号" v-if="permission('troubleSignal')">
            <el-input v-model="deviceInfo.troubleSignal"></el-input>
          </el-form-item>
          <el-form-item label="备用预警" v-if="permission('StandbyAlert')">
            <el-input v-model="deviceInfo.StandbyAlert"></el-input>
          </el-form-item>
          <el-form-item label="仪表显示" v-if="permission('MeterValue')">
            <el-input v-model="deviceInfo.MeterValue"></el-input>
          </el-form-item>
          <el-form-item label="瞬时流量显示" v-if="permission('ISD')">
            <el-input v-model="deviceInfo.ISD"></el-input>
          </el-form-item>
          <el-form-item label="累计流量显示" v-if="permission('CFD')">
            <el-input v-model="deviceInfo.CFD"></el-input>
          </el-form-item>
          <el-form-item label="隐藏变量值" v-if="permission('fieldVisible')">
            <el-checkbox v-model="deviceInfo.fieldVisible"></el-checkbox>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDeviceInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllDeviceType,
  getAllStationInfo,
  uploadBinaryFile,
  updateStationInfo,
  saveDeviceInfo,
  updateDeviceInfo,
  batchUpdateDeviceInfo,
  getDeviceInfoByStationNo,
  deleteBgDevImg,
} from "../../api/indexs";
import { Images } from "../../utils/images";
import bgUpload from "@/components/bgUpload/bgUpload.vue";
import $debouce from "@/utils/debounce";
export default {
  components: {
    "bg-upload": bgUpload,
  },
  data() {
    return {
      // 左侧添加拖拽设备
      mousedown: false,
      listData: [],

      // 右侧拖拽参数
      width: 80,
      height: 80,
      x: 0,
      y: 0,
      resizableActive: false,

      deviceDataArr: [], //添加设备数组

      // 站点
      stationArr: [],
      station: "",
      // 当前站点页面
      sitePageArr: [],
      sitePage: "",
      sitePageW: "",
      sitePageH: "",
      currentBg: null, // 载入当前背景图

      dialogImageUrl: "",
      dialogVisible: false,
      isBtnClick: false,
      currentDevice: {},
      deviceInfo: {
        showLabel: "", //显示名
        color: "", //字体颜色
        fontSize: "", //字体大小

        deviceName: "", //设备工艺名称
        title: "", //标题
        bitNum: "", //位号
        type: "", //类型
        ratedPressure: "", //额定气压
        torque: "", //阀门扭矩
        time: "", //开关时间
        brand: "", //品牌
        caliber: "", //口径
        model: "", //型号

        // 泵
        power: "", //功率
        ratedFlow: "", //额定流量
        RSOM: "", //电动机额定转速
        SLS: "", //筛网提升速度
        EWG: "", //栅格有效宽度

        OSS: "", //输出轴转速
        VaneQuantity: "", //搅拌叶片数量
        DOAB: "", //搅拌叶片直径

        RAF: "", //额定风量
        MPA: "", //额定压力
        RatedHm: "", //额定杨程
        SPCLocation: "", //程控位置
        signal: "", //运行信号
        troubleSignal: "", //故障信号
        StandbyAlert: "", //备用预警

        // 开关量液位仪
        showValue: "", //显示值
        HIAL: "", //上限报警值
        LIAL: "", //下限报警值
        instrumentRange: "", //仪表量程
        SignalTypes: "", //信号类型
        MeterValue: "", //仪表显示

        signalOpen: "", //开到位信号
        signalClose: "", //关到位信号
        remark1: "",
        remark2: "",
        remark3: "",
        MVRB: "", //阀门开度反馈
        MVC: "", //阀门开度控制

        ISD: "", //瞬时流量显示
        CFD: "", //累计流量显示

        relatedName: "", //关联变量
        fieldVisible: true, //隐藏关联变量
        zeroColor: "",
        notZeroColor: "",
        // playSpeed: "", //跑马灯线条移动速度
        lineColor: "", //跑马灯线条颜色
      },
      deviceForm: {
        custom0: 0,
        custom19: 1,
        custom20: 1,
        custom21: 1,
        custom1: 4,
        custom2: 2,
        custom3: 1,
        custom4: 4,
        custom5: 4,
        custom6: 4,
        custom7: 4,
        custom8: 4,
        custom9: 4,
        custom10: 2,
        custom11: 1,
        custom12: 1,
        custom13: 1,
        custom14: 1,
        custom15: 1,
        custom16: 1,
        custom17: 1,
        custom18: 1,
        r0: [
          //标题
          "title",
          "color",
          "fontSize",
        ],
        r19: [
          //显示屏
          "showLabel",
          "remark1",
          "remark2",
          "remark3",
          "color",
          "fontSize",
          "relatedName",
        ],
        r20: [
          //指示灯
          "title",
          "zeroColor",
          "notZeroColor",
          "relatedName",
        ],
        r21: [
          //显示屏
          "title",
          "lineColor",
          "relatedName",
        ],
        r1: [
          //泵
          "deviceName",
          "bitNum",
          "power",
          "ratedFlow",
          "RatedHm",
          "brand",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signal",
          "troubleSignal",
          "StandbyAlert",
        ],
        r2: [
          //流量计
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "ISD",
          "CFD",
        ],
        r3: [
          //液位计
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r4: [
          //加药泵
          "deviceName",
          "bitNum",
          "power",
          "ratedFlow",
          "RatedHm",
          "brand",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signal",
          "troubleSignal",
          "StandbyAlert",
        ],
        r5: [
          //风机
          "deviceName",
          "bitNum",
          "power",
          "RAF",
          "MPA",
          "brand",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signal",
          "troubleSignal",
          "StandbyAlert",
        ],
        r6: [
          //搅拌机
          "deviceName",
          "bitNum",
          "power",
          "RSOM",
          "OSS",
          "VaneQuantity",
          "DOAB",
          "brand",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signal",
          "troubleSignal",
          "StandbyAlert",
        ],
        r7: [
          //格栅机
          "deviceName",
          "bitNum",
          "power",
          "RSOM",
          "SLS",
          "EWG",
          "brand",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signal",
          "troubleSignal",
          "StandbyAlert",
        ],
        r8: [
          //电动阀
          "deviceName",
          "bitNum",
          "power",
          "torque",
          "time",
          "brand",
          "caliber",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signalOpen",
          "signalClose",
          "troubleSignal",
        ],
        r9: [
          //气动阀
          "deviceName",
          "bitNum",
          "ratedPressure",
          "torque",
          "time",
          "brand",
          "caliber",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "SPCLocation",
          "signalOpen",
          "signalClose",
          "troubleSignal",
        ],
        r10: [
          //比例调节阀
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "type",
          "torque",
          "time",
          "brand",
          "caliber",
          "model",
          "remark1",
          "remark2",
          "remark3",
          "MVRB",
          "MVC",
        ],
        r11: [
          //压力传感器
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r12: [
          //PH计
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r13: [
          //orp
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r14: [
          //电导
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r15: [
          //浊度
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r16: [
          //温度仪表显示
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r17: [
          //开关量液位计
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
        r18: [
          //备用仪表显示
          "deviceName",
          "fieldVisible",
          "color", //字体颜色
          "fontSize", //字体大小
          "bitNum",
          "showValue",
          "HIAL",
          "LIAL",
          "instrumentRange",
          "brand",
          "SignalTypes",
          "remark1",
          "remark2",
          "remark3",
          "MeterValue",
        ],
      },
      // 添加页面模态框
      dialogFormVisible: false,
      pageName: "",
    };
  },

  mounted() {
    // 获取所有拖拽元素
    this.getAllDeviceType();
    this.getAllStationInfo();
  },

  methods: {
    getAllDeviceType() {
      getAllDeviceType().then((data) => {
        this.listData = data.data.map((item) => {
          return {
            ...item,
            imgSrc: Images[item.id],
          };
        });
        // 添加显示屏到设备数组内
        this.listData.push(
          { id: 0, devTypeName: "标题", imgSrc: Images[0] },
          { id: 20, devTypeName: "指示灯", imgSrc: null },
          { id: 21, devTypeName: "跑马灯", imgSrc: null }
        );
      });
    },
    getAllStationInfo() {
      getAllStationInfo({ page: 1, pageSize: 100, stationName: "" }).then((data) => {
        this.station = "";
        this.stationArr = data.data.dataList.map((item) => {
          return {
            ...item,
            value: item.stationNo,
            label: item.stationName,
          };
        });
      });
    },
    selectStation(val) {
      //选择站点，更新底图页面
      const currentItem = this.stationArr.find((item) => item.value === val);
      this.sitePageArr = [];
      this.deviceDataArr = [];
      this.sitePage = "";
      this.currentBg = "";
      const { bgDevImgPath, remarks3 } = currentItem;
      if (bgDevImgPath && remarks3) {
        JSON.parse(bgDevImgPath).forEach((val) => {
          const item = JSON.parse(remarks3).find((list) => list.value === val);
          item &&
            this.sitePageArr.push({
              ...item,
              haveBg: true,
            });
        });
      }
    },
    // 点击设备元素
    addDevice(item) {
      if (!this.sitePage) {
        this.$message({
          type: "warning",
          message: "请选择页面后添加设备！",
        });
        return;
      }
      const id = item.id;
      let param = {
        name: item.devTypeName,
        id: id,
        deg: 0,
        w: id === 21 ? 100 : 50,
        h: 40,
        x: 50,
        y: 50,
        isActivated: false,
        key: new Date().getTime(),
        value: "",
      };
      if (id != 0 && id != 19 && id != 21) {
        Object.assign(param, {
          w: 70,
          h: 70,
          img1: Images[id],
        });
      }
      this.deviceDataArr.push(param);
      console.log(this.deviceDataArr, "====this.deviceDataArr");
    },
    // del el
    async handleDel(item) {
      const { key, businessId } = item;
      if (businessId) {
        await this.deleteBgDevImg(businessId);
      }
      const index = this.deviceDataArr.findIndex((list) => list.key === key);
      this.doDel(index);
    },
    doDel(index) {
      index >= 0 && this.deviceDataArr.splice(index, 1);
    },
    deleteBgDevImg(devNo) {
      //根据站点，底图，设备号删除底图或设备信息
      // stationNo  bgDevImg  devNo
      return new Promise((resolve) => {
        let param = {
          stationNo: this.station,
          bgDevImg: this.sitePage,
        };
        devNo && (param.devNo = devNo);
        deleteBgDevImg(param).then(({ code }) => {
          if (code == "200") {
            resolve();
          }
        });
      });
    },
    // 添加页面按钮
    addPage() {
      if (!this.station) {
        this.$message({
          type: "warning",
          message: "请选择站点后添加背景图！",
        });
        return;
      }
      this.dialogFormVisible = true;
    },
    // 添加页面模态框 点击确认
    addPageNameFn() {
      this.currentBg = null;
      this.sitePage = this.pageName;
      this.deviceDataArr = [];
      this.sitePageArr.push({ label: this.pageName, value: this.pageName });
      this.dialogFormVisible = false;
      this.pageName = "";
    },
    handlePageChange(val) {
      //页面切换获取设备信息
      if (!val) return; //添加按钮值是空
      this.deviceDataArr = [];
      let currentItem = this.sitePageArr.find((item) => item.value === val);
      this.currentBg =
        currentItem.haveBg === true
          ? `${process.env.VUE_APP_BASE_URL}/${currentItem.value}`
          : "";
      this.sitePageW = currentItem.w;
      this.sitePageH = currentItem.h;
      this.getDeviceInfoByStationNo(val);
    },
    getDeviceInfoByStationNo(bgDevImg) {
      //根据站点及底图获取设备信息
      getDeviceInfoByStationNo({ stationNo: this.station, bgDevImg }).then((res) => {
        const { code, data } = res;
        if (code == "200") {
          //等待图片加载完成猜能加设备问题未解决
          //移动等直接更新设备信息未解决
          //图片重复了名称不能重复
          this.deviceDataArr = data.map((list, index) => {
            let { devVarFields, deviceVector, devNo, devType: id, value } = list;

            deviceVector = JSON.parse(deviceVector);
            try {
              devVarFields = JSON.parse(devVarFields);
            } catch {
              devVarFields = null;
            }
            let param = {
              name: list.devName,
              id,
              businessId: devNo,
              isActivated: false,
              key: new Date().getTime() + "" + index,
              devVarFields,
              ...deviceVector,
            };

            if (id === 0) {
            } else if (id === 19) {
            } else {
              Object.assign(param, {
                img1: Images[id],
              });
            }
            return param;
          });
        }
      });
    },

    handleBg() {
      if (!this.sitePage) {
        this.$message({
          type: "warning",
          message: "请选择页面后载入背景图！",
        });
        return;
      }
      this.$refs.bgUpload.actived();
    },
    delBg() {
      this.currentBg = null;
      let currentItem = this.sitePageArr.find((item) => item.value === this.sitePage);
      currentItem.value = currentItem.label;
      currentItem.haveBg = false;
      this.sitePage = currentItem.label;
    },
    handleUpload(blob, fileUrl) {
      let form = new FormData();
      form.append("binaryFile", blob);
      form.append("type", 1);

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (theFile) => {
        var image = new Image();
        image.src = theFile.target.result;
        let self = this;
        image.onload = function () {
          console.log("图片的宽度为" + this.width + ",长度为" + this.height);
          uploadBinaryFile(form).then(({ data }) => {
            self.currentBg = fileUrl;
            let currentItem = self.sitePageArr.find(
              (item) => item.value === self.sitePage
            );
            currentItem.value = data;
            currentItem.haveBg = true;
            currentItem.w = self.sitePageW = this.width;
            currentItem.h = self.sitePageH = this.height;
            self.sitePage = data;
            self.updateStationInfo();
            self.batchUpdateDeviceInfo();
          });
        };
      };
    },

    // 放大缩小设备
    onResize: function ({ left, top, width, height }, item) {
      item.x = left;
      item.y = top;
      item.w = width;
      item.h = height;
    },
    // 拖动设备
    onDrag: function ({ left, top }, item) {
      item.x = left;
      item.y = top;
    },
    // 选中当前设备
    onActivated(item) {
      // console.log(this.deviceDataArr, '==========this.deviceDataArr');
      // console.log(this.$refs.resizable[0].$el.classList, '=============e');

      item.isActivated = true;
      return;
      console.log("Zz" + index);
      let domes = this.$refs.resizable;
      for (let i = 0; i < domes.length; i++) {
        if (i == index) {
          this.$nextTick(() => {
            document.onkeydown = (e) => {
              // 这是delete健
              if (e.keyCode == 46) {
                // 删除选中设备或文本
                // console.log(this.deviceDataArr, '========6666');
                this.deviceDataArr.forEach((item, itemindex) => {
                  if (index == itemindex) {
                    this.deviceDataArr.splice(index, 1, { id: 98 });
                  }
                });
              }
            };
          });
        }
      }
      console.log(this.deviceDataArr, "==============this.deviceDataArr");
    },
    handleOver(item) {
      const { businessId } = item;
      if (businessId) {
        this.currentDevice = item;
        const { id } = item;
        this.deviceForm[`r${id}`].forEach((key, index) => {
          this.deviceInfo[key] = item[key];
        });
        this.updateDeviceInfo(businessId);
      }
    },
    // 取消选中当前设备
    onDeactivated(item) {
      item.isActivated = false;
      // console.log(this.$refs.resizable[0].$el.classList.length, '=============99999999999');
    },

    //拖拽体旋转
    rotate(deg, item) {
      item.deg = deg;
    },
    updateStationInfo() {
      //保存页面，更新站点信息
      let param = this.stationArr.find((item) => item.stationNo === this.station);
      if (!this.station || !param) return;
      const sitePageArr = this.sitePageArr.filter((item) => item.haveBg);
      const bgDevImgPath = sitePageArr.map((item) => {
        return item.value;
      });
      const remarks3 = sitePageArr.map((item) => {
        return {
          label: item.label,
          value: item.value,
          w: item.w,
          h: item.h,
        };
      });
      Object.assign(param, {
        bgDevImgPath: JSON.stringify(bgDevImgPath),
        remarks3: JSON.stringify(remarks3),
      });
      updateStationInfo(param).then((data) => {
        const { code } = data;
        if (code == "200") {
        } else {
          this.$message({
            message: "上传失败，请稍后再试！",
            type: "error",
          });
        }
      });
    },
    delPage() {
      //删除页面，更新站点信息
      this.$confirm("此操作将永久删除该页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.doDelPage();
        })
        .catch(() => {});
    },
    async doDelPage() {
      let currentItem = this.sitePageArr.find((item) => item.value === this.sitePage);
      const { haveBg } = currentItem;
      if (haveBg) {
        await this.deleteBgDevImg();
      }
      this.sitePageArr = this.sitePageArr.filter((item) => item.value != this.sitePage);
      this.sitePage = "";
      this.currentBg = null;
      this.deviceDataArr = [];
    },
    handleDeviceInfo(item, type = true) {
      console.log(item);
      this.currentDevice = item;
      const { id } = item;
      this.deviceForm[`r${id}`].forEach((key, index) => {
        this.deviceInfo[key] = key === "fieldVisible" ? Boolean(item[key]) : item[key];
      });
      this.dialogVisible = type;
    },
    permission(type) {
      const { id } = this.currentDevice;
      if (id != 0 && !id) return false;
      return this.deviceForm[`r${id}`].includes(type);
    },
    submitDeviceInfo() {
      if (!this.sitePage) {
        this.$message({
          type: "warning",
          message: "请选页面后更新设备信息",
        });
        return;
      }
      const { businessId } = this.currentDevice;
      if (businessId) {
        this.isBtnClick = true;
        this.updateDeviceInfo(businessId);
      } else {
        this.saveDeviceInfo();
      }
    },
    clearFormData() {
      //提交成功后清除device form中的数据
      for (let key in this.deviceInfo) {
        this.deviceInfo[key] = "";
      }
    },
    updateDeviceInfo(devNo) {
      //更新设备信息
      $debouce(() => {
        const currentDevice = this.currentDevice;
        const { id } = currentDevice;
        let devVarFields = [];
        const deviceForm = this.deviceForm[`r${id}`];
        const customField = deviceForm.slice(-this.deviceForm[`custom${id}`]);
        customField.forEach((key) => {
          const val = this.deviceInfo[key];
          devVarFields.push(val ? val : "");
        });
        if (deviceForm.includes("deviceName") && !this.deviceInfo.deviceName) {
          this.$message({
            type: "warning",
            message: "请输入设备工艺名",
          });
          return;
        }
        let deviceVector = {};
        deviceForm.forEach((key) => {
          deviceVector[key] = this.deviceInfo[key];
        });
        console.log(currentDevice.name);
        const param = {
          devNo,
          stationNo: this.station,
          devName: currentDevice.name,
          devType: id,
          devVarFields: JSON.stringify(devVarFields),
          deviceVector: JSON.stringify(
            Object.assign(deviceVector, {
              bgDevImg: this.sitePage,
              x: currentDevice.x,
              y: currentDevice.y,
              w: currentDevice.w,
              h: currentDevice.h,
              deg: currentDevice.deg,
            })
          ),
        };
        updateDeviceInfo(param).then((data) => {
          const { code } = data;
          if (code == "200") {
            if (this.isBtnClick) {
              this.dialogVisible = false;
              this.isBtnClick = false;
            }
            if (id === 0 || id === 19) {
              currentDevice.color = this.deviceInfo.color;
              currentDevice.fontSize = this.deviceInfo.fontSize;
              id === 0 && (currentDevice.title = this.deviceInfo.title);
              id === 19 && (currentDevice.showLabel = this.deviceInfo.showLabel);
            }
            currentDevice.devVarFields = devVarFields;
            Object.assign(currentDevice, deviceVector);
          } else {
            this.$message({
              message: "更新失败，请稍后再试！",
              type: "error",
            });
          }
        });
      });
    },
    batchUpdateDeviceInfo() {
      //更新设备信息
      console.log(this.deviceDataArr);
      const deviceList = this.deviceDataArr
        .map((currentDevice) => {
          const { businessId: devNo } = currentDevice;
          let devVarFields = [];
          const deviceForm = this.deviceForm[`r${currentDevice.id}`];
          const customField = deviceForm.slice(
            -this.deviceForm[`custom${currentDevice.id}`]
          );
          customField.forEach((key) => {
            const val = currentDevice[key];
            devVarFields.push(val ? val : "");
          });
          console.log(currentDevice);
          if (deviceForm.includes("deviceName") && !currentDevice.deviceName) {
            // this.$message({
            //   type: "warning",
            //   message: "请输入设备工艺名",
            // });
            return {};
          }
          let deviceVector = {};
          deviceForm.forEach((key) => {
            deviceVector[key] = currentDevice[key];
          });

          const param = {
            devNo,
            stationNo: this.station,
            devName: currentDevice.name,
            devType: currentDevice.id,
            devVarFields: JSON.stringify(devVarFields),
            deviceVector: JSON.stringify(
              Object.assign(deviceVector, {
                bgDevImg: this.sitePage,
                x: currentDevice.x,
                y: currentDevice.y,
                w: currentDevice.w,
                h: currentDevice.h,
                deg: currentDevice.deg,
              })
            ),
          };
          return param;
        })
        .filter((item) => item.devNo);
      console.log(deviceList);

      deviceList.length > 0 &&
        batchUpdateDeviceInfo(JSON.stringify(deviceList)).then((data) => {
          const { code } = data;
          if (code == "200") {
          } else {
            this.$message({
              message: "更新失败，请稍后再试！",
              type: "error",
            });
          }
        });
    },
    saveDeviceInfo() {
      //保存设备信息
      const currentDevice = this.currentDevice;
      let devVarFields = [];
      const deviceForm = this.deviceForm[`r${currentDevice.id}`];
      const customField = deviceForm.slice(-this.deviceForm[`custom${currentDevice.id}`]);
      customField.forEach((key) => {
        const val = this.deviceInfo[key];
        devVarFields.push(val ? val : "");
      });
      if (deviceForm.includes("deviceName") && !this.deviceInfo.deviceName) {
        this.$message({
          type: "warning",
          message: "请输入设备工艺名",
        });
        return;
      }
      console.log(currentDevice);
      let deviceVector = {};
      deviceForm.forEach((key) => {
        deviceVector[key] = this.deviceInfo[key];
      });
      const param = {
        stationNo: this.station,
        devName: currentDevice.name,
        devType: currentDevice.id,
        devVarFields: JSON.stringify(devVarFields),
        deviceVector: JSON.stringify(
          Object.assign(deviceVector, {
            bgDevImg: this.sitePage,
            x: currentDevice.x,
            y: currentDevice.y,
            w: currentDevice.w,
            h: currentDevice.h,
            deg: currentDevice.deg,
          })
        ),
      };
      saveDeviceInfo(param).then((data) => {
        const { code } = data;
        if (code == "200") {
          this.getDeviceInfoByStationNo(this.sitePage);
          this.dialogVisible = false;
        } else {
          this.$message({
            message: "保存失败，请稍后再试！",
            type: "error",
          });
        }
      });
    },
  },

  watch: {
    // deviceDataArr(newVal, oldVal) {
    //   console.log(newVal, '======================newVal');
    //   newVal.forEach((item, index) => {
    //     if(item.img == '') {
    //       newVal.splice(index, 1)
    //     }
    //   })
    //   console.log(newVal, '======================newVal1111111111111111111111111');
    // }
  },
};
</script>

<style lang="scss" scoped>
@import "./addMachine.scss";
</style>
