import Vue from 'vue'
// 专门处理时间的工具模块
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'// 按需加载
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')// 全局配置西班牙语

dayjs.extend(relativeTime)
// 扩展全局过滤器计算相对时间
Vue.filter('relativeTime', value => {
  // dayjs() 获取当前最新时间
  // dayjs(时间) 会把给定的时间自动转为自己的时间类型
  return dayjs().from(dayjs(value))
})
