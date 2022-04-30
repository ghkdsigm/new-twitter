<template>
    <!--메인파트-->
    <div class="flex-1 border-r border-gray-100 dark:border-gray-800 overflow-y-auto"> <!--:class="isDark ? 'dark' : ''"-->
        <div class="flex flex-col">
        <!--페이지타이틀-->
        <div class="sticky top-0 bg-white bg-opacity-90 dark:bg-black dark:bg-opacity-70 border-b border-gray-100 dark:border-gray-800 px-3 py-2 font-bold text-xl  dark:text-white">
            홈  
        </div>
        <!--트위팅섹션-->
        <div class="flex px-3 py-3 border-b-8 border-gray-100 dark:border-gray-800">
            <img :src="currentUser.profile_image_url" class="w-10 h-10 lg:w-12 lg:h-12 rounded-full hover:opacity-80 cursor-pointer object-cover" />
            <div class="ml-3 flex-1 flex flex-col">
                <textarea v-model="tweetBody" class="w-full text-xl font-thin focus:outline-none mb-4 resize-none dark:bg-black dark:text-white" placeholder="무슨 일이 일어나고 있나요?"></textarea>
                
                <!--이미지업로드-->
                <div class="bottom-1 relative">
                    <img ref="uploadIMG" class="w-2/3 h-auto rounded-lg relative" src="">
                    <button @click="onChangeImg" class="fas fa-image text-gray-600 w-6 h-6 absolute dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 p-1"></button>
                    <input @change="previewImg" type="file" accept="image/*" class="hidden text-white" id="imageInput">
                    <button @click="cancelPrieview" id="cancelPriew" class="absolute hidden text-red-500 hover:text-red-400 bottom-3 left-3 font-extrabold text-3xl rounded-full">x</button>
                </div>
                <!--//이미지업로드-->
                
                <div class="text-right">
                    <button v-if="!tweetBody.length" class="bg-light dark:bg-blue-300 text-white text-base font-medium px-4 py-1 rounded-full">트윗</button>
                    <button v-else @click="onAddTweet" class="bg-primary text-white text-base font-medium px-4 py-1 rounded-full hover:bg-dark">트윗</button>
                </div>             
            </div>
        </div>
        <!--트위트-->
        <Tweet :url="url" :tweet="tweet" :currentUser="currentUser" v-for="tweet in tweets" :key="tweet.id" />
        </div>
    </div>
    <!--트렌드파트-->
    <Trends :tweets="tweets" :currentUser="currentUser" />
</template>

<script>
import Trends from '../components/Trends.vue'
import Tweet from '../components/Tweet.vue'
import { ref, computed, onBeforeMount } from 'vue'
import { storage, TWEET_COLEECTION, USER_COLEECTION, db } from '../firebase'
import firebase from 'firebase'
import store from '../store'
//import addTweet from '../utils/addTweet'
import getTweetInfo from '../utils/getTweetInfo'

export default {
  components:{
    Trends,Tweet
  },
  setup(){
    const tweetBody = ref('')
    const tweets = ref([])

    const uploadIMG = ref(null) //이미지업로드
    const uploadIMGdata = ref(null) //업로드이미지데이터

   

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

    //이미지업로드
    const onChangeImg = () => {
        document.getElementById('imageInput').click()
    }
    
    const previewImg = (e) => {
        const file = e.target.files[0]
        let reader = new FileReader()
        uploadIMGdata.value = file
        reader.onload = function(event) {
            uploadIMG.value.src = event.target.result
        }
        reader.readAsDataURL(file)
        if(!uploadIMG.value.src == ''){
            document.getElementById('cancelPriew').style.display = 'block'
        }
    }

    //미리보기 삭제
    const cancelPrieview = () => {
      uploadIMG.value.src = ''
      document.getElementById('cancelPriew').style.display = 'none'
    }

    //이미지업로드
     const onAddTweet = async () => {
        if(tweetBody.value && uploadIMGdata.value){
            try {
        
            const uploadTask = await storage.ref('picture/' + Date.now() + '/uploadimg').put(uploadIMGdata.value)
            const url = await uploadTask.ref.getDownloadURL()
                    
            const doc = TWEET_COLEECTION.doc()
            await doc.set({
                id: doc.id,
                tweet_body: tweetBody.value,
                uid: currentUser.value.uid,
                created_at: Date.now(),
                num_comments: 0,
                num_retweets: 0,
                num_likes: 0,
                upload_image_url: url               
            })

            document.getElementById('cancelPriew').style.display = 'none'
            tweetBody.value = ''
            store.commit('SET_PICTURE_IMAGE', url)
            uploadIMGdata.value = ''
            uploadIMG.value.src = ''
            await USER_COLEECTION.doc(currentUser.uid).update({
                num_tweets: firebase.firestore.FieldValue.increment(1),
            })

            } catch (e) {
                console.log('on add tweet error on homepage:', e)
            } finally {
                uploadIMGdata.value = ''
                uploadIMG.value.src = ''
            }
        } else if (!uploadIMGdata.value){
            try {        
                    
            const doc = TWEET_COLEECTION.doc()
            await doc.set({
                id: doc.id,
                tweet_body: tweetBody.value,
                uid: currentUser.value.uid,
                created_at: Date.now(),
                num_comments: 0,
                num_retweets: 0,
                num_likes: 0,
            })

            tweetBody.value = ''

            await USER_COLEECTION.doc(currentUser.uid).update({
                num_tweets: firebase.firestore.FieldValue.increment(1),
            })

            } catch (e) {
                console.log('on add tweet error on homepage:', e)
            }   finally {
                uploadIMGdata.value = ''
                uploadIMG.value.src = ''
            }
        }
        


        // if(!uploadIMGdata && !tweetBody.value){
        //     return
        // }        
        // if(tweetBody.value){
        //     try {
        //         await addTweet(tweetBody.value, currentUser.value)
        //         alert('트윗이 등록되었습니다!')
        //         tweetBody.value = ''
        //     } catch (error) {
        //         console.log('on add tweet error on homepage:', error)
        //     }
        // }
        
        // if(uploadIMGdata.value){
        //     try {
        //         const uploadTask = await storage.ref('picture/' + Date.now() + '/uploadimg').put(uploadIMGdata.value)
        //         const url = await uploadTask.ref.getDownloadURL()
                
        //         // let tweet = await addTweet(doc.data(), currentUser.value)
        //         // console.log(tweet)
        //         // console.log(tweet.value)
        //         await TWEET_COLEECTION.doc(tweets.value.id).update({
        //             upload_image_url: url,                    
        //         })
                
                
        //         store.commit('SET_PICTURE_IMAGE', url)
        //         uploadIMG.value.src = ''
        //     } catch(e){
        //         console.log('on add tweet error on homepage:', e)
        //     }
        // }
    }


    // const onAddTweet = async () => {
    //     try {
    //         await addTweet(tweetBody.value, currentUser.value)
    //         alert('트윗이 등록되었습니다!')
    //         tweetBody.value = ''
    //     } catch(e){
    //         console.log('on add tweet error on homepage:', e)
    //     }
    // }

    return { 
        currentUser, 
        tweetBody, 
        onAddTweet, 
        tweets, 
        onAddTweet, 
        onChangeImg,
        previewImg,
        uploadIMG,
        uploadIMGdata,
        cancelPrieview
    }
  }
}
</script>

<style>

</style>