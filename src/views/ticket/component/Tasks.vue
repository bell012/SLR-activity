<!-- 任务组件 -->
<template>
  <div class="tasks-container">
    <div class="title-section">
      <img :src="titleImg" alt="title" class="title-img" />
    </div>

    <div class="tasks-content">
      <div class="complete-text">Complete tasks to claim Coupons</div>
      <div class="progress-wrapper progress-wrapper-total">
        <Progress :percentage="50" />
      </div>

      <div class="line">
        <img src="@/static/ticket/line.png" alt="title" class="line-img" />
      </div>

      <div class="tasks-list">
        <div
          v-for="(task, index) in taskList"
          :key="index"
          class="task-item"
          :class="{ 'has-progress': task.hasProgress }"
        >
          <div class="task-content">
            <div class="task-info">
              <div class="task-title">{{ task.title }}</div>
            </div>

            <button
              class="task-btn"
              :class="{ active: task.btnActive, completed: task.btnCompleted }"
            >
              {{ task.btnText }}
            </button>
          </div>

          <div v-if="task.hasProgress" class="progress-text">
            <span class="progress-current">{{ task.current }}</span>
            <span class="progress-target">{{ task.target }}</span>
          </div>

          <div v-if="task.hasProgress" class="task-progress">
            <div class="progress-wrapper">
              <Progress :percentage="task.progress" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Progress from './progress.vue'
import titleImg from '@/static/ticket/renwu-title.png'

const taskList = ref([
  {
    title: 'Set withdrawal name',
    btnText: 'GO',
    btnActive: true,
    btnCompleted: false,
    hasProgress: false
  },
  {
    title: 'Bind Telegram',
    btnText: 'Completed',
    btnActive: false,
    btnCompleted: true,
    hasProgress: false
  },
  {
    title: 'Valid Bets on Eligible Games ≥ ₱100',
    btnText: 'Bet',
    btnActive: true,
    btnCompleted: false,
    hasProgress: true,
    current: 50,
    target: 100,
    progress: 50
  },
  {
    title: 'Valid Bets on Eligible Games',
    btnText: 'Deposit',
    btnActive: true,
    btnCompleted: false,
    hasProgress: true,
    current: 50,
    target: 100,
    progress: 50
  },
  {
    title: 'Valid Bets on Eligible Games',
    btnText: 'Completed',
    btnActive: false,
    btnCompleted: true,
    hasProgress: true,
    current: 100,
    target: 100,
    progress: 100
  }
])
</script>

<style scoped lang="scss">
.tasks-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .progress-wrapper {
    width: 100%;
    height: 18px;
    border-radius: 10px;
    background: #00000066;
    border: 1px solid #ffffff4d;
    box-shadow: 0px 6px 12px 0px #00000040 inset;
    backdrop-filter: blur(18px);
    padding: 2px;
  }

  .progress-wrapper-total {
    margin: 10px 0;
  }

  .title-section {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;

    .title-img {
      width: auto;
      height: 43px;
    }
  }

  .tasks-content {
    width: 100%;
    max-width: 420px;
    padding: 30px 10px;
    background: url('@/static/ticket/renwu-BG.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .complete-text {
      margin-top: 40px;
      font-size: 14px;
      color: #e9bb89;
      text-align: center;
      font-weight: 400;
    }

    .line {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 1px;
      margin: 5px 0 15px 0;
      .line-img {
        width: 100%;
        height: 100%;
      }
    }

    .tasks-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .task-item {
        width: 100%;
        padding: 15px;
        background: url('@/static/ticket/renwu-item.png') no-repeat;
        background-size: 100% 100%;
        border-radius: 12px;

        &.has-progress {
          background: url('@/static/ticket/renwu-item-big.png') no-repeat;
          background-size: 100% 100%;
          padding: 15px;
        }

        .task-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0;

          .task-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 5px;

            .task-title {
              font-size: 13px;
              color: #e9bb89;
              font-weight: 600;
            }
          }

          .task-btn {
            padding: 0px 10px;
            height: 30px;
            border: none;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            background: url('@/static/ticket/renwu-btn-hui.png') no-repeat;
            background-size: 100% 100%;
            color: #999999;
            min-width: 85px;

            &.active {
              background: url('@/static/ticket/renwu-btn-liang.png') no-repeat;
              background-size: 100% 100%;
              color: #ffffff;
            }

            &.completed {
              background: url('@/static/ticket/renwu-btn-hui.png') no-repeat;
              background-size: 100% 100%;
              color: #6d6578;
              cursor: not-allowed;
            }
          }
        }
        .progress-text {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #ffffff;
          font-weight: 400;
          margin-top: 10px;
          .progress-current {
          }
          .progress-target {
          }
        }
      }
    }
  }
}
</style>
