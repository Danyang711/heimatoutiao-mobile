<template>
  <div class="login">
      <!-- 导航栏 -->
      <van-nav-bar title="标题"/>
        <!-- 表单 -->
     <van-cell-group>
        <van-field
            v-model="user.mobile"
            required
            clearable
            label="手机号"
            placeholder="请输入手机号"
        />

        <van-field
            v-model="user.mobile"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
        />
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-btn-box">
        <van-button type="info" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    //   登录处理
    async onLogin () {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      try {
        const res = await login(this.user)
        console.log('登录成功', res)
        this.$toast.success('登录成功')
      } catch (err) {
        console.log('登录失败', err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    }
  }
}
</script>

<style scoped lang="less">
.login {
  .login-btn-box {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
}
</style>
