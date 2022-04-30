<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" @click="$emit('close-modal')">
    <div class="flex justify-center min-h-screen sm:pt-6 sm:px-4 sm:pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>
      </div>

      <!-- 내용 -->
      <div @click.stop class="inline-block bg-white dark:bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full justify-center" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="border-b border-gray-100 dark:border-gray-700 p-2 text-right">
          <button @click="$emit('close-modal')" class="fas fa-times text-primary dark:text-white text-lg p-2 h-10 w-10 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full"></button>
          <!-- 트윗버튼 -->
          <div class="text-right sm:hidden mr-2">
            <button v-if="!tweetBody.length" class="bg-light text-sm font-bold text-white px-4 py-1 rounded-full">트윗</button>
            <button v-else @click="onAddTweet" class="bg-primary hover:bg-dark text-sm font-bold text-white px-4 py-1 rounded-full">트윗</button>
          </div>
        </div>
        <!-- 트윗섹션 -->
        <div class="flex p-4">
          <img :src="currentUser.profile_image_url" class="w-12 h-12 rounded-full hover:opacity-80 cursor-pointer" />
          <div class="ml-3 flex-1 flex flex-col">
            <textarea v-model="tweetBody" rows="5" placeholder="무슨 일이 일어나고 있나요?" class="w-full dark:bg-black dark:text-white text-lg font-bold focus:outline-none mb-3 resize-none"></textarea>
            <!-- 스몰일때 트윗버튼 -->
            <div class="text-right hidden sm:block">
              <button v-if="!tweetBody.length" class="bg-light text-sm font-bold text-white px-4 py-1 rounded-full">트윗</button>
              <button v-else @click="onAddTweet" class="bg-primary hover:bg-dark text-sm font-bold text-white px-4 py-1 rounded-full">트윗</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import addTweet from '../utils/addTweet'
import store from '../store'
export default {
  setup(props, context) {
    const tweetBody = ref('')
    const currentUser = computed(() => store.state.user)

    const onAddTweet = async () => {
      try {
        await addTweet(tweetBody.value, currentUser.value)
        alert('트윗이 등록되었습니다!')
        tweetBody.value = ''
        context.emit('close-modal')
      } catch (e) {
        console.log('on add tweet error on homepage:', e)
      }
    }
    return {
      tweetBody,
      onAddTweet,
      currentUser,
    }
  },
}
</script>

<style>

</style>