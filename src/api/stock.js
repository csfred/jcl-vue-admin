import request from '@/utils/request'

export function list(page, keywords) {
  var page = page || 1
  if (keywords) {
    return request({
      url: `/admin/stock/ajax`,
      method: 'get',
      params: { keywords }
    })
  } else {
    return request({
      url: `/admin/stock/ajax/${page}`,
      method: 'get'
    })
  }
}

export function stock_pull(code) {
  return request({
    url: `/admin/stock/deal/add`,
    method: 'get',
    params: { code }
  })
}

export function stock_del(code) {
  return request({
    url: `/admin/stock/del`,
    method: 'get',
    params: { code }
  })
}

export function stock_deal(code) {
  return request({
    url: `/admin/stock/deal`,
    method: 'get',
    params: { code }
  })
}

export function stock_deal_del(code) {
  return request({
    url: `/admin/stock/deal/del`,
    method: 'get',
    params: { code }
  })
}
