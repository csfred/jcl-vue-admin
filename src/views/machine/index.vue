<template>
  <div class="deviceDisplay">
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
      </el-select>
      <el-button type="primary" v-if="sitePage" @click="scale += 0.2">放大</el-button>
      <el-button type="primary" v-if="sitePage" @click="scale -= 0.2">缩小</el-button>
      <el-button type="primary" v-if="sitePage" @click="scale = 1">恢复原样</el-button>
      <el-button type="primary" @click="full = true">全屏展示</el-button>
    </div>
    <div class="resizable-box" :class="{ fullBox: full }">
      <div class="stationState">
        <p>最新接收：{{ lastUpdateTime ? lastUpdateTime : "无数据" }}</p>
        <p>
          数据状态：<span :class="{ error: !dataAcceptState }">{{
            dataAcceptState === null ? "无数据" : dataAcceptState ? "正常" : "通信中断"
          }}</span>
        </p>
      </div>
      <el-button type="primary" class="exitBtn" v-if="full" @click="full = false"
        >退出全屏</el-button
      >
      <div class="dragBox" :style="{ transform: `scale(${scale})` }">
        <template v-for="item in deviceDataArr">
          <!-- 设备 -->
          <vue-drag-resize-rotate
            :key="item.key"
            :parent-limitation="true"
            :preventActiveBehavior="true"
            :w="item.w"
            :h="item.h"
            :x="item.x"
            :y="item.y"
            :deg="item.deg"
          >
            <!-- 标题 -->
            <input
              v-if="item.id === 0"
              type="text"
              readonly
              :value="item.title"
              @dblclick.stop.prevent="handleDeviceInfo(item)"
              :style="{ color: item.color, fontSize: item.fontSize + 'px' }"
              placeholder=""
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
              <span class="value">{{
                item.value && item.value != "null" ? item.value + "" : "显示屏无数据"
              }}</span>
            </div>
            <!-- 指示灯 -->
            <div
              class="circle"
              :style="{
                backgroundColor:
                  item.value == 0 || item.value == null
                    ? item.zeroColor
                    : item.notZeroColor,
              }"
              v-else-if="item.id === 20"
              @dblclick.stop.prevent="handleDeviceInfo(item)"
            ></div>
            <!-- 流动管道 -->
            <div
              class="linePlayBox"
              :class="{ linePlay: item.value < 0 || item.value > 0 }"
              v-else-if="item.id === 21"
              :style="{
                'animation-name': `${
                  item.value < 0
                    ? 'linePlayAni2'
                    : item.value > 0
                    ? 'linePlayAni'
                    : 'none'
                }`,
                'animation-duration': `${
                  item.value == 0 ? 0 : 5 / Math.abs(Number(item.value))
                }s`,
                'background-image':
                  item.value < 0 || item.value > 0
                    ? `linear-gradient(45deg,${item.lineColor} 25%,transparent 25%,transparent 50%,${item.lineColor} 50%,${item.lineColor} 75%,transparent 75%,transparent  )`
                    : 'none',
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
            <!-- <div
              v-if="item.id !== 0 && item.id !== 19"
              class="FieldItem"
              :style="{
                transform: `rotate(-${item.deg}deg)`,
              }"
            >
              <span class="label">设备号</span>
              <span class="value">{{ item.businessId }}</span>
            </div> -->
            <template
              v-if="
                !item.fieldVisible &&
                item.varListFields &&
                item.id !== 0 &&
                item.id !== 19 &&
                item.id !== 20 &&
                item.id !== 21 &&
                item.id !== 1 &&
                item.id != 4 &&
                item.id != 5 &&
                item.id != 6 &&
                item.id != 7 &&
                item.id != 8 &&
                item.id != 9
              "
            >
              <div
                class="FieldItem"
                :style="{
                  transform: `rotate(-${item.deg}deg)`,
                  marginTop: `${iIndex * 25}px`,
                  fontSize: item.fontSize + 'px',
                }"
                v-for="(val, k, iIndex) in item.varListFields"
                :key="k"
              >
                <span class="label">{{ k }}</span>
                <span
                  class="value"
                  :class="{ danger: item[`${k}Danger`] }"
                  :style="{
                    color: item.color,
                  }"
                  >{{ val != "null" ? val : "无数据" }}</span
                >
              </div>
            </template>
          </vue-drag-resize-rotate>
        </template>
        <!-- 当前页面底图 -->
        <img :src="currentBg" v-if="currentBg" alt="" />
      </div>
    </div>
    <!-- 添加设备要素模态框 -->
    <el-dialog
      class="deviceInfo"
      :title="`设备信息(设备号${currentDevice.businessId})`"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="deviceInfo" label-width="110px">
        <el-form-item class="must" label="设备工艺名称" v-if="permission('deviceName')">
          <el-input readonly v-model="deviceInfo.deviceName"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" v-if="permission('showLabel')">
          <el-input readonly v-model="deviceInfo.showLabel"></el-input>
        </el-form-item>
        <el-form-item label="设备位号" v-if="permission('bitNum')">
          <el-input readonly v-model="deviceInfo.bitNum"></el-input>
        </el-form-item>
        <el-form-item label="设备功率" v-if="permission('power')">
          <el-input readonly v-model="deviceInfo.power"></el-input>
        </el-form-item>
        <el-form-item label="阀门类型" v-if="permission('type')">
          <el-input readonly v-model="deviceInfo.type"></el-input>
        </el-form-item>
        <el-form-item label="额定气压" v-if="permission('ratedPressure')">
          <el-input readonly v-model="deviceInfo.ratedPressure"></el-input>
        </el-form-item>
        <el-form-item label="阀门输出扭矩" v-if="permission('torque')">
          <el-input readonly v-model="deviceInfo.torque"></el-input>
        </el-form-item>
        <el-form-item label="开关阀时间" v-if="permission('time')">
          <el-input readonly v-model="deviceInfo.time"></el-input>
        </el-form-item>

        <el-form-item label="显示值" v-if="permission('showValue')">
          <el-input readonly v-model="deviceInfo.showValue"></el-input>
        </el-form-item>
        <el-form-item label="上限报警值" v-if="permission('HIAL')">
          <el-input readonly v-model="deviceInfo.HIAL"></el-input>
        </el-form-item>
        <el-form-item label="下限报警值" v-if="permission('LIAL')">
          <el-input readonly v-model="deviceInfo.LIAL"></el-input>
        </el-form-item>
        <el-form-item label="仪表量程" v-if="permission('instrumentRange')">
          <el-input readonly v-model="deviceInfo.instrumentRange"></el-input>
        </el-form-item>

        <el-form-item label="电动机额定转速" v-if="permission('RSOM')">
          <el-input readonly v-model="deviceInfo.RSOM"></el-input>
        </el-form-item>

        <el-form-item label="输出轴转速" v-if="permission('OSS')">
          <el-input readonly v-model="deviceInfo.OSS"></el-input>
        </el-form-item>
        <el-form-item label="搅拌叶片数量" v-if="permission('VaneQuantity')">
          <el-input readonly v-model="deviceInfo.VaneQuantity"></el-input>
        </el-form-item>
        <el-form-item label="搅拌叶片直径" v-if="permission('DOAB')">
          <el-input readonly v-model="deviceInfo.DOAB"></el-input>
        </el-form-item>
        <el-form-item label="筛网提升速度" v-if="permission('SLS')">
          <el-input readonly v-model="deviceInfo.SLS"></el-input>
        </el-form-item>
        <el-form-item label="栅格有效宽度" v-if="permission('EWG')">
          <el-input readonly v-model="deviceInfo.EWG"></el-input>
        </el-form-item>
        <el-form-item label="额定风量" v-if="permission('RAF')">
          <el-input readonly v-model="deviceInfo.RAF"></el-input>
        </el-form-item>
        <el-form-item label="额定压力" v-if="permission('MPA')">
          <el-input readonly v-model="deviceInfo.MPA"></el-input>
        </el-form-item>
        <el-form-item label="额定流量" v-if="permission('ratedFlow')">
          <el-input readonly v-model="deviceInfo.ratedFlow"></el-input>
        </el-form-item>
        <el-form-item label="额定杨程" v-if="permission('RatedHm')">
          <el-input readonly v-model="deviceInfo.RatedHm"></el-input>
        </el-form-item>

        <el-form-item label="设备品牌" v-if="permission('brand')">
          <el-input readonly v-model="deviceInfo.brand"></el-input>
        </el-form-item>
        <el-form-item label="信号类型" v-if="permission('SignalTypes')">
          <el-input readonly v-model="deviceInfo.SignalTypes"></el-input>
        </el-form-item>
        <el-form-item label="阀门口径" v-if="permission('caliber')">
          <el-input readonly v-model="deviceInfo.caliber"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" v-if="permission('model')">
          <el-input readonly v-model="deviceInfo.model"></el-input>
        </el-form-item>
        <el-form-item label="备注1" v-if="permission('remark1')">
          <el-input readonly v-model="deviceInfo.remark1"></el-input>
        </el-form-item>
        <el-form-item label="备注2" v-if="permission('remark2')">
          <el-input readonly v-model="deviceInfo.remark2"></el-input>
        </el-form-item>
        <el-form-item label="备注3" v-if="permission('remark3')">
          <el-input readonly v-model="deviceInfo.remark3"></el-input>
        </el-form-item>
        <div class="bottom" :class="{ noImg: currentDevice.id === 0 }">
          <el-form-item label="标题名称" v-if="permission('title')">
            <el-input readonly v-model="deviceInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="字体颜色" v-if="permission('color')">
            <el-input readonly v-model="deviceInfo.color"></el-input>
          </el-form-item>
          <el-form-item label="字体大小" v-if="permission('fontSize')">
            <el-input v-model="deviceInfo.fontSize"></el-input>
          </el-form-item>
          <el-form-item label="值0指示灯颜色" v-if="permission('zeroColor')">
            <el-input readonly v-model="deviceInfo.zeroColor"></el-input>
          </el-form-item>
          <el-form-item label="非0指示灯颜色" v-if="permission('notZeroColor')">
            <el-input readonly v-model="deviceInfo.notZeroColor"></el-input>
          </el-form-item>
          <el-form-item label="流水背景色" v-if="permission('lineColor')">
            <el-input readonly v-model="deviceInfo.lineColor"></el-input>
          </el-form-item>
          <el-form-item label="流动速度" v-if="permission('playSpeed')">
            <el-input
              readonly
              :value="deviceInfo.playSpeed"
              label="0-100,数值越大流动越快"
            ></el-input>
          </el-form-item>
          <el-form-item label="关联变量" v-if="permission('relatedName')">
            <el-input
              readonly
              type="relatedName"
              v-model="deviceInfo.relatedName"
            ></el-input>
          </el-form-item>
          <el-form-item label="阀门开度反馈" v-if="permission('MVRB')">
            <el-input readonly v-model="deviceInfo.MVRB"></el-input>
          </el-form-item>
          <el-form-item label="阀门开度控制" v-if="permission('MVC')">
            <el-input readonly v-model="deviceInfo.MVC"></el-input>
          </el-form-item>
          <el-form-item label="程控位置" v-if="permission('SPCLocation')">
            <el-input readonly v-model="deviceInfo.SPCLocation"></el-input>
          </el-form-item>
          <el-form-item label="运行信号" v-if="permission('signal')">
            <el-input readonly v-model="deviceInfo.signal"></el-input>
          </el-form-item>
          <el-form-item label="开到位信号" v-if="permission('signalOpen')">
            <el-input readonly v-model="deviceInfo.signalOpen"></el-input>
          </el-form-item>
          <el-form-item label="关到位信号" v-if="permission('signalClose')">
            <el-input readonly v-model="deviceInfo.signalClose"></el-input>
          </el-form-item>
          <el-form-item label="故障信号" v-if="permission('troubleSignal')">
            <el-input readonly v-model="deviceInfo.troubleSignal"></el-input>
          </el-form-item>
          <el-form-item label="备用预警" v-if="permission('StandbyAlert')">
            <el-input readonly v-model="deviceInfo.StandbyAlert"></el-input>
          </el-form-item>
          <el-form-item label="仪表显示" v-if="permission('MeterValue')">
            <el-input readonly v-model="deviceInfo.MeterValue"></el-input>
          </el-form-item>
          <el-form-item label="瞬时流量显示" v-if="permission('ISD')">
            <el-input readonly v-model="deviceInfo.ISD"></el-input>
          </el-form-item>
          <el-form-item label="累计流量显示" v-if="permission('CFD')">
            <el-input readonly v-model="deviceInfo.CFD"></el-input>
          </el-form-item>
          <el-form-item label="隐藏变量值" v-if="permission('fieldVisible')">
            <el-checkbox :value="deviceInfo.fieldVisible"></el-checkbox>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllStationInfo,
  getDeviceInfoByStationNo,
  getDeviceLiveData,
  checkStationIsOnline,
} from "../../api/indexs";
import { Images, imgGif } from "../../utils/images";
import bgUpload from "@/components/bgUpload/bgUpload.vue";
import $debouce from "@/utils/debounce";
export default {
  data() {
    return {
      full: false,
      lastUpdateTime: "",
      dataAcceptState: null,
      scale: 1,
      deviceDataArr: [], //添加设备数组
      currentDevice: {},
      // 站点
      stationArr: [],
      station: "",
      // 当前站点页面
      sitePageArr: [],
      sitePage: "",
      sitePageW: "",
      sitePageH: "",
      currentBg: null, // 载入当前背景图
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
        fieldVisible: "", //隐藏关联变量

        zeroColor: "",
        notZeroColor: "",
        // playSpeed: "", //管道线条移动速度
        lineColor: "", //管道线条颜色
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
      dialogVisible: false,
      timer: null,
      timer2: null,
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
  },
  methods: {
    async init() {
      await this.getAllStationInfo();
      const firstC = this.stationArr[0];
      if (firstC) {
        this.station = firstC.value;
        this.selectStation(firstC.value);
      }
    },
    getAllStationInfo() {
      return new Promise((resolve) => {
        getAllStationInfo({ page: 1, pageSize: 100, stationName: "" }).then((data) => {
          if (data.code == "200") {
            this.station = "";
            this.stationArr = data.data.dataList.map((item) => {
              return {
                ...item,
                value: item.stationNo,
                label: item.stationName,
              };
            });
            resolve();
          }
        });
      });
    },
    selectStation(val) {
      //选择站点，更新底图页面
      const currentItem = this.stationArr.find((item) => item.value === val);
      this.sitePageArr = [];
      this.deviceDataArr = [];
      this.sitePage = "";
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
      clearInterval(this.timer2);
      this.intervalCheckStationIsOnline(val);
      const firstPage = this.sitePageArr[0];
      if (firstPage) {
        this.sitePage = firstPage.value;
        this.handlePageChange(firstPage.value);
      }
    },
    intervalCheckStationIsOnline(val) {
      //定时查询站点是否正常
      this.checkStationIsOnline(val);
      this.timer2 = setInterval(() => {
        this.checkStationIsOnline(val);
      }, 10000);
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "/";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        date.getFullYear() +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
      return currentdate;
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    formatT(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
    checkStationIsOnline(val) {
      //定时查询站点是否正常
      checkStationIsOnline({
        stationNo: val,
      }).then(({ code, data }) => {
        this.lastUpdateTim = "";
        this.dataAcceptState = null;
        if (code == "200" && data) {
          const { isOnLine, lastReceiveTime } = data;
          this.dataAcceptState = isOnLine;
          this.lastUpdateTime = this.formatT(lastReceiveTime);
        }
      });
    },
    handlePageChange(val) {
      //页面切换获取设备信息
      clearInterval(this.timer);
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
              value,
              id,
              businessId: devNo,
              isActivated: false,
              key: new Date().getTime() + "" + index,
              devVarFields,
              ...deviceVector,
            };
            if (id != 0 && id != 19) {
              Object.assign(param, {
                img1: Images[id],
              });
            }
            return param;
          });
          this.pollDeviceInfo();
          this.pollIntervalInfo();
        }
      });
    },
    pollIntervalInfo() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.pollDeviceInfo();
      }, 10000);
    },
    pollDeviceInfo() {
      this.deviceDataArr.forEach((item) => {
        item.id != 0 &&
          getDeviceLiveData({
            stationNo: this.station,
            // stationNo: "OG581LL0720072800318",
            deviceNo: item.businessId,
          }).then(({ code, data }) => {
            // item.id === 21 && (item.value=10);
            //     console.log(item.id === -21);
            if (code == "200" && typeof data === "object") {
              let { varListFields } = data;
              varListFields = JSON.parse(varListFields);
              item.varListFields = varListFields;
              if (item.id === 19 || item.id === 20 || item.id === 21) {
                item.value = varListFields[item.relatedName];
              }

              if (
                item.id === 1 ||
                item.id === 4 ||
                item.id === 5 ||
                item.id === 6 ||
                item.id === 7 ||
                item.id === 8 ||
                item.id === 9
              ) {
                const troubleSignal = item.troubleSignal;
                const signalClose = item.signalClose;
                const signalOpen = item.signalOpen;
                const signal = item.signal;
                if (varListFields[troubleSignal] == 1) {
                  item.img1 = imgGif[`img${item.id}`][2];
                } else if (varListFields[signalClose] == 1) {
                  item.img1 = imgGif[`img${item.id}`][0];
                } else if (varListFields[signalOpen] == 1) {
                  item.img1 = imgGif[`img${item.id}`][1];
                } else if (varListFields[signal] == 1) {
                  item.img1 = imgGif[`img${item.id}`][1];
                } else {
                  item.img1 = imgGif[`img${item.id}`][0];
                }
              }
              const { HIAL, LIAL } = item;
              if (LIAL) {
                for (let key in varListFields) {
                  const cVal = varListFields[key];
                  if (Number(cVal) < Number(LIAL)) {
                    item[`${key}Danger`] = true;
                  }
                }
              }
              if (HIAL) {
                for (let key in varListFields) {
                  const cVal = varListFields[key];
                  if (Number(cVal) > Number(HIAL)) {
                    item[`${key}Danger`] = true;
                  }
                }
              }
              item.businessId === 31 && console.log(item);
              this.$forceUpdate();
            }
          });
      });
    },
    handleDeviceInfo(item, type = true) {
      console.log(item);
      this.currentDevice = item;
      const { id, varListFields = {} } = item;
      this.deviceForm[`r${id}`].forEach((key, index) => {
        const currentVal = key === "fieldVisible" ? Boolean(item[key]) : item[key];
        this.deviceInfo[key] = currentVal ? currentVal : "";
        for (let fk in varListFields) {
          const val = varListFields[fk];
          fk === currentVal && (this.deviceInfo[key] = val != "null" ? val : "无数据");
        }
      });

      this.dialogVisible = type;
    },
    permission(type) {
      const { id } = this.currentDevice;
      if (id != 0 && !id) return false;
      return this.deviceForm[`r${id}`].includes(type);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./deviceDisplay.scss";
</style>
