<template>
   <div class="flex-1 flex">
    <!-- 프로필섹션 -->
    <div class="flex-1 flex flex-col border-r border-color dark:border-gray-700">
      <!-- 타이틀 -->
      <div class="px-3 py-1 flex border-b border-color dark:border-gray-700">
        <button class="mr-4">
          <i class="fas fa-arrow-left text-primary p-3 rounded-full hover:bg-blue-50"></i>
        </button>
        <div>
          <div class="font-extrabold text-lg dark:text-white">gggg.com</div>
          <div class="text-xs text-gray dark:text-gray-400">333 트윗</div>
        </div>
      </div>
      <!-- 백그라운드이미지 -->
      <div class="bg-gray-300 h-48 relative flex-none">
        <img src="http://picsum.photos/600" class="w-full h-48 object-cover" />
        <!-- 프로피 이미지 -->
        <div class="border-4 border-white bg-gray-100 lg:w-36 lg:h-36 w-28 h-28 rounded-full absolute -bottom-14 lg:left-4 left-2">
          <img src="../assets/jm.jpg" class="w-full h-full rounded-full opacity-90 hover:opacity-100 cursor-pointer" />
        </div>
      </div>
      <!-- 프로필 편집 버튼 -->
      <div class="text-right mt-3 mr-3 mb-7 relative">
        <div>
          <button class="border text-sm border-primary text-primary px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 font-medium rounded-full"><i class="fa-solid fa-wrench"></i> 프로필 수정</button>
        </div>
      </div>
      <!-- 유저정보 -->
      <div class="mx-3 lg:ml-5">
        <div class="font-extrabold text-lg dark:text-white">dobookim.com</div>
        <div class="text-gray dark:text-gray-400">@dubookim_jm</div>
        <div>
          <span class="text-gray"><i class="far fa-calendar"></i> 가입일 : </span>
          <span class="font-medium dark:text-gray-400">2020년 11월 12일</span>
        </div>
        <div>
          <span class="font-medium mr-1 dark:text-gray-400">222</span>
          <span class="text-gray mr-3">팔로우 중</span>
          <span class="font-medium mr-1 dark:text-gray-400">333</span>
          <span class="text-gray">팔로워</span>
        </div>
      </div>
      <!-- 탭버튼 -->
      <div class="flex justify-between border-b dark:border-gray-700 border-color mt-3">
          <div class="w-1/4 text-primary border-b border-primary text-center hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer hover:text-primary py-3">트윗</div>
          <div class="w-1/4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray dark:text-gray-400 py-3 text-center">트윗 및 답글</div>
          <div class="w-1/4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray dark:text-gray-400 py-3 text-center">미디어</div>
          <div class="w-1/4 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray dark:text-gray-400 py-3 text-center">마음에 들어요</div>
      </div>
      <!-- 트윗들 -->
      <div class="overflow-y-auto">
        <Tweet v-for="tweet in 10" :key="tweet"/>
      </div>
    </div>
    <!-- 트렌드 섹션 -->
    <Trends />
  </div>
</template>

<script>
import Trends from '../components/Trends.vue'
import Tweet from '../components/Tweet.vue'
export default {
  components:{
    Trends,
    Tweet
  }
}
</script>

<style>

</style>