<template>
    <div class="spinner-overlay" v-show="isVisible">
        <div class="spinner"></div>
    </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  
  // Optional: Use a prop if you want to control visibility from the parent component
  const props = defineProps({
    visible: Boolean
  });
  
  const isVisible = ref(props.visible || false);
  
  watchEffect(() => {
    isVisible.value = props.visible;
  });
  </script>

<style>
.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent background */
    z-index: 1000;
}

.spinner {
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    width: 50px;
    height: 50px;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>