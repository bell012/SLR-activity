<!-- 大弹窗组件 -->
<template>
  <div v-if="visible" class="popup-overlay" @click="handleClose">
    <div class="popup-big" @click.stop>
      <img src="@/static/ticket/close.png" alt="close" class="close-btn" @click="handleClose" />
      <div class="popup-content">
        <h2 class="title">Congratulations!</h2>
        <p class="subtitle">{{ props.subtitle }}</p>
        <div v-if="Number(props.amount) > 0" class="amount">₱{{ props.amount }}</div>
        <div
          class="rewards-list"
          :class="{ 'rewards-list--with-amount': Number(props.amount) > 0 }"
        >
          <div
            v-for="(item, index) in props.rewards"
            :key="index"
            class="reward-card"
            :style="{
              backgroundImage: `url(${item.icon})`
            }"
          >
            <div></div>
            <div class="reward-info">
              <p class="reward-desc">{{ item.description }}</p>
              <p
                class="reward-qty"
                :style="{
                  backgroundColor: item.bgColor
                }"
              >
                Qty : {{ item.quantity }}
              </p>
            </div>
          </div>
        </div>

        <div class="action-btn" @click="handleAction">
          <span class="btn-text">{{ props.buttonText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RewardItem {
  icon: string
  description: string
  quantity: number
  bgColor: string
}

interface Props {
  visible?: boolean
  subtitle?: string
  amount?: string | number
  rewards?: RewardItem[]
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  subtitle: "You've Earned Bonus",
  amount: '',
  buttonText: 'USE NOW',
  rewards: () => [
    {
      icon: '/src/static/ticket/card_jindan.png',
      description: 'Register and get ₱3-₱888 bonus!',
      quantity: 1,
      bgColor: '#FEE554'
    },
    {
      icon: '/src/static/ticket/card_zhuanpan.png',
      description: 'Register and get ₱3-₱888 bonus!',
      quantity: 10,
      bgColor: '#FA9CFF'
    },
    {
      icon: '/src/static/ticket/card_hongbao.png',
      description: 'Register and get ₱3-₱888 bonus!',
      quantity: 5,
      bgColor: '#fba1a4'
    },
    {
      icon: '/src/static/ticket/card_xianjin.png',
      description: 'Register and get ₱3-₱888 bonus!',
      quantity: 3,
      bgColor: '#9affb1'
    }
  ]
})

const emit = defineEmits<{
  close: []
  action: []
}>()

const handleClose = () => {
  emit('close')
}

const handleAction = () => {
  emit('action')
}
</script>

<style lang="scss" scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000099;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-big {
  position: relative;
  width: 100%;
  height: 450px;
  background: url('@/static/ticket/popup_big.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px 30px;

  .close-btn {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 25px;
    cursor: pointer;
  }

  .popup-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .title {
      font-size: 22px;
      font-weight: 700;
      color: #f10e3d;
      text-align: center;
    }

    .subtitle {
      font-size: 16px;
      color: #000;
      font-weight: 500;
      margin: 10px 0 0px 0;
      text-align: center;
    }

    .amount {
      font-size: 38px;
      font-weight: 700;
      color: #f10e3d;
      margin: 0px 0 0px 0;
      text-align: center;
    }

    .rewards-list {
      width: 100%;
      height: 190px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      padding: 15px;
      padding-top: 0px;
      margin-top: 15px;

      .reward-card {
        width: 100%;
        height: 77px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .reward-info {
          width: 70%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 15px;

          .reward-desc {
            font-size: 12px;
            color: #000000;
            font-weight: 600;
          }

          .reward-qty {
            width: fit-content;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #000000;
            font-weight: 600;
            border-radius: 6px;
            padding: 2px 8px;
          }
        }
      }
    }

    .rewards-list.rewards-list--with-amount {
      height: 144px;
    }

    .action-btn {
      width: 225px;
      height: 50px;
      background: url('@/static/ticket/btn.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-top: 20px;

      .btn-text {
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
}
</style>
