<template>
  <div class="search">
      <!-- 搜索框 -->
        <van-search
            v-model="searchText"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            @search="onSearch"
            @input="onSearchInput"
        >
            <div slot="action" @click="onSearch(searchText)">搜索</div>
        </van-search>
         <!-- 联想建议 -->
        <van-cell-group v-show="searchText">
            <van-cell
                v-for="item in suggestions"
                :title="item"
                :key="item"
                icon="search"
                @click="onSearch(item)"
            >
            <!-- 高亮字符串 -->
                <div slot="title" v-html="highlight(item)"></div>
            </van-cell>
        </van-cell-group>
        <!-- 搜索历史记录 -->
       <van-cell-group v-show="!searchText">
          <van-cell title="历史记录">
            <div v-show="isDeleteShow">
              <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
              <span @click="isDeleteShow = false">完成</span>
            </div>
            <van-icon
              name="delete"
              v-show="!isDeleteShow"
              @click="isDeleteShow = true"
            />
          </van-cell>
          <van-cell
            :title="item"
            :key="item"
            v-for="(item,index) in searchHistories"
            @click="onSearch(item)"
          >
          <van-icon
            v-show="isDeleteShow"
            name="close"
            @click.stop="searchHistories.splice(index, 1)"
           />
        </van-cell>
      </van-cell-group>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { setItem, getItem } from '@/utils/storages'
// 防抖
import { debounce } from 'lodash'

export default {
  name: 'SearchPage',
  data () {
    return {
      searchText: '', // 用户输入的搜索文本
      suggestions: [], // 搜索联想建议数据列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false // 控制删除历史记录的显示状态
    }
  },

  // 历史记录
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },

  methods: {
    //   搜索
    onSearch (q) {
      if (!q.trim()) {
        return
      }

      // 在跳转之前将搜索的关键字记录到搜索历史记录中
      const index = this.searchHistories.indexOf(q)

      // 不要重复的
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }

      // 最新的在最前面
      this.searchHistories.unshift(q)

      // 将搜索历史记录放到本次存储，以便持久化
      setItem('search-histories', this.searchHistories)

      this.$router.push(`/search/${q}`)
    },

    // 联想建议(防抖)
    onSearchInput: debounce(async function () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const res = await getSuggestion(this.searchText)
      this.suggestions = res.data.data.options
    }, 500),

    // 高亮
    highlight (str) {
      // 如果想要动态的创建一个正则表达式，使用 new RegExp 手动构造
      // g 全局，i 忽略大小写
      const reg = new RegExp(this.searchText, 'ig')
      return str.replace(reg, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}

</script>

<style scoped lang='less'>

</style>
