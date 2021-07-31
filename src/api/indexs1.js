import api from './api'

// 获取token
export const getgetKitTokenData = (data) => api.post('/getKitToken', data)

// 获取token
export const getaccessTokenData = (data) => api.post('/accessToken', data)