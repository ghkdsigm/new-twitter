<template>
  <!--트위츠-->
    <div class="flex px-3 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:bg-opacity-5 transition-all ease-in-out cursor-pointer">
        <router-link :to="`/profile/${tweet.uid}`">
            <img :src="tweet.profile_image_url" class="w-10 h-10 lg:w-12 lg:h-12 rounded-full hover:opacity-80 cursor-pointer" />
        </router-link>
        <div class="flex-1 ml-3 flex flex-col space-y-1">
            <div class="text-sm flex justify-between items-center">
                <div class="text-sm space-x-1">
                    <span class="font-medium lg:text-lg dark:text-white">{{ tweet.email }}</span>
                    <span class="text-gray-500 lg:text-lg text-xs font-light dark:text-gray-400">@{{ tweet.username }}</span>
                    <span class="dark:text-gray-400 lg:text-base font-bold text-gray-500">·</span>
                    <span class="text-gray-500 lg:text-base text-xs font-light dark:text-gray-400">{{ moment(tweet.created_at).fromNow() }}</span>
                </div>
                <!-- 트윗삭제 -->            
                <button v-if="currentUser.uid === tweet.uid" @click="onDeleteTweet(tweet)">
                <i class="fas fa-trash text-red-400 p-2 rounded-full hover:bg-red-50"></i>
                </button>
            </div>
            <!-- 트윗내용 -->
            <div class="dark:text-white pt-1 pb-1 lg:text-lg font-light">
                <router-link :to="`/tweet/${tweet.id}`">{{ tweet.tweet_body }}</router-link>
            </div>
            <div class="flex justify-between">
                <!--코멘트 버튼-->
                <div @click="showCommentModal = true" class="text-gray-500  hover:text-primary ">
                    <i class="far fa-comment hover:bg-blue-50 dark:hover:bg-transparent rounded-full p-2"></i>
                    <span class="ml-1 text-sm">{{ tweet.num_comments }}</span>
                </div>
                <!--트윗 버튼-->
                <div v-if="!tweet.isRetweeted" class="text-gray-500  hover:text-green-500" @click="handleRetweet(tweet)">
                    <i class="fas fa-retweet hover:bg-green-50 dark:hover:bg-transparent rounded-full p-2"></i>
                    <span class="ml-1 text-sm">{{ tweet.num_retweets }}</span>
                </div>
                <div v-else class="text-green-500  dark:text-green-700" @click="handleRetweet(tweet)">
                    <i class="fas fa-retweet hover:bg-green-50 dark:hover:bg-transparent rounded-full p-2"></i>
                    <span class="ml-1 text-sm">{{ tweet.num_retweets }}</span>
                </div>
                <!--좋아요 버튼-->
                <div v-if="!tweet.isLiked" class="text-gray-500  hover:text-red-400 "  @click="handleLikes(tweet)">
                    <i class="far fa-heart hover:bg-red-50 dark:hover:bg-transparent rounded-full p-2"></i>
                    <span class="ml-1 text-sm">{{ tweet.num_likes }}</span>
                </div>
                <div v-else class="text-red-500 dark:text-red-700 "  @click="handleLikes(tweet)">
                    <i class="far fa-heart hover:bg-red-50 dark:hover:bg-transparent rounded-full p-2"></i>
                    <span class="ml-1 text-sm">{{ tweet.num_likes }}</span>
                </div>
                <!--공유 버튼-->
                <div class="text-gray-500  hover:text-primary ">
                    <i class="far fa-share-square hover:bg-blue-50 dark:hover:bg-transparent rounded-full p-2"></i>
                </div>
            </div>
        </div>
    </div>
    <comment-modal :tweet="tweet" v-if="showCommentModal" @close-modal="showCommentModal = false"></comment-modal>
</template>

<script>
import moment from 'moment'
import { ref } from 'vue'
import CommentModal from './CommentModal.vue'
import handleRetweet from '../utils/handleRetweet'
import handleLikes from '../utils/handleLikes'
import { COMMENT_COLLECTION, LIKE_COLLECTION, RETWEET_COLLECTION, TWEET_COLEECTION, USER_COLEECTION } from '../firebase'
import firebase from 'firebase'
export default {
  components: { CommentModal },
  props: ['currentUser', 'tweet'],
  setup() {
    const showCommentModal = ref(false)
    const onDeleteTweet = async (tweet) => {
      if (confirm('정말로 트윗을 삭제하시겠습니까?')) {
        // 트윗 삭제
        await TWEET_COLEECTION.doc(tweet.id).delete()
        // 삭제 커멘트
        const commentSnapshot = await COMMENT_COLLECTION.where('from_tweet_id', '==', tweet.id).get()
        commentSnapshot.docs.forEach(async (doc) => await doc.ref.delete())
        // 삭제 좋아요
        const likeSnapshot = await LIKE_COLLECTION.where('from_tweet_id', '==', tweet.id).get()
        likeSnapshot.docs.forEach(async (doc) => await doc.ref.delete())
        // 삭제 리트윗
        const retweetCollection = await RETWEET_COLLECTION.where('from_tweet_id', '==', tweet.id).get()
        retweetCollection.docs.forEach(async (doc) => await doc.ref.delete())
        // user collection - num_tweets (-1)
        await USER_COLEECTION.doc(tweet.uid).update({
          num_tweets: firebase.firestore.FieldValue.increment(-1),
        })
      }
    }
    return {
      moment,
      showCommentModal,
      handleLikes,
      handleRetweet,
      onDeleteTweet,
    }
  },
}
</script>

<style>

</style>