<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './app/layouts/DefaultLayout.vue'

const route = useRoute()
const layout = computed(() => {
  if (route.meta.layout === 'default') return DefaultLayout
  return 'div' // Comportamiento de layout en blanco o 'blank'
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>