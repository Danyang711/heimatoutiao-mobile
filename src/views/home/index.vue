<template>
  <div class="home">
      <!-- 导航栏 -->
      <van-nav-bar title="首页" fixed/>
      <!-- 频道列表 -->
      <van-tabs v-model="active">
            <!-- 面包按钮 -->
            <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
              <van-icon name="wap-nav" size="24" />
            </div>
            <van-tab
              :title="channel.name"
              v-for="channel in channels"
              :key="channel.id"
            >
              <!-- 下拉刷新 -->
            <van-pull-refresh
              v-model="channel.isPullDownLoading"
              @refresh="onRefresh"
            >
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
           <van-cell
              v-for="(article, index) in channel.articles"
              :key="index"
              :title="article.title"
              >
              <div slot="label">
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                    <van-image height="80" :src="img" lazy-load />
                  </van-grid-item>
                </van-grid>
                <div class="article-info">
                  <div class="meta">
                    <span>{{ article.aut_name }}</span>
                    <span>{{ article.comm_count }}评论</span>
                    <span>{{ article.pubdate | relativeTime  }}</span>
                  </div>
                  <van-icon name="close" />
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 弹窗 -->
      <van-popup
        v-model="isChannelShow"
        round
        position="bottom"
        :style="{ height: '95%' }"
        closeable
        close-icon-position="top-left"
        @open="onChannelOpen"
      >
        <div class="channel-container">
          <van-cell title="我的频道" :border="false">
            <van-button
            type="danger"
            size="mini"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button>
          </van-cell>
          <van-grid :gutter="10">
            <van-grid-item
              v-for="(channel,index) in channels"
              :key="channel.id"
              :text="channel.name"
              @click="onChannelActiveOrDelete(channel,index)"
            >
            <van-icon
              class="close-icon"
              slot="icon"
              name="close"
              size="20"
              v-show="isEdit && channel.name !== '推荐'"
              />
            </van-grid-item>
          </van-grid>

          <van-cell title="推荐频道" :border="false" />
          <van-grid :gutter="10">
            <van-grid-item
              v-for="channel in recommendChannels"
              :key="channel.id"
              :text="channel.name"
              @click="onChannelAdd(channel)"
            />
          </van-grid>
        </div>
      </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import { getArticles } from '@/api/article'
import { getAllChannels } from '@/api/channel'

export default {
  name: 'HomePage',
  data () {
    return {
      active: 0,
      loading: false,
      isLoading: false,
      // 频道列表
      channels: [],
      // 弹窗
      isChannelShow: false,
      // 所有频道列表
      allChannels: [],
      // 我的频道编辑
      isEdit: false
    }
  },
  // 计算属性
  computed: {
    recommendChannels () {
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
      //  判断是否包含当前遍历项
      // find方法：找到第一个满足条件的元素
        const ret = this.channels.find(item => {
          return item.id === channel.id
        })
        // 如果不包含，那就把它收集起来
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
    }
  },

  created () {
    // 加载用户频道
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
    async onRefresh () {
      // 获取当前频道列表
      const activeChannel = this.channels[this.active]
      // 请求获取最新推荐的文章列表
      const res = await getArticles({
        channel_id: activeChannel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 将数据添加到文章列表顶部
      const articles = res.data.data.results
      activeChannel.articles.unshift(...articles)
      //  关闭下拉刷新的 loading 状态
      activeChannel.isPullDownLoading = false
      this.$toast('刷新成功')
      // 提示用户刷新成功
      const message = articles.length
        ? `更新了${articles.length}条数据`
        : `暂无数据更新`
      this.$toast(message)
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
    },
    // 获取所有列表
    async onChannelOpen () {
      const res = await getAllChannels()
      this.allChannels = res.data.data.channels
    },
    // 添加频道
    onChannelAdd (channel) {
    // 将点击的频道项添加到我的频道列表中
      this.channels.push(channel)
    },

    // 删除
    onChannelActiveOrDelete (channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        // 编辑状态，执行删除操作
        this.channels.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道
        this.active = index
        this.isChannelShow = false
      }
    }
  }
}
</script>

<style lang="less" scoped >
.home {
  .article-info span {
    margin-right: 10px;
  }
  .van-tabs {
    // 频道列表
    /deep/ .van-tabs__wrap {
      position: fixed;
      top: 46px;
      z-index: 2;
      right: 0;
      left: 0;
    }
    // 频道内容
    /deep/ .van-tabs__content {
      margin-top: 90px;
    }
  }
  /deep/ .van-grid-item__icon-wrapper {
    position: absolute;
    top: -12px;
    right: -7px;
  }
}
.wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background-color: #fff;
  opacity: 0.8;
}
.channel-container{
  padding-top: 30px;
}
</style>
