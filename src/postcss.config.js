// 配置rem移动端适配
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
