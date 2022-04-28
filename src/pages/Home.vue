<template>
    <!--메인파트-->
    <div class="flex-1 border-r border-gray-100 dark:border-gray-800 overflow-y-auto"> <!--:class="isDark ? 'dark' : ''"-->
        <div class="flex flex-col">
        <!--페이지타이틀-->
        <div class="sticky top-0 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-70 border-b border-gray-100 dark:border-gray-800 px-3 py-2 font-bold text-xl  dark:text-white">
            홈  
            <!-- <span class="absolute right-1">
                <button type="button" class="px-2 mb-1" @click="toggleDarkMode">
                    <i class="far fa-sun bg-gray-100 border-2 border-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm" :class="isShow ? 'block' : 'hidden'"> 밝은모드켜기</i>
                    <i class="far fa-moon bg-gray-500 border-2 border-gray-100 text-white px-2 py-1 rounded-full text-sm" :class="isShow ? 'hidden' : 'block'"> 다크모드켜기</i>
                </button>
            </span> -->
        </div>
        <!--트위팅섹션-->
        <div class="flex px-3 py-3 border-b-8 border-gray-100 dark:border-gray-800">
            <img :src="currentUser.profile_image_url" class="w-10 h-10 lg:w-12 lg:h-12 rounded-full hover:opacity-80 cursor-pointer" />
            <div class="ml-3 flex-1 flex flex-col">
                <textarea v-model="tweetBody" class="w-full text-xl font-thin focus:outline-none mb-3 resize-none dark:bg-black dark:text-white" placeholder="무슨 일이 일어나고 있나요?"></textarea>
                <div class="text-right">
                    <button v-if="!tweetBody.length" class="bg-light dark:bg-blue-300 text-white text-base font-medium px-4 py-1 rounded-full">트윗</button>
                    <button v-else @click="onAddTweet" class="bg-primary text-white text-base font-medium px-4 py-1 rounded-full hover:bg-dark">트윗</button>
                </div>
            </div>
        </div>
        <!--트위트-->
        <Tweet :tweet="tweet" :currentUser="currentUser" v-for="tweet in tweets" :key="tweet.id" />
        </div>
    </div>
    <!--트렌드파트-->
    <Trends :tweets="tweets" :currentUser="currentUser" />
</template>

<script>
import Trends from '../components/Trends.vue'
import Tweet from '../components/Tweet.vue'
import { ref, computed, onBeforeMount } from 'vue'
import { TWEET_COLEECTION, USER_COLEECTION } from '../firebase'
import store from '../store'
import addTweet from '../utils/addTweet'
import getTweetInfo from '../utils/getTweetInfo'

export default {
  components:{
    Trends,Tweet
  },
  setup(){
    const tweetBody = ref('')
    const tweets = ref([])

    //유저정보 vuex에서 가져오기
    const currentUser = computed(() => store.state.user)

    onBeforeMount(() => {
        //스냅샷 간 변경사항 예제 https://firebase.google.com/docs/firestore/query-data/listen (실시간업데이트수신대기)
        TWEET_COLEECTION.orderBy('created_at', 'desc').onSnapshot(snapshot => {
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
    })

    const onAddTweet = async () => {
        try {
            await addTweet(tweetBody.value, currentUser.value)
            tweetBody.value = ''
        } catch(e){
            console.log('on add tweet error on homepage:', e)
        }
    }

    return { currentUser, tweetBody, onAddTweet, tweets }
  }
}
</script>

<style>

</style>