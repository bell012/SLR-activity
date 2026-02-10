<!-- 金蛋组件 -->
<template>
  <div class="jindan-container">
    <!-- 金蛋展示区 -->
    <div class="jindan-box">
      <div class="jindan-grid">
        <div class="jindan-row">
          <div v-for="i in 2" :key="`row1-${i}`" class="jindan-item">
            <img src="@/static/ticket/jindan.png" alt="金蛋" class="jindan-img" />
          </div>
        </div>

        <div class="jindan-row">
          <div v-for="i in 3" :key="`row2-${i}`" class="jindan-item">
            <img src="@/static/ticket/jindan.png" alt="金蛋" class="jindan-img" />
          </div>
        </div>

        <div class="jindan-row">
          <div v-for="i in 3" :key="`row3-${i}`" class="jindan-item">
            <img src="@/static/ticket/jindan.png" alt="金蛋" class="jindan-img" />
          </div>
        </div>
      </div>

      <div class="smash-btn">
        <span class="btn-text">Smash</span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-wrapper">
      <Progress :percentage="50" />
    </div>

    <!-- 中奖列表 -->
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

  .jindan-box {
    width: 100%;
    padding: 20px;
    background: url('@/static/ticket/jindanBG.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 20px;

    .jindan-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;

      .jindan-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;

        .jindan-item {
          width: 80px;
          height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          .jindan-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }

    .smash-btn {
      width: 100%;
      height: 40px;
      background: url('@/static/ticket/jindan_btn.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .btn-text {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(180deg, #ffffff 32.31%, #ffc37e 80%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
}
</style>
