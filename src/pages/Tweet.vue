<template>
  <div class="flex-1 flex">
    <div class="flex-1 border-r border-gray-200 dark:border-gray-800">
      <div class="flex flex-col" v-if="tweet">
        <!-- 타이틀 -->
        <div class="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <button @click="router.go(-1)">
            <i class="fas fa-arrow-left text-primary text-lg ml-0 hover:bg-blue-50 dark:hover:bg-gray-800 p-2 rounded-full h-10 w-10"></i>
          </button>
          <span class="font-bold text-lg ml-2 dark:text-white">트윗</span>
        </div>
        <!-- 트윗 -->
        <div class="px-3 py-2 flex">
          <img :src="tweet.profile_image_url" class="w-10 h-10 rounded-full hover:opacity-90 cursor-pointer" />
          <div class="ml-2">
            <div class="font-bold dark:text-white">{{ tweet.email }}</div>
            <div class="text-gray text-sm dark:text-gray-400">@{{ tweet.username }}</div>
          </div>
        </div>
        <div class="px-3 py-2 dark:text-white">{{ tweet.tweet_body }}</div>
        <div class="px-3 py-2 text-gray text-xs dark:text-gray-400">{{ moment(tweet.created_at).fromNow() }}</div>
        <div class="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
        <div class="flex space-x-2 px-3 py-2 items-center">
          <span class="dark:text-gray-400">{{ tweet.num_retweets }}</span>
          <span class="text-sm text-gray">리트윗</span>
          <span class="ml-5 dark:text-gray-400">{{ tweet.num_likes }}</span>
          <span class="text-sm text-gray">마음에 들어요</span>
        </div>
        <div class="h-px w-full bg-gray-200 dark:bg-gray-800"></div>  
        <!-- 트윗 뷰 댓글 좋아요 리트윗 버튼 -->
        <div class="flex justify-around py-2">
          <button @click="showCommentModal = true">
            <i class="far fa-comment text-gray-400 text-xl hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-primary p-2 rounded-full h-10 w-10"></i>
          </button>
          <button @click="handleRetweet(tweet)">
            <i v-if="tweet.isRetweeted" class="fas fa-retweet text-xl hover:bg-green-50 dark:hover:bg-gray-800 text-green-400 p-2 rounded-full h-10 w-10"></i>
            <i v-else class="fas fa-retweet text-gray-400 text-xl hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-400 p-2 rounded-full h-10 w-10"></i>
          </button>
          <button @click="handleLikes(tweet)">
            <i v-if="tweet.isLiked" class="far fa-heart text-xl hover:bg-red-50 dark:hover:bg-gray-800 text-red-400 p-2 rounded-full h-10 w-10"></i>
            <i v-else class="far fa-heart text-gray-400 text-xl hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-400 p-2 rounded-full h-10 w-10"></i>
          </button>
        </div>
        <div class="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
        <!-- 댓글 -->
        <div v-for="comment in comments" :key="comment" class="flex hover:bg-gray-50 dark:hover:bg-opacity-5 cursor-pointer px-3 py-4 border-b border-gray-100 dark:border-gray-800">
          <img :src="comment.profile_image_url" class="w-10 h-10 rounded-full hover:opacity-90 cursor-pointer" />
          <div class="ml-2 flex-1">
            <div class="flex items-center space-x-2">
              <span class="font-bold dark:text-white">{{ comment.email }}</span>
              <span class="text-gray text-sm dark:text-gray-400">@{{ comment.username }}</span>
              <span class="dark:text-gray-400">{{ moment(comment.created_at).fromNow() }}</span>
            </div>
            <div class="dark:text-white py-2">{{ comment.comment_tweet_body }}</div>
          </div>
          <button @click="handleDeleteComment(comment)" v-if="comment.uid === currentUser.uid">
            <i class="fas fa-trash text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 w-10 h-10 rounded-full p-3"></i>
          </button>
        </div>
      </div>
    </div>
    <trends></trends>
    <comment-modal :tweet="tweet" v-if="showCommentModal" @close-modal="showCommentModal = false"></comment-modal>
  </div>
</template>

<script>
import Trends from '../components/Trends.vue'
import router from '../router'
import { onBeforeMount, ref, computed } from 'vue'
import store from '../store'
import { COMMENT_COLLECTION, TWEET_COLEECTION } from '../firebase'
import { useRoute } from 'vue-router'
import getTweetInfo from '../utils/getTweetInfo'
import moment from 'moment'
import CommentModal from '../components/CommentModal.vue'
import handleRetweet from '../utils/handleRetweet'
import handleLikes from '../utils/handleLikes'
import firebase from 'firebase'
export default {
  components: { Trends, CommentModal },
  setup() {
    const tweet = ref(null)
    const comments = ref([])
    const currentUser = computed(() => store.state.user)
    const showCommentModal = ref(false)
    const route = useRoute()
    const handleDeleteComment = async (comment) => {
      if (confirm('댓글을 삭제하시겠습니까?')) {
        // 댓글 코멘트 삭제
        await COMMENT_COLLECTION.doc(comment.id).delete()
        // 댓글 숫자 감소
        await TWEET_COLEECTION.doc(comment.from_tweet_id).update({
          num_comments: firebase.firestore.FieldValue.increment(-1),
        })
      }
    }
    onBeforeMount(async () => {
      await TWEET_COLEECTION.doc(route.params.id).onSnapshot(async (doc) => {
        const t = await getTweetInfo(doc.data(), currentUser.value)
        tweet.value = t
      })
      COMMENT_COLLECTION.where('from_tweet_id', '==', route.params.id)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            let comment = await getTweetInfo(change.doc.data(), currentUser.value)
            if (change.type === 'added') {
              comments.value.splice(change.newIndex, 0, comment)
            } else if (change.type === 'modified') {
              comments.value.splice(change.oldIndex, 1, comment)
            } else if (change.type === 'removed') {
              comments.value.splice(change.oldIndex, 1)
            }
          })
        })
    })
    return { router, tweet, comments, currentUser, moment, showCommentModal, handleRetweet, handleLikes, handleDeleteComment }
  },
}
</script>

<style>

</style>