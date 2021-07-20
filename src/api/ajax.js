// 导入axios
import axios from 'axios';

// 进行一些全局配置
// 公共路由(网络请求地址)
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL+"/base";
// 请求响应超时时间
axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求响应超时时间
axios.defaults.timeout = 5000;

// 封装自己的get/post方法
export default {
  get: function(path = '', data = {}) {
    return new Promise(function(resolve, reject) {
      axios.get(path, {
        params: data
      }).then(function(response) {
          // 按需求来，这里我需要的是response.data，所以返回response.data，一般直接返回response
          resolve(response.data);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  post: function (path = '', data = {}) {
    return new Promise(function (resolve, reject) {
      // console.log(data, '======================222')
      axios.post(path, data)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  uploadBinaryFile(path = '', formData = {}) {
    return new Promise(function (resolve, reject) {
      // console.log(formData, '======================222')
      axios.post(path, formData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
};
