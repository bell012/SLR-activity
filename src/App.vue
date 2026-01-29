<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('App mounted')
})
</script>

<style lang="scss">
.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
