<template>
  <div>
   <!-- 导航栏 -->
      <van-nav-bar
      :title="title"
      left-arrow
      @click-left="$router.back()"
      />
       <!-- 文章列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item.art_id.toString()"
        :title="item.title"
      />
    </van-list>
  </div>

</template>

<script>
import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      searchText: '', // 用户输入的搜索文本
      list: [],
      loading: false,
      finished: false,
      page: 1 // 页码
    }
  },
  computed: {
    title () {
      return `${this.$route.params.q}的搜索结果`
    }
  },
  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const res = await getSearch({
        page: this.page, // 页数，不传默认为1
        per_page: 20, // 每页数量，不传每页数量由后端决定
        q: this.$route.params.q // 搜索关键词
      })
      // 2. 将数据添加到数据列表中
      const results = res.data.data.results
      this.list.push(...results)
      // 3. 将本次的 loading 设置为 false
      this.loading = false
      // 4. 判断是否还有数据，如果没有了则将 finished 设置为 true
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
