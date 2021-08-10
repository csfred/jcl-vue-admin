import ajax from './ajax'

//const preurl = process.env.ENV === 'development'  ? 'http://8.140.106.126:8082/iot-server/base' : "";

//const preurl = 'http://localhost:8082/iot-server/base';
const preurl = 'http://8.140.106.126:8082/iot-server/base';

// 封装各种接口请求
// export const 接口名 = (参数对象) => ajax.get('/路由',参数对象);

export const saveStationInfo = (data) => ajax.post(preurl+'/saveStationInfo', data);

// 获取所有站点
export const getAllStationInfo = (data) => ajax.get('/getPageAllStationInfo', data);



//测试保存摄像机信息
export const testPost = (data) => ajax.post(preurl+'/saveMonitorInfo', 'application/json;charset=utf-8',  data);


//测试POST
//export const testPost = (data) => ajax.post(preurl+'/testPost/', 'application/json;charset=utf-8',  data);


// 获取所有站点
export const getDeviceInfoByStationNo = (data) => ajax.get('/getDeviceInfoByStationNo', data);

// 编辑站点
export const updateStationInfo = (data) => ajax.post(preurl+'/updateStationInfo', data);

// 删除站点
export const deleteStationInfo = (data) => ajax.get('/deleteStationInfo', data);



// 获取所有设备类别
export const getAllDeviceType = () => ajax.get('/getAllDeviceType', {});

// 保存设备信息
export const saveDeviceInfo = (data) => ajax.post('/saveDeviceInfo', data);

// 更新设备信息
export const updateDeviceInfo = (data) => ajax.post('/updateDeviceInfo', data);

// 批量更新设备信息
export const batchUpdateDeviceInfo = (data) => ajax.post('/batchUpdateDeviceInfo', data);

// 获取设备信息
export const getDeviceLiveData = (data) => ajax.get('/getDeviceLiveData', data);

// 检查站点运行状态
export const checkStationIsOnline = (data) => ajax.get('/checkStationIsOnline', data);

// 删除底图/设备信息
export const deleteBgDevImg = (data) => ajax.get('/deleteBgDevImg', data);

// 图片上传
export const uploadBinaryFile = (data) => ajax.uploadBinaryFile('/uploadBinaryFile', data);

// 获取监控配置信息
export const monitoringConfInfo = (data) => ajax.post('/monitoringConfInfo', data)

// 获取站点加监控设备tree
export const monitoringViewTree = (data) => ajax.post('/monitoringViewTree', data)

// 获取摄像头设备列表
export const getAllMonitorInfo = (data) => ajax.get('/getAllMonitorInfo', data)
// 删除摄像头设备
export const deleteMonitorInfo = (data) => ajax.get('/deleteMonitorInfo', data)
// export const 接口名 = (参数对象) => ajax.get('/路由',参数对象);
export const saveMonitorInfo = (data) => ajax.post(preurl+'/saveMonitorInfo',  data)
// 编辑摄像头设备
export const updateMonitorInfo = (data) => ajax.post(preurl+'/updateMonitorInfo',  data)
