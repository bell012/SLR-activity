<template>
  <div class="jindan-container">
    <div class="jindan-content">金蛋组件</div>

    <!-- 进度条示例 -->
    <div class="progress-wrapper">
      <Progress :percentage="50" />
    </div>
    <Wins />
  </div>
</template>

<script setup lang="ts">
import Progress from '../progress.vue'
import Wins from '../wins.vue'
</script>

<style lang="scss" scoped>
.jindan-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .jindan-content {
    text-align: center;
    color: #fff;
    font-size: 16px;
  }

  .progress-wrapper {
    width: 100%;
    height: 18px;
    border-radius: 10px;
    background: #00000066;
    border: 1px solid #ffffff4d;
    box-shadow: 0px 6px 12px 0px #00000040 inset;
    backdrop-filter: blur(18px);
    padding: 2px;
    margin: 10px 0;
  }
}
</style>
