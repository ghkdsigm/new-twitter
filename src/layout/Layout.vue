<template>
    <component :is="layout"></component>
</template>

<script>
import DefaultLayout from '../layout/DefaultLayout.vue'
import EmptyLayout from '../layout/EmptyLayout.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  components: { DefaultLayout, EmptyLayout },
  setup() {
    const route = useRoute()
    const layout = computed(() => route.meta.layout || 'DefaultLayout')
    return {
      layout,
    }
  },
}
</script>

<style>

</style>