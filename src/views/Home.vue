<template>
  <div class="home">
    <van-nav-bar title="首页" fixed placeholder />

    <div class="content">
      <div class="demo-box">
        <p>这是一个 200px 的盒子</p>
        <p>会自动转换为 rem 单位</p>
      </div>

      <div class="api-demo">
        <h2>API 请求示例</h2>

        <van-button type="primary" block :loading="getLoading" @click="handleGetRequest">
          GET 请求示例
        </van-button>

        <van-button type="success" block :loading="postLoading" @click="handlePostRequest">
          POST 请求示例
        </van-button>

        <van-button type="warning" block :loading="loginLoading" @click="handleLoginRequest">
          登录请求示例
        </van-button>

        <div @click="handleBtn">按钮.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { testApi, userApi } from '@/api'
import { closeToast, showLoadingToast, showToast } from 'vant'
import { ref } from 'vue'

const getLoading = ref(false)
const postLoading = ref(false)
const loginLoading = ref(false)

const handleBtn = () => {
  showToast({
    message: '按钮点击成功！',
    position: 'top'
  })
}

// GET 请求示例
const handleGetRequest = async () => {
  getLoading.value = true
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0
  })

  try {
    // 模拟 GET 请求
    const response = await testApi.getTest()
    closeToast()
    showToast({
      message: 'GET 请求成功！',
      position: 'top'
    })
    console.log('GET 请求结果：', response)
  } catch (error) {
    closeToast()
    console.error('GET 请求失败：', error)
  } finally {
    getLoading.value = false
  }
}

// POST 请求示例
const handlePostRequest = async () => {
  postLoading.value = true
  showLoadingToast({
    message: '提交中...',
    forbidClick: true,
    duration: 0
  })

  try {
    // 模拟 POST 请求
    const response = await testApi.postTest({
      name: '测试数据',
      value: 123,
      timestamp: Date.now()
    })
    closeToast()
    showToast({
      message: 'POST 请求成功！',
      position: 'top'
    })
    console.log('POST 请求结果：', response)
  } catch (error) {
    closeToast()
    console.error('POST 请求失败：', error)
  } finally {
    postLoading.value = false
  }
}

// 登录请求示例
const handleLoginRequest = async () => {
  loginLoading.value = true
  showLoadingToast({
    message: '登录中...',
    forbidClick: true,
    duration: 0
  })

  try {
    // 模拟登录请求
    const response = await userApi.login({
      username: 'demo',
      password: '123456'
    })
    closeToast()
    showToast({
      message: '登录请求成功！',
      position: 'top'
    })
    console.log('登录请求结果：', response)
  } catch (error) {
    closeToast()
    console.error('登录请求失败：', error)
  } finally {
    loginLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background-color: $background-color;
}

.content {
  padding: 16px;

  h1 {
    font-size: 24px;
    color: $primary-color;
    text-align: center;
    margin-bottom: 20px;
  }

  .van-cell-group {
    margin-bottom: 20px;
  }

  .demo-box {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    text-align: center;

    p {
      margin: 5px 0;
    }
  }

  .api-demo {
    margin-top: 30px;

    h2 {
      font-size: 18px;
      color: $text-color;
      margin-bottom: 15px;
      text-align: center;
    }

    .van-button {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
