import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'
// 配置基地址
const request = axios.create({
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
// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = store.state.user
    if (user) {
      // 注意：后端要求 Bearer 后面有个空格，多了少了都不行
      // Authorization 也是后端要求的名字，不能乱写
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default request
