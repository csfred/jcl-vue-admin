<template>
  <div>
    <div id="video-container"></div>
  </div>
</template>
<script>
import EZUIKit from "ezuikit-js";
import { postApiData, getAccessToken, getLiveAddress } from "../../api/api";
var vm;
export default {
  props: {
    deviceId: {
      type: String,
      default: "",
    },
    channelId: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      appSecret2: "58114a531014e343393a224b8ccbc4fc",
      appkey: "87a251311c16483b8855113b5195b639",
      accessToken: "",
	  liveUrl:"",
      isFirst: true, //第一次初始化
      switchPeopleStatus: false, // 智能检测开关302-人形过滤,304人脸抠图
      switchFaceStatus: false, // 智能检测开关302-人形过滤,304人脸抠图
      moveStatus: false, // 动检开关
      validateCode: "", //设备验证码
      param: {
        AppKey: "",
        AppSecret: "",
        deviceSerial: "",
        channelNo: "1",
        src: "",
        accessToken: "",
        no: null,
        timer: 0,
      },
      alarmSoundMode: 0, //告警声音模式：0-短叫，1-长叫，2-静音
      // 设备信息
      deviceInfo: {
        deviceSerial: "", //设备序列号
        deviceName: "", //设备名称
        model: "", //设备型号，如CS-C2S-21WPFR-WX
        status: 0, //设备是否在线0不在线，1在线
        defence: 0, //布撤防状态：0-睡眠，8-在家，16-外出，普通IPC布撤防状态：0-撤防，1-布防
        isEncrypt: 0, //是否加密：0-不加密，1-加密
        alarmSoundMode: 0, //告警声音模式：0-短叫，1-长叫，2-静音
        offlineNotify: 0, //设备下线是否通知：0-不通知 1-通知
        category: "", //设备大类
      },
    };
  },
  mounted() {
    // vm = this;
    // this.param.src =
    //   "ezopen://open.ys7.com/" +
    //   this.param.deviceSerial +
    //   "/" +
    //   this.param.channelNo +
    //   ".live";
    // //this.getToken()
    // this.init();
	this.getToken();
  },
  watch: {
    deviceId: {
      handler(val) {
        console.log(val);
        this.getToken();
      },
    },
  },
  methods: {
    // getToken(){
    // 	let token = JSON.parse(localStorage.getItem("ysToken"))
    // 	console.log('token:');
    // 	console.log(token);
    // 	// console.log('expireTime:' + token.expireTime);
    // 	let expireTime = token && token.expireTime || 0
    // 	console.log('nowTime:' + new Date().getTime());
    // 	console.log('expireTime:' + expireTime);
    // 	if(!token || expireTime < new Date().getTime()){
    // 		// token = await YS7.getToken(this.AppKey, this.AppSecret)
    // 		let data = {
    // 			appKey: vm.param.AppKey,
    // 			appSecret: vm.param.AppSecret
    // 		}
    // 		postApiData('lapp/token/get', data).then(res => {
    // 			localStorage.setItem('ysToken', JSON.stringify(res.data.data))
    // 			vm.param.accessToken = res.data.data.accessToken
    // 			vm.getDeviceInfo()
    // 		});
    // 	}else {
    // 		vm.param.accessToken = token.accessToken
    // 		vm.getDeviceInfo()
    // 	}
    // },
    getToken() {
      // this.setSystem()
      let params = {};
      this.param.params = params;
      // getOpenapiData('accessToken', JSON.stringify(this.param)).then(res => {
      // 	this.AuthToken = res.data.result.data
      // 	localStorage.setItem('AuthToken', JSON.stringify(res.data.result.data))
      // 	this.getKitToken()
      // });
      getAccessToken({
        appSecret: this.appSecret2,
        appKey: this.appkey,
      }).then(({ data }) => {
        console.log(data);
        if (data.code == "200") {
          this.accessToken = data.data.accessToken;
          this.getLiveAddress();
        }
      });
    },
    getLiveAddress() {
      if (!this.accessToken) return;
      getLiveAddress({
        accessToken: this.accessToken,
        deviceSerial: this.deviceId,
        channelNo: this.channelId,
      }).then(({ data }) => {
		  if (data.code == "200") {
          this.liveUrl = data.data.url;
          this.init();
        }
	  });
    },
    init() {
      var player = new EZUIKit.EZUIKitPlayer({
        url: this.liveUrl,
        id: "video-container",
        accessToken: this.accessToken,
        template: "simple", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
        // 视频上方头部控件
        header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
        plugin: ["talk"], // 加载插件，talk-对讲
        // 视频下方底部控件
        footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
        // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
        // openSoundCallBack: data => console.log("开启声音回调", data),
        // closeSoundCallBack: data => console.log("关闭声音回调", data),
        startSaveCallBack: (data) => console.log("开始录像回调", data),
        stopSaveCallBack: (data) => console.log("录像回调", data),
        capturePictureCallBack: (data) => console.log("截图成功回调", data),
        fullScreenCallBack: (data) => console.log("全屏回调", data),
        // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
        width: 1400,
        height: 600,
      });
	  player.play();
    },
  },
};
</script>

<style scoped lang="scss"></style>
