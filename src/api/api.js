import axios from 'axios';
import qs from 'qs'
let base = 'https://openapi.lechange.cn:443/openapi';
let baseApi = 'https://open.ys7.com/api';

export const getOpenapiData = (url, params) => { return axios.post(`${base}/${url}`, params); };

export const postApiData = (url, params) => { return axios.post(`${baseApi}/${url}`, qs.stringify(params)); };


//萤石
export const getAccessToken = (data) => {
    return axios.post(`${baseApi}/lapp/token/get`,
        qs.stringify(data),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
};
export const getLiveAddress = (data) => {
    return axios.post(`${baseApi}/lapp/v2/live/address/get`,
        qs.stringify(data),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
};
