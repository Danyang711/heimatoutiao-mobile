import axios from 'axios'
import jsonBig from 'json-bigint'
// 配置基地址
export const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
// 处理后端返回数据超出 JS 安全整数范围问题
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    return {}
  }
}]
