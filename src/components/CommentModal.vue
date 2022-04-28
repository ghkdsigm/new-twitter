<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" @click="$emit('close-modal')">
    <div class="flex justify-center min-h-screen sm:pt-6 sm:px-4 sm:pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>
      </div>

      <!-- 내용 -->
      <div @click.stop class="inline-block bg-white dark:bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full justify-center" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="border-b border-gray-100 dark:border-gray-700 p-2 flex items-center justify-between">
          <button @click="$emit('close-modal')" class="fas fa-times text-primary dark:text-white text-lg p-2 h-10 w-10 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full"></button>
          <!-- 트윗버튼 -->
          <div class="text-right sm:hidden mr-2">
            <button v-if="!tweetBody.length" class="bg-light text-sm font-bold text-white px-4 py-1 rounded-full">트윗</button>
            <button v-else @click="onCommentTweet" class="bg-primary hover:bg-dark text-sm font-bold text-white px-4 py-1 rounded-full">트윗</button>
          </div>
        </div>
        <!-- 원본 트윗 -->
        <div class="flex px-4 pt-4  pb-3">
            <div class="flex flex-col">
                <img :src="tweet.profile_image_url" class="w-12 h-12 rounded-full hover:opacity-80 cursor-pointer" />
                <div class="ml-5 w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2"></div>            
            </div>
            <div class="ml-2 flex-1">
                <div class="flex space-x-2">
                    <span class="font-bold text-sm dark:text-white">{{tweet.email}}</span>
                    <span class="text-gray text-sm dark:text-gray-400">@{{tweet.username}}</span>
                    <span class="dark:text-gray-400 text-sm font-bold text-gray-500">·</span>
                    <span class="text-gray text-sm dark:text-gray-400">{{moment(tweet.created_at).fromNow()}}</span>
                </div>
                <div class="text-sm text-gray dark:text-gray-400 pt-2 pb-2">
                    {{tweet.tweet_body}}
                </div>
                <div>
                    <span class="text-primary text-sm">@{{tweet.username}} 님</span>
                    <span class="text-gray text-sm dark:text-white">에게 보내는 답글</span>
                </div>
            </div>
        </div>
        <!-- 트윗섹션 -->
        <div class="flex px-4 pb-4">
          <img :src="currentUser.profile_image_url" class="w-12 h-12 rounded-full hover:opacity-80 cursor-pointer" />
          <div class="ml-3 flex-1 flex flex-col">
            <textarea v-model="tweetBody" rows="5" placeholder="내 답글을 트윗합니다." class="w-full dark:bg-black dark:text-white text-lg font-bold focus:outline-none mb-3 resize-none"></textarea>
            <!-- 스몰일때 트윗버튼 -->
            <div class="text-right hidden sm:block">
              <button v-if="!tweetBody.length" class="bg-light text-sm font-bold text-white px-4 py-1 rounded-full">답글</button>
              <button v-else @click="onCommentTweet" class="bg-primary hover:bg-dark text-sm font-bold text-white px-4 py-1 rounded-full">답글</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import moment from 'moment'
import store from '../store'
import { COMMENT_COLLECTION, TWEET_COLEECTION } from '../firebase'
import firebase from 'firebase'

export default {
  props: ['tweet'],
  setup(props, context) {
    const tweetBody = ref('')
    const currentUser = computed(() => store.state.user)
    const onCommentTweet = async () => {
      try {
        const doc = COMMENT_COLLECTION.doc()
        await doc.set({
          id: doc.id,
          from_tweet_id: props.tweet.id, //앞에 프롭스를 붙혀줘야함
          comment_tweet_body: tweetBody.value,
          uid: currentUser.value.uid,
          created_at: Date.now(),
        })
        // 댓글갯수 반영
        await TWEET_COLEECTION.doc(props.tweet.id).update({
          num_comments: firebase.firestore.FieldValue.increment(1),
        })
        alert('답글이 등록되었습니다.')
        context.emit('close-modal')
      } catch (e) {
        console.log('on comment tweet error:', e)
      }
    }
    return {
      tweetBody,
      moment,
      currentUser,
      onCommentTweet,
    }
  },
}
</script>

<style>

</style>