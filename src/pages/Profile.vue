<template>
   <div class="flex-1 flex">
    <!-- 프로필섹션 -->
    <div class="flex-1 flex flex-col border-r border-color dark:border-gray-800">
      <!-- 타이틀 -->
      <div class="sticky top-0 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-70  px-3 py-1 flex border-b border-color dark:border-gray-800">
        <button class="mr-4">
          <i class="fas fa-arrow-left text-primary p-3 rounded-full hover:bg-blue-50"></i>
        </button>
        <div>
          <div class="font-extrabold text-xl dark:text-white">{{currentUser.email}}</div>
          <div class="text-sm text-gray dark:text-gray-400">{{currentUser.num_tweets}} 트윗</div>
        </div>
      </div>
      <!-- 백그라운드이미지 -->
      <div class="bg-gray-300 h-48 relative flex-none">
        <img src="http://picsum.photos/600" class="w-full h-48 object-cover" />
        <!-- 프로필 이미지 -->
        <div class="border-4 border-white bg-gray-100 lg:w-36 lg:h-36 w-28 h-28 rounded-full absolute -bottom-14 lg:left-4 left-2">
          <img :src="currentUser.profile_image_url" class="w-full h-full rounded-full opacity-90 hover:opacity-100 cursor-pointer" />
        </div>
      </div>
      <!-- 프로필 편집 버튼 -->
      <div class="text-right mt-3 mr-4 mb-7 relative">
        <div>
          <button class="border text-sm border-primary text-primary px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 font-medium rounded-full"><i class="fa-solid fa-wrench"></i> 프로필 수정</button>
        </div>
      </div>
      <!-- 유저정보 -->
      <div class="mx-3 lg:ml-5">
        <div class="font-extrabold text-lg dark:text-white">{{currentUser.email}}</div>
        <div class="text-gray dark:text-gray-400">{{currentUser.username}}</div>
        <div>
          <span class="text-gray"><i class="far fa-calendar"></i> 가입일 : </span>
          <span class="font-medium dark:text-gray-400">{{moment(currentUser.created_at).format('YYYY년 MM월 DD일')}}</span>
        </div>
        <div>
          <span class="font-medium mr-1 dark:text-gray-400">{{currentUser.followings.length}}</span>
          <span class="text-gray mr-3">팔로우 중</span>
          <span class="font-medium mr-1 dark:text-gray-400">{{currentUser.followers.length}}</span>
          <span class="text-gray">팔로워</span>
        </div>
      </div>
      <!-- 탭버튼 -->
      <div class="flex justify-between mt-3 border-b dark:border-gray-800 border-gray-200">
          <div @click="currentTab = 'tweet'" :class="`${currentTab == 'tweet' ? 'border-b border-primary text-primary font-medium  dark:text-primary': 'text-gray border-b dark:border-gray-800 border-gray-200'} w-1/3 transition-all ease-in-out text-center hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer hover:text-primary py-3 dark:text-gray-400`">트윗</div>
          <div @click="currentTab = 'retweet'" :class="`${currentTab == 'retweet' ? 'border-b border-primary text-primary font-medium dark:text-primary ' : 'text-gray border-b dark:border-gray-800 border-gray-200'} w-1/3 transition-all ease-in-out text-center hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer hover:text-primary dark:text-gray-400 py-3`">리트윗</div>
          <div @click="currentTab = 'like'" :class="`${currentTab == 'like' ? 'border-b border-primary text-primary font-medium dark:text-primary': 'text-gray border-b dark:border-gray-800 border-gray-200'} w-1/3 transition-all ease-in-out text-center hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer hover:text-primary dark:text-gray-400 py-3`">좋아요</div>
      </div>
      <!-- 트윗들 -->
      <div class="overflow-y-auto">
        <Tweet v-for="tweet in currentTab == 'tweet' ? tweets : currentTab == 'retweet' ? reTweets : likeTweets" :key="tweet.id" :currentUser="currentUser" :tweet="tweet" />
      </div>
    </div>
    <!-- 트렌드 섹션 -->
    <Trends />
  </div>
</template>

<script>
import Trends from '../components/Trends.vue'
import Tweet from '../components/Tweet.vue'
import store from '../store'
import moment from 'moment'
import { computed, ref, onBeforeMount } from 'vue'
import { TWEET_COLEECTION, USER_COLEECTION, RETWEET_COLLECTION, LIKE_COLLECTION } from '../firebase'
import getTweetInfo from '../utils/getTweetInfo'

export default {
  components:{
    Trends,
    Tweet
  },
  setup(){
    const currentUser = computed(() => store.state.user)
    const tweets = ref([])
    const reTweets = ref([])
    const likeTweets = ref([])
    const currentTab = ref('tweet')

    onBeforeMount(() => {
        //const profileUID = route.params.uid ?? currentUser.value.uid
        
        USER_COLEECTION.doc(currentUser.value.uid).onSnapshot((doc) => {
          //profileUser.value = doc.data()
          store.commit('SET_USER', doc.data())
        })

        //스냅샷 간 변경사항 예제 https://firebase.google.com/docs/firestore/query-data/listen (실시간업데이트수신대기)
        TWEET_COLEECTION.where('uid', '==', currentUser.value.uid).orderBy('created_at', 'desc').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async (change) => {
                let tweet = await getTweetInfo(change.doc.data(), currentUser.value)

                if(change.type === 'added'){
                    tweets.value.splice(change.newIndex, 0, tweet)
                } else if (change.type === 'modified'){
                    tweets.value.splice(change.oldIndex, 1, tweet)
                } else if (change.type === 'removed'){
                    tweets.value.splice(change.oldIndex, 1)
                }
            })
        })

        RETWEET_COLLECTION.where('uid', '==', currentUser.value.uid)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const doc = await TWEET_COLEECTION.doc(change.doc.data().from_tweet_id).get()
            let tweet = await getTweetInfo(doc.data(), currentUser.value)
            if (change.type === 'added') {
              reTweets.value.splice(change.newIndex, 0, tweet)
            } else if (change.type === 'modified') {
              reTweets.value.splice(change.oldIndex, 1, tweet)
            } else if (change.type === 'removed') {
              reTweets.value.splice(change.oldIndex, 1)
            }
          })
        })
        LIKE_COLLECTION.where('uid', '==', currentUser.value.uid)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            const doc = await TWEET_COLEECTION.doc(change.doc.data().from_tweet_id).get()
            let tweet = await getTweetInfo(doc.data(), currentUser.value)
            if (change.type === 'added') {
              likeTweets.value.splice(change.newIndex, 0, tweet)
            } else if (change.type === 'modified') {
              likeTweets.value.splice(change.oldIndex, 1, tweet)
            } else if (change.type === 'removed') {
              likeTweets.value.splice(change.oldIndex, 1)
            }
          })
        })
    })

    return {
      currentUser,
      moment,
      tweets,
      reTweets,
      likeTweets,
      currentTab
    }
  }
}
</script>

<style>

</style>