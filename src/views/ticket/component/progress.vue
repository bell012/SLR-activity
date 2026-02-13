<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${percentage}%` }"></div>
      <div class="progress-text">{{ percentage }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percentage?: number
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 0
})

// 百分比0-100
const percentage = computed(() => {
  return Math.min(100, Math.max(0, props.percentage))
})
</script>

<style lang="scss" scoped>
.progress-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .progress-bar {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .progress-fill {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #fdc234 0%, #fe6e04 100%);
      border-radius: 8px;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 10px;
      color: #ffffff;
      z-index: 1;
    }
  }
}
</style>
