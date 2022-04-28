<template>
  <!--노티피케이션-->
  <div class="flex-1 border-r border-gray-100 dark:border-gray-800 flex flex-col overflow-y-auto">
      <!--타이틀-->
      <div class="sticky top-0 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-70 p-3 font-bold text-xl border-b border-gray-100 dark:border-gray-800 dark:text-white">알림</div>
      <!--알림-->
      <div class="flex flex-col hover:bg-gray-50 dark:bg-transparent p-3 space-y-2 border-gray-100 cursor-pointer" v-for="notification in 23" :key="notification">
          <div class="flex justify-between">
              <img src="http://picsum.photos/100" class="w-10 h-10 rounded-full hover:opacity-80" />
              <i class="fas fa-ellipsis-h text-gray-500 hover:bg-blue-50 hover:text-primary p-2 rounded-full w-10 h-10 flex items-center justify-center"></i>
          </div>
          <div>
              <span class="font-bold dark:text-white">설인아 님의 최근 트윗</span>
          </div>
          <div class="text-gray-500 dark:text-gray-400">블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라</div>
      </div>
  </div>
  <!--트렌드-->
  <Trends/>
</template>

<script>
import Trends from '../components/Trends.vue'
export default {
  components:{
    Trends
  }
}
</script>

<style>

</style>