<template>
  <div class="flex-1 flex">
      <!--채팅리스트-->
      <div class="w-2/5 border-r border-gray-100 dark:border-gray-800 overflow-y-auto">
      <div class="flex flex-col">
        <div class="sticky top-0 bg-black bg-opacity-70  p-3 font-bold text-lg border-b border-gray-100 dark:text-white dark:border-gray-800 h-14">쪽지</div>
        <div class="flex cursor-pointer px-3 py-4 dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-800 bg-gray-200">
          <img src="http://picsum.photos/200" class="w-10 h-10 rounded-full cursor-pointer mr-2" />
          <div class="flex space-x-2">
            <div class="font-bold dark:text-white">ddd2222d.com</div>
            <div class="text-gray-500 dark:text-gray-400">@dd22222dd</div>
            <div class="text-gray-500">1월 29일</div>
          </div>
        </div>
        <!-- 유저 목록 한개 -->
        <div class="flex cursor-pointer px-3 py-4 hover:bg-gray-50 dark:hover:bg-transparent border-b border-gray-100 dark:border-gray-800" v-for="messages in 20" :key="messages">
          <img src="http://picsum.photos/200" class="w-10 h-10 rounded-full cursor-pointer mr-2" />
          <div class="flex space-x-2">
            <div class="font-bold dark:text-white">ddd2222d.com</div>
            <div class="text-gray-500 dark:text-gray-400">@dd22222dd</div>
            <div class="text-gray-500">1월 29일</div>
          </div>
        </div>
      </div>
    </div>
      <!--채팅-->
      <div class="w-3/5 border-r border-gray-100 dark:border-gray-800">
        <div class="flex flex-col h-screen">
            <!--타이틀-->
            <div class="flex px-3 h-14 items-center border-b border-gray-100 dark:border-gray-800">
                <img src="http://picsum.photos/100" class="w-8 h-8 rounded-full mr-2 cursor-pointer">
                <div>
                    <div class="font-bold text-lg dark:text-white">dddd.com</div>
                    <div class="text-sm text-gray-500 dark-text-gray-400 dark:text-gray-400">@jiddd</div>
                </div>
            </div>
            <!--유저정보-->
            <div class="flex flex-col justify-center items-center border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 py-6">
                <div>
                    <span class="font-bold mr-1 dark:text-white">jddjdjd.com</span>
                    <span class="text-gray-500 dark:text-gray-400">@dhdhdhdhdh</span>
                </div>
                <div>
                    <span class="font-bold mr-1 dark:text-gray-400">29</span><span class="text-gray-500">팔로우 중</span>
                    <span class="font-bold ml-3 mr-1 dark:text-gray-400">4</span><span class="text-gray-500">팔로워</span>
                </div>
                <div>
                    <span class="text-gray-500 mr-1">가입일</span>
                    <span class="text-gray-500 dark:text-gray-400">2011년 10월</span>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto lg:pl-3 lg:pr-3">
                <!--채팅내용 마이채팅-->
                <div class="text-right px-3 py-3 mt-2 mb-2">
                    <span class="bg-primary dark:bg-blue-700 text-white px-4 py-2 text-lg rounded-full">메시지</span>
                    <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        2021년 1월 29일 오전 1:05
                    </div>
                </div>
                <!--채팅내용 상대방 채팅-->
                <div class="text-left px-3 py-3 mt-2 mb-2" v-for="chat in 5" :key="chat">
                    <span class="bg-gray-100 dark:bg-gray-300 px-4 py-2 text-lg rounded-full">메시지</span>
                    <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        2021년 1월 29일 오전 1:05
                    </div>
                </div>
            </div>

            <!--채팅 인풋-->
            <div class="flex items-center bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 sticky">
                <input type="text" class="m-2 py-3 px-4 rounded-full bg-gray-100 dark:bg-transparent dark:text-white resize-none outline-none flex-1" placeholder="새 쪽지 작성하기" />
                <button class="text-center">
                    <i class="far fa-paper-plane text-primary text-lg hover:bg-lighter p-2 rounded-full w-10 h-10"></i>
                </button>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>