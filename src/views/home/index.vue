<template>
  <div>
      <!-- 导航栏 -->
      <van-nav-bar title="首页"/>
      <!-- 频道列表 -->
      <van-tabs v-model="active">
            <van-tab
              :title="channel.name"
              v-for="channel in channels"
              :key="channel.id"
            >
              <!-- 下拉刷新 -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
              <!-- 文章列表 -->
            <van-list
              v-model="loading"
              :finished="channel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
export default {
  name: 'HomePage',
  data () {
    return {
      active: 0,
      loading: false,
      isLoading: false,
      // 频道列表
      channels: []
    }
  },
  created () {
    this.loadUserChannels()
  },
  methods: {
    async onLoad () {
      // 获取当前频道列表
      const activeChannel = this.channels[this.active]
      // 获取当前频道的文章列表
      const articles = activeChannel.articles
      // 请求获取数据
      const res = await getArticles({
        // 频道 id
        channel_id: activeChannel.id,
        // 获取下一页数据的时间戳，Date.now() 表示获取当前最新数据
        timestamp: activeChannel.timestamp || Date.now(),
        // 置顶数据，这里可写可不写
        with_top: 1
      })
      // ...数组，数组的展开操作符，它会把数组元素一个一个的拿出来，传递给使用的位置
      articles.push(...res.data.data.results)
      //  将 loading 设置为 false
      this.loading = false
      //  判断还有下一页数据，则更新获取下一个数据的时间戳
      const preTimestamp = res.data.data.pre_timestamp
      if (preTimestamp) {
        // 更新获取下一页数据的时间戳
        activeChannel.timestamp = preTimestamp
      } else {
        activeChannel.finished = true
      }
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
      }, 2000)
    },
    // 获取频道列表
    async loadUserChannels () {
      const res = await getUserChannels()
      const channels = res.data.data.channels
      // 遍历
      channels.forEach(channel => {
        // 频道的文章列表
        channel.articles = []
        // 频道的加载结束状态
        channel.finished = false
        // 获取频道下一页数据的时间戳
        channel.timestamp = null
        // 存储频道的下拉刷新 loading 状态
        channel.isPullDownLoading = false
      })
      this.channels = channels
    }
  }
}
</script>

<style>

</style>
