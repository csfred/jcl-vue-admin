<template>
	<div id="app1" ref="lechengyun"></div>
</template>

<script>
	import {generateMixed} from "../../utils/common.js";
	import { getOpenapiData } from '../../api/api';
	export default {
		props:{
			deviceId: {
			type: String,
			default: ''
			},
			channelId: {
			type: String,
			default: ''
			},
			remarks1: {
			type: String,
			default: '1'
			},
			url: {
			type: String,
			default: ''
			}
    	},
		data() {
			return {
				appSecret: '571dca336de8453d96ca9b7df1a8c2',
				appId: 'lc23b430b6d1674eb0',
				src: '',
				param: {},
				AuthToken: {},
				loading: null,
				alarmStatus: false,
				closeCameraStatus: false, //隐私遮罩
				smartTrackStatus: false, //智能追踪
				player: null,
				kitToken:'',
			}
		},
		watch:{
		},
		methods: {
			getToken(){
					this.setSystem()
					let params = {}
					this.param.params = params
					getOpenapiData('accessToken', JSON.stringify(this.param)).then(res => {
						this.AuthToken = res.data.result.data
						localStorage.setItem('AuthToken', JSON.stringify(res.data.result.data))
						this.getKitToken()
					});
			},
			getKitToken() {
					this.setSystem()
					let params = {}
					this.setParams(params)
					params.type = '1'
					this.param.params = params
					getOpenapiData('getKitToken', JSON.stringify(this.param)).then(
						res => {
							if(res.data.result.code == '0'){
								this.kitToken = res.data.result.data.kitToken
								this.init()
							}else{
								this.$message.error(res.data.result.msg);
							}
						}
					);
			},
			init(){
				if (this.player) { this.player.destroy() }
				this.player = new ImouPlayer('#app1');
				const url = 'imou://open.lechange.com/'+this.deviceId+'/'+this.channelId+'/'+this.remarks1+'?streamId=1'
				const kitToken = this.kitToken
				const urlArr = [];
				url.split('%').forEach(function(item, index) {
				    const obj = {
				        url: item,
				        kitToken: kitToken.split('%')[index]
				    };
				    urlArr.push(obj)
				});
				const width = 500;
				const height = 700;
				const params = {
				    src: urlArr,
				    width: '100%',
				    height: height,
				    autoplay: true,
				    controls: true
				};
				console.log('player');
				this.player.setup(params);
			},
			setParams(params){
				let token = this.AuthToken.accessToken
				params.token = token
				params.channelId = this.channelId
				params.deviceId = this.deviceId
			},
			setSystem(){
				let nonce1 = generateMixed(32)
				let nonce = nonce1.substring(0,8)+"-"+nonce1.substring(8,12)+"-"+nonce1.substring(12,16)+"-"+nonce1.substring(16,20)+"-"+nonce1.substring(20,32);
				let time = parseInt(new Date().getTime()/1000);
				let sign = 'time:' + time + ',nonce:' + nonce + ',appSecret:' + this.appSecret
				let md5Sign = sign.MD5(32)
				let system = {
					"ver": "1.0", 
					"appId": this.appId,
					"sign": md5Sign,
					"time": time, 
					"nonce": nonce
				}
				let id = '0f935cb0-5ddc-44d4-9058-6b5fc928839e'
				this.param.system = system
				this.param.id = id
			}
		},
		mounted() {
			this.getToken()
			//this.init()
		}
	}

</script>
